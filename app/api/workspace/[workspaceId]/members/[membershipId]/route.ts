import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { canManageTargetRole, hasPermission, type WorkspaceRole } from "@/lib/permissions";

const MANAGEABLE_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;
type ManageableRole = (typeof MANAGEABLE_ROLES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; membershipId: string }> }
) {
  try {
    await dbConnect();

    const { workspaceId, membershipId } = await params;
    const { role } = (await req.json()) as { role?: string };

    if (!role || !MANAGEABLE_ROLES.includes(role as ManageableRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role. Allowed roles are ADMIN, EDITOR and VIEWER." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const currentMembership = await Membership.findOne({
      user: currentUser._id,
      workspace: workspaceId,
    });

    if (!currentMembership) {
      return NextResponse.json(
        { success: false, message: "You are not a member of this workspace" },
        { status: 403 }
      );
    }

    const actorRole = currentMembership.role as WorkspaceRole;

    if (!hasPermission(actorRole, "MANAGE_MEMBER_ROLES")) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to change member roles" },
        { status: 403 }
      );
    }

    const targetMembership = await Membership.findOne({
      _id: membershipId,
      workspace: workspaceId,
    });

    if (!targetMembership) {
      return NextResponse.json(
        { success: false, message: "Workspace member not found" },
        { status: 404 }
      );
    }

    if (targetMembership.user.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You cannot change your own workspace role" },
        { status: 403 }
      );
    }

    const targetRole = targetMembership.role as WorkspaceRole;

    if (!canManageTargetRole(actorRole, targetRole)) {
      return NextResponse.json(
        {
          success: false,
          message:
            actorRole === "ADMIN"
              ? "Admins can only manage Editors and Viewers"
              : "The workspace owner cannot be changed here",
        },
        { status: 403 }
      );
    }

    if (actorRole === "ADMIN" && role === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only the workspace owner can promote a member to admin" },
        { status: 403 }
      );
    }

    targetMembership.role = role;
    await targetMembership.save();

    const updatedMembership = await Membership.findById(targetMembership._id)
      .populate({
        path: "user",
        select: "fullName email profilePic location about socials createdAt",
      });

    return NextResponse.json(
      { success: true, message: "Member role updated successfully", member: updatedMembership },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating workspace member role:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update member role",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; membershipId: string }> }
) {
  try {
    await dbConnect();

    const { workspaceId, membershipId } = await params;
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const actorMembership = await Membership.findOne({
      user: user._id,
      workspace: workspaceId,
    });

    if (!actorMembership) {
      return NextResponse.json(
        { message: "You are not a member of this workspace" },
        { status: 403 }
      );
    }

    const actorRole = actorMembership.role as WorkspaceRole;

    if (!hasPermission(actorRole, "MANAGE_MEMBER_ROLES")) {
      return NextResponse.json(
        { message: "You don't have permission to kick members" },
        { status: 403 }
      );
    }

    const targetMembership = await Membership.findOne({
      _id: membershipId,
      workspace: workspaceId,
    });

    if (!targetMembership) {
      return NextResponse.json(
        { message: "Member not found in this workspace" },
        { status: 404 }
      );
    }

    const targetRole = targetMembership.role as WorkspaceRole;

    if (targetMembership.user.toString() === user._id.toString()) {
      return NextResponse.json(
        { message: "You cannot kick yourself. Use Leave Workspace instead." },
        { status: 400 }
      );
    }

    if (targetRole === "OWNER") {
      return NextResponse.json(
        { message: "The workspace owner cannot be kicked" },
        { status: 403 }
      );
    }

    if (!canManageTargetRole(actorRole, targetRole)) {
      return NextResponse.json(
        { message: "You don't have permission to kick this member" },
        { status: 403 }
      );
    }

    // Record the reason before deleting membership so the kicked user's
    // next workspace validation can distinguish a kick from other access loss.
    await WorkspaceRemoval.findOneAndUpdate(
      {
        user: targetMembership.user,
        workspace: workspaceId,
        reason: "KICKED",
      },
      {
        user: targetMembership.user,
        workspace: workspaceId,
        reason: "KICKED",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Membership.deleteOne({ _id: targetMembership._id });

    return NextResponse.json({
      success: true,
      message: "Member removed from the workspace",
    });
  } catch (error) {
    console.error("Kick member error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove member",
      },
      { status: 500 }
    );
  }
}
