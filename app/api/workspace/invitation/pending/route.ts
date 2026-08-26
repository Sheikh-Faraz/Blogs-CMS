import { NextRequest, NextResponse } from "next/server";

import crypto from "crypto";
import { sendInvitationEmail } from "@/lib/email";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";

import Invitation from "@/models/Invitation";

// import { requireRole } from "@/lib/roleValidator";
import { requireInvitationPermission, } from "@/lib/invitationPermissions";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspace = await getActiveWorkspace(currentUser._id.toString());

    // For now, only OWNER can manage invitations.
    // await requireRole(
    //   currentUser._id.toString(),
    //   workspace._id.toString(),
    //   ["OWNER"]
    // );

    await requireInvitationPermission(
      currentUser._id.toString(),
      workspace._id.toString()
    );

    const invitations = await Invitation.find({
      workspace: workspace._id,
      status: "PENDING",
    })
      .select(
        "_id email role invitedBy status expiresAt createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Mark already-expired invitations.
    // This also keeps the pending list clean.
    const now = new Date();

    const activeInvitations = [];
    const expiredIds = [];

    for (const invitation of invitations) {
      if (new Date(invitation.expiresAt) < now) {
        expiredIds.push(invitation._id);
        continue;
      }

      activeInvitations.push(invitation);
    }

    if (expiredIds.length > 0) {
      await Invitation.updateMany(
        {
          _id: { $in: expiredIds },
          status: "PENDING",
        },
        {
          $set: {
            status: "EXPIRED",
          },
        }
      );
    }

    return NextResponse.json(
      { invitations: activeInvitations, },
      { status: 200 }
    );
  } catch (error) {

    console.error("Fetch pending invitations error:", error);

    return NextResponse.json(
      {message: "Failed to fetch pending invitations",},
      { status: 500 }
    );
  }
};



export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspace = await getActiveWorkspace(
      currentUser._id.toString()
    );

    // await requireRole(
    //   currentUser._id.toString(),
    //   workspace._id.toString(),
    //   ["OWNER"]
    // );

    await requireInvitationPermission(
      currentUser._id.toString(),
      workspace._id.toString()
    );

    const body = await req.json();

    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        {message: "Invitation ID is required",},
        { status: 400 }
      );
    }

    const invitation =
      await Invitation.findOne({
        _id: invitationId,
        workspace: workspace._id,
        status: "PENDING",
      });

    if (!invitation) {
      return NextResponse.json(
        {message: "Pending invitation not found",},
        { status: 404 }
      );
    }

    invitation.status = "REVOKED";

    await invitation.save();

    return NextResponse.json(
      {message: "Invitation revoked successfully",},
      { status: 200 }
    );

  } catch (error) {

    console.error("Revoke invitation error:", error);

    return NextResponse.json(
      {message: "Failed to revoke invitation",},
      { status: 500 }
    );

  }
};




export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspace = await getActiveWorkspace(
      currentUser._id.toString()
    );

    // await requireRole(
    //   currentUser._id.toString(),
    //   workspace._id.toString(),
    //   ["OWNER"]
    // );

    await requireInvitationPermission(
      currentUser._id.toString(),
      workspace._id.toString()
    );

    const body = await req.json();

    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { message: "Invitation ID is required", },
        { status: 400 }
      );
    }

    const invitation =
      await Invitation.findOne({
        _id: invitationId,
        workspace: workspace._id,
        status: "PENDING",
      });

    if (!invitation) {
      return NextResponse.json(
        { message: "Pending invitation not found", },
        { status: 404 }
      );
    }

    // Generate a completely new token.
    const rawToken = crypto
      .randomBytes(32)
      .toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    );

    // Save the new token + new expiry.
    invitation.tokenHash = tokenHash;
    invitation.expiresAt = expiresAt;

    await invitation.save();

    try {
      const appUrl = process.env.APP_URL || "http://localhost:3000";

      const invitationUrl = `${appUrl}/invitation/accept?token=${encodeURIComponent(rawToken)}`;

      await sendInvitationEmail({
        email: invitation.email,
        workspaceName: workspace.name,
        role: invitation.role,
        invitationUrl,
      });

    } catch (emailError) {

      console.error("Resend invitation email error:", emailError);

      return NextResponse.json(
        { message: "Invitation was updated, but the email could not be sent", },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Invitation resent successfully",

        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 200 }
    );

  } catch (error) {

    console.error( "Resend invitation error:", error );

    return NextResponse.json(
      { message: "Failed to resend invitation", },
      { status: 500 }
    );
  }
}


