import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/getCurrentUser";

import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {

  const cookieStore = await cookies();

  const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

  if (!activeWorkspaceId) {
    return NextResponse.json(
      { error: "No active workspace" },
      { status: 404 }
    );
  }

  // Get authenticated user here
  const userId = (await getCurrentUser(req))?._id;

  const membership = await Membership.findOne({
    user: userId,
    workspace: activeWorkspaceId,
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Not a member of this workspace" },
      { status: 403 }
    );
  }

  const workspace = await Workspace.findById(activeWorkspaceId);

  if (!workspace) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    workspace,
  });
}