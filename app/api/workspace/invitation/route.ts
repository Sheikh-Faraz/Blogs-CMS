import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";

import connectDB from "@/lib/db";

// Models
import Invitation from "@/models/Invitation";
import Membership from "@/models/Membership";
import User from "@/models/User";


// To send the invitation email to user
import { sendInvitationEmail } from "@/lib/email";


// import { requireRole } from "@/lib/roleValidator";
import {
  requireInvitationPermission,
  canInviteRole,
  type InvitationRole,
  type WorkspaceRole,
} from "@/lib/invitationPermissions";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get current authenticated user
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's currently active workspace
    const workspace = await getActiveWorkspace(
      currentUser._id.toString()
    );

    // Only OWNER can invite for now
    // await requireRole(
    //   currentUser._id.toString(),
    //   workspace._id.toString(),
    //   ["OWNER"]
    // );

    const membership =
      await requireInvitationPermission(
        currentUser._id.toString(),
        workspace._id.toString()
      );

    const body = await req.json();

    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // const allowedRoles = [
    //   "ADMIN",
    //   "EDITOR",
    //   "VIEWER",
    // ];

    // if (!allowedRoles.includes(role)) {
    //   return NextResponse.json(
    //     { message: "Invalid invitation role" },
    //     { status: 400 }
    //   );
    // }

    const allowedRoles: InvitationRole[] = [
      "ADMIN",
      "EDITOR",
      "VIEWER",
    ];

    if (
      !allowedRoles.includes(
        role as InvitationRole
      )
    ) {
      return NextResponse.json(
        { message: "Invalid invitation role", },
        { status: 400 }
      );
    }

    if (
      !canInviteRole(
        membership.role as WorkspaceRole,
        role as InvitationRole
      )
    ) {

      return NextResponse.json(
        { message: "You are not allowed to invite a user with this role", },
        { status: 403 }
      );
    }

    // Check whether this email already belongs
    // to a user in the workspace
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      const existingMembership = await Membership.findOne({
        user: existingUser._id,
        workspace: workspace._id,
      });

      if (existingMembership) {
        return NextResponse.json(
          {
            message:
              "This user is already a member of this workspace",
          },
          { status: 409 }
        );
      }
    }

    // Check for an existing pending invitation
    const existingInvitation = await Invitation.findOne({
      workspace: workspace._id,
      email: normalizedEmail,
      status: "PENDING",
    });

    if (existingInvitation) {
      return NextResponse.json(
        { message: "A pending invitation already exists for this email", },
        { status: 409 }
      );
    }

    // Generate secure token
    const rawToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Store only the hash in MongoDB
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Invitation expires in 7 days
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const invitation = await Invitation.create({
      workspace: workspace._id,
      email: normalizedEmail,
      role,
      invitedBy: currentUser._id,
      tokenHash,
      expiresAt,
      status: "PENDING",
    });

     
    
    // SIDE NOTE: 
    // If email sending fails, MongoDB already contains: PENDING Invitation but the recipient never gets the email.
    // That's not ideal, try solve that with a transaction, right now implementing try catch but eventually change to 
    // mongo transaction so that it can automic
    // try {

    //   const appUrl = process.env.APP_URL || "http://localhost:3000";

    //   const invitationUrl = `${appUrl}/invitation/accept?token=${encodeURIComponent(rawToken)}`;

    //   await sendInvitationEmail({
    //     email: normalizedEmail,
    //     workspaceName: workspace.name,
    //     role,
    //     invitationUrl,
    //   });

    // } catch (emailError) {
      
    //   await Invitation.deleteOne({ _id: invitation._id,});
    //   throw emailError;

    // };



    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const invitationUrl = `${appUrl}/invitation/accept?token=${encodeURIComponent(rawToken)}`;


    await sendInvitationEmail({
      email: normalizedEmail,
      workspaceName: workspace.name,
      role,
      invitationUrl,
      inviterName: currentUser.fullName,
    });

    // if (process.env.NODE_ENV === "development") {
      
    //   console.log( "DEV INVITATION URL:", invitationUrl);

    // } else {

    //   await sendInvitationEmail({
    //     email: normalizedEmail,
    //     workspaceName: workspace.name,
    //     role,
    //     invitationUrl,
    //   });

    // };



    return NextResponse.json(
      {
        message: "Invitation created successfully",

        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
        },

        //  ...(process.env.NODE_ENV === "development" && {invitationUrl,}),

      },
      { status: 201 }
    );
    
  } catch (error) {

    console.error("Create invitation error:", error);

    return NextResponse.json(
      {
        message: "Failed to create invitation",
      },
      { status: 500 }
    );
  }
}