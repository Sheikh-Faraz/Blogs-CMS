import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";

// Models
import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { workspaceId } = await req.json();

    if (!workspaceId) {
      return NextResponse.json(
        { message: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Find user's membership in this workspace
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspaceId,
    });

    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 404 }
      );
    }

    // Owner cannot leave their own workspace
    if (membership.role === "OWNER") {
      return NextResponse.json(
        { message: "Workspace owners cannot leave their own workspace" },
        { status: 403 }
      );
    }

    // Make sure workspace actually exists
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check how many workspaces the user belongs to
    const memberships = await Membership.find({
      user: user._id,
    }).sort({ createdAt: 1 });

    if (memberships.length <= 1) {
      return NextResponse.json(
        { message: "You cannot leave your only workspace. You must belong to another workspace first.", },
        { status: 400 }
      );
    }

    // Check whether this is the currently active workspace
    const activeWorkspace = await getActiveWorkspace(
      user._id.toString()
    );

    const leavingActiveWorkspace = activeWorkspace?._id.toString() === workspaceId.toString();

    // Remove membership
    await Membership.deleteOne({
      _id: membership._id,
    });

    return NextResponse.json({
      success: true,
      message: "You have left the workspace",
      leavingActiveWorkspace,
    });
  } catch (error) {
    console.error("Leave workspace error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to leave workspace",
      },
      { status: 500 }
    );
  }
}