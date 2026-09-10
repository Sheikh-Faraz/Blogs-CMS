import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import {
  getWorkspaceFallback,
  requireWorkspaceMembership,
  WorkspaceAccessError,
} from "@/lib/workspace-access";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

    if (activeWorkspaceId) {
      try {
        await requireWorkspaceMembership(
          user._id.toString(),
          activeWorkspaceId
        );

        const workspace = await Workspace.findById(activeWorkspaceId);

        if (!workspace) {
          return NextResponse.json(
            { error: "Workspace not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ workspace, recovered: false });
      } catch (error) {
        if (error instanceof WorkspaceAccessError) {
          return NextResponse.json(
            {
              error: error.message,
              code: error.code,
              workspaceId: error.workspaceId,
              defaultWorkspaceId: error.defaultWorkspaceId,
            },
            { status: 403 }
          );
        }

        throw error;
      }
    }

    const userWithDefault = await User.findById(user._id).select(
      "defaultWorkspace"
    );

    if (!userWithDefault?.defaultWorkspace) {
      return NextResponse.json(
        { error: "No active workspace" },
        { status: 404 }
      );
    }

    const defaultWorkspaceId = await getWorkspaceFallback(
      user._id.toString()
    );

    if (!defaultWorkspaceId) {
      return NextResponse.json(
        { error: "No workspace available" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(defaultWorkspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      workspace,
      recovered: true,
      recoveryCode: "WORKSPACE_ACCESS_RECOVERED",
      defaultWorkspaceId,
      previousWorkspaceId: null,
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
