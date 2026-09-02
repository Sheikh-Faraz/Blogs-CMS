import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Membership from "@/models/Membership";
import { getCurrentUser } from "@/lib/getCurrentUser";

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
        {
          success: false,
          message: "Invalid role. Allowed roles are ADMIN, EDITOR and VIEWER.",
        },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser(req);

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

    if (currentMembership.role !== "OWNER" && currentMembership.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only the owner or an admin can change member roles" },
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

    // Never allow a member to change their own role here.
    if (targetMembership.user.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You cannot change your own workspace role" },
        { status: 403 }
      );
    }

    // The owner is protected from normal role changes.
    if (targetMembership.role === "OWNER") {
      return NextResponse.json(
        { success: false, message: "The workspace owner cannot be changed here" },
        { status: 403 }
      );
    }

    // Admins can manage editors/viewers, but not other admins.
    if (currentMembership.role === "ADMIN" && targetMembership.role === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admins cannot change another admin's role" },
        { status: 403 }
      );
    }

    // Admins cannot promote a member to admin. Only the owner can do that.
    if (currentMembership.role === "ADMIN" && role === "ADMIN") {
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
      {
        success: true,
        message: "Member role updated successfully",
        member: updatedMembership,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating workspace member role:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update member role",
      },
      { status: 500 }
    );
  }
}
