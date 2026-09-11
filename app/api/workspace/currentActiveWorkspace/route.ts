import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/getCurrentUser";
import connectDB from "@/lib/db";

import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

    if (!activeWorkspaceId) {
      return NextResponse.json(
        { error: "No active workspace" },
        { status: 404 }
      );
    }

    const membership = await Membership.findOne({
      user: user._id,
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
      recovered: false,
    });
  } catch (error) {
    console.error("Current active workspace error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch current workspace",
      },
      { status: 500 }
    );
  }
}
