import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/getCurrentUser";
import connectDB from "@/lib/db";

import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";

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

    if (membership) {
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
    }

    // The user no longer belongs to the active workspace.
    // Distinguish a kick from an ordinary stale/invalid workspace.
    const removal = await WorkspaceRemoval.findOne({
      user: user._id,
      workspace: activeWorkspaceId,
      reason: "KICKED",
    }).sort({ createdAt: -1 });

    const defaultWorkspaceId = user.defaultWorkspace?.toString();

    if (removal) {
      return NextResponse.json(
        {
          error: "You were removed from this workspace",
          code: "WORKSPACE_ACCESS_REVOKED",
          workspaceId: activeWorkspaceId,
          defaultWorkspaceId: defaultWorkspaceId || null,
        },
        { status: 403 }
      );
    }

    // Not a member for another reason. Recover the active workspace
    // to a valid default workspace when possible.
    if (!defaultWorkspaceId) {
      return NextResponse.json(
        {
          error: "You are not a member of this workspace",
          code: "WORKSPACE_ACCESS_DENIED",
        },
        { status: 403 }
      );
    }

    const defaultMembership = await Membership.findOne({
      user: user._id,
      workspace: defaultWorkspaceId,
    });

    const defaultWorkspace = defaultMembership
      ? await Workspace.findById(defaultWorkspaceId)
      : null;

    if (!defaultMembership || !defaultWorkspace) {
      return NextResponse.json(
        {
          error: "You are not a member of this workspace",
          code: "WORKSPACE_ACCESS_DENIED",
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      workspace: defaultWorkspace,
      recovered: true,
      previousWorkspaceId: activeWorkspaceId,
    });

    response.cookies.set("activeWorkspaceId", defaultWorkspaceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
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
