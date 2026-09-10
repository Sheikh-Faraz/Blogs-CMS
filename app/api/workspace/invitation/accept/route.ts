import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { clearWorkspaceRemoval } from "@/lib/workspace-access";

// Models
import Invitation from "@/models/Invitation";
import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";
import User from "@/models/User";

// ============================================================
// GET — Validate invitation
// ============================================================

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Invitation token is required" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const invitation = await Invitation.findOne({
      tokenHash,
      status: "PENDING",
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation is invalid or has already been used" },
        { status: 404 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";
      await invitation.save();

      return NextResponse.json({ message: "This invitation has expired" }, { status: 410 });
    }

    const workspace = await Workspace.findById(invitation.workspace).select("name slug");

    if (!workspace) {
      return NextResponse.json(
        { message: "The workspace associated with this invitation no longer exists" },
        { status: 404 }
      );
    }

    const invitedUser = await User.findOne({ email: invitation.email }).select("_id email");

    let currentUser = null;

    try {
      currentUser = await getCurrentUser(req);
    } catch {
      currentUser = null;
    }

    const isAuthenticated = !!currentUser;
    const emailMatches =
      !!currentUser &&
      currentUser.email.toLowerCase() === invitation.email.toLowerCase();

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
        accountExists: !!invitedUser,
        isAuthenticated,
        emailMatches,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Validate invitation error:", error);

    return NextResponse.json(
      { message: "Failed to validate invitation" },
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
    const { token, invitationId } = body;

    if (!token && !invitationId) {
      return NextResponse.json(
        { message: "Invitation token or invitation ID is required" },
        { status: 400 }
      );
    }

    let invitation;

    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      invitation = await Invitation.findOne({ tokenHash, status: "PENDING" });
    } else {
      invitation = await Invitation.findOne({ _id: invitationId, status: "PENDING" });
    }

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation is invalid, expired, or has already been used" },
        { status: 404 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";
      await invitation.save();

      return NextResponse.json({ message: "This invitation has expired" }, { status: 410 });
    }

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "You must be logged in to accept this invitation" },
        { status: 401 }
      );
    }

    if (currentUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        { message: "This invitation was sent to a different email address" },
        { status: 403 }
      );
    }

    const existingMembership = await Membership.findOne({
      user: currentUser._id,
      workspace: invitation.workspace,
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "You are already a member of this workspace" },
        { status: 409 }
      );
    }

    const membership = await Membership.create({
      user: currentUser._id,
      workspace: invitation.workspace,
      role: invitation.role,
    });

    // The user has access again, so any previous KICKED record is stale.
    await clearWorkspaceRemoval(
      currentUser._id.toString(),
      invitation.workspace.toString()
    );

    invitation.status = "ACCEPTED";
    await invitation.save();

    return NextResponse.json(
      {
        message: "Invitation accepted successfully",
        membership: {
          id: membership._id,
          workspace: membership.workspace,
          role: membership.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Accept invitation error:", error);

    return NextResponse.json(
      { message: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE — Decline invitation
// ============================================================

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { token, invitationId } = body;

    if (!token && !invitationId) {
      return NextResponse.json(
        { message: "Invitation token or invitation ID is required" },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "You must be logged in to decline this invitation" },
        { status: 401 }
      );
    }

    let invitation;

    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      invitation = await Invitation.findOne({ tokenHash, status: "PENDING" });
    } else {
      invitation = await Invitation.findOne({ _id: invitationId, status: "PENDING" });
    }

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation is invalid or has already been used" },
        { status: 404 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";
      await invitation.save();

      return NextResponse.json({ message: "This invitation has expired" }, { status: 410 });
    }

    if (currentUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        { message: "This invitation was sent to a different email address" },
        { status: 403 }
      );
    }

    invitation.status = "DECLINED";
    await invitation.save();

    return NextResponse.json(
      { message: "Invitation declined successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Decline invitation error:", error);

    return NextResponse.json(
      { message: "Failed to decline invitation" },
      { status: 500 }
    );
  }
}
