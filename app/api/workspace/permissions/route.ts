import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import {
  getPermissionsForRole,
  type WorkspaceRole,
} from "@/lib/permissions";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspace._id,
    }).lean();

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this workspace" },
        { status: 403 }
      );
    }

    const role = membership.role as WorkspaceRole;

    return NextResponse.json({
      role,
      permissions: getPermissionsForRole(role),
      workspaceId: workspace._id.toString(),
    });
  } catch (error) {
    console.error("Workspace permissions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}
