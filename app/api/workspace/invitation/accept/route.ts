import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";


// Models
import Invitation from "@/models/Invitation";
import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";


// ============================================================
// GET — Validate invitation
// ============================================================

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Invitation token is required",
        },
        { status: 400 }
      );
    }

    // Hash the token so we can compare it
    // with the hash stored in MongoDB
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find pending invitation
    const invitation = await Invitation.findOne({
      tokenHash,
      status: "PENDING",
    });

    if (!invitation) {
      return NextResponse.json(
        {
          message:
            "Invitation is invalid or has already been used",
        },
        { status: 404 }
      );
    }

    // Check expiration
    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";

      await invitation.save();

      return NextResponse.json(
        {
          message: "This invitation has expired",
        },
        { status: 410 }
      );
    }

    // Get workspace information
    const workspace =
      await Workspace.findById(
        invitation.workspace
      ).select("name slug");

    if (!workspace) {
      return NextResponse.json(
        {
          message:
            "The workspace associated with this invitation no longer exists",
        },
        { status: 404 }
      );
    }

    // Return only information that the
    // invitation page actually needs
    return NextResponse.json(
      {
        invitation: {
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },

        workspace: {
          name: workspace.name,
          slug: workspace.slug,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    
    console.error( "Validate invitation error:", error );

    return NextResponse.json(
      {
        message:
          "Failed to validate invitation",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// POST — Accept invitation
// ============================================================

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          message:
            "Invitation token is required",
        },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const invitation =
      await Invitation.findOne({
        tokenHash,
        status: "PENDING",
      });

    if (!invitation) {
      return NextResponse.json(
        {
          message:
            "Invitation is invalid, expired, or has already been used",
        },
        { status: 404 }
      );
    }

    // Check expiration
    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";

      await invitation.save();

      return NextResponse.json(
        {
          message:
            "This invitation has expired",
        },
        { status: 410 }
      );
    }

    // User must be logged in for the
    // existing-user acceptance flow
    const currentUser =
      await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        {
          message:
            "You must be logged in to accept this invitation",
        },
        { status: 401 }
      );
    }

    // Make sure the invitation belongs
    // to the logged-in user's email
    if (
      currentUser.email.toLowerCase() !==
      invitation.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          message:
            "This invitation was sent to a different email address",
        },
        { status: 403 }
      );
    }

    // Check if membership already exists
    const existingMembership =
      await Membership.findOne({
        user: currentUser._id,
        workspace: invitation.workspace,
      });

    if (existingMembership) {
      return NextResponse.json(
        {
          message:
            "You are already a member of this workspace",
        },
        { status: 409 }
      );
    }

    // Create membership
    const membership =
      await Membership.create({
        user: currentUser._id,
        workspace: invitation.workspace,
        role: invitation.role,
      });

    // Mark invitation as accepted
    invitation.status = "ACCEPTED";

    await invitation.save();

    return NextResponse.json(
      {
        message:
          "Invitation accepted successfully",

        membership: {
          id: membership._id,
          workspace:
            membership.workspace,
          role: membership.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Accept invitation error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to accept invitation",
      },
      { status: 500 }
    );
  }
}