import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "workspace";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);
    const { name } = await req.json();
    const workspaceName = typeof name === "string" ? name.trim() : "";

    if (!workspaceName) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    if (workspaceName.length > 100) {
      return NextResponse.json(
        { error: "Workspace name must be 100 characters or fewer" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(workspaceName);
    let slug = baseSlug;
    let suffix = 1;

    while (await Workspace.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const session = await mongoose.startSession();
    let workspaceId: mongoose.Types.ObjectId | null = null;

    // Basically this session use means the both the workspace and membership are created and not one in case of failure
    try {
      await session.withTransaction(async () => {     
        
        const [workspace] = await Workspace.create(
          [{ name: workspaceName, slug }],
          { session }
        );

        await Membership.create(
          [{
            user: currentUser._id,
            workspace: workspace._id,
            role: "OWNER",
          }],
          { session }
        );

        workspaceId = workspace._id;
      });
    } finally {
      await session.endSession();
    }

    if (!workspaceId) {
      throw new Error("Workspace creation did not return an ID");
    }

    const workspace = await Workspace.findById(workspaceId).lean();
    const response = NextResponse.json(
      { message: "Workspace created successfully", workspace },
      { status: 201 }
    );

    // A newly created workspace becomes active immediately.
    response.cookies.set("activeWorkspaceId", workspaceId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Create workspace error:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}
