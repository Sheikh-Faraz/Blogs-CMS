import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Membership from "@/models/Membership";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getVisibleMemberFields, hasPermission, type WorkspaceRole } from "@/lib/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const { workspaceId } = await params;
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
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

    const role = currentMembership.role as WorkspaceRole;
    const userFields = getVisibleMemberFields(role).join(" ");
    const canViewPrivateDetails = hasPermission(role, "VIEW_MEMBER_DETAILS");

    // Everyone gets basic member information. Sensitive profile details are
    // selected from MongoDB only for OWNER/ADMIN members.
    const members = await Membership.find({ workspace: workspaceId })
      .populate({
        path: "user",
        select: userFields,
      })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        members,
        viewer: {
          role,
          permissions: {
            canViewPrivateDetails,
            canManageRoles: hasPermission(role, "MANAGE_MEMBER_ROLES"),
            canInviteMembers: hasPermission(role, "INVITE_MEMBERS"),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workspace members:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch workspace members",
      },
      { status: 500 }
    );
  }
}
