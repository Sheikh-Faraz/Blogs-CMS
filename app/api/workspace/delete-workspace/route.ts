import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import cloudinary from "@/lib/cloudinary";

import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Membership from "@/models/Membership";
import Tag from "@/models/Tags";
import User from "@/models/User";
import Workspace from "@/models/Workspace";

class WorkspaceDeletionError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function DELETE(req: NextRequest) {
  const activeWorkspaceId = req.cookies.get("activeWorkspaceId")?.value;

  if (!activeWorkspaceId) {
    return NextResponse.json(
      { error: "No active workspace" },
      { status: 404 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(activeWorkspaceId)) {
    return NextResponse.json(
      { error: "Invalid active workspace" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);
    const userId = currentUser._id;
    const workspaceId = new mongoose.Types.ObjectId(activeWorkspaceId);
    const session = await mongoose.startSession();

    let nextWorkspaceId: mongoose.Types.ObjectId | null = null;
    let cloudinaryPublicIds: string[] = [];

    try {
      await session.withTransaction(async () => {
        const [workspace, requesterMembership, workspaceMemberships, blogs] =
          await Promise.all([
            Workspace.findById(workspaceId).session(session),
            Membership.findOne({
              user: userId,
              workspace: workspaceId,
            }).session(session),
            Membership.find({ workspace: workspaceId }).session(session),
            Blog.find({ workspace: workspaceId })
              .select("heroImagePublicId")
              .session(session),
          ]);

        if (!workspace) {
          throw new WorkspaceDeletionError("Workspace not found", 404);
        }

        if (!requesterMembership || requesterMembership.role !== "OWNER") {
          throw new WorkspaceDeletionError(
            "Only the workspace owner can delete a workspace",
            403
          );
        }

        // Every member must still belong to another workspace after this one
        // disappears; otherwise deleting this shared workspace would orphan them.
        const fallbackMemberships = await Promise.all(
          workspaceMemberships.map((membership) =>
            Membership.findOne({
              user: membership.user,
              workspace: { $ne: workspaceId },
            })
              .sort({ createdAt: 1 })
              .session(session)
          )
        );

        if (fallbackMemberships.some((membership) => !membership)) {
          throw new WorkspaceDeletionError(
            "This workspace cannot be deleted because every member must keep at least one workspace",
            409
          );
        }

        const requesterIndex = workspaceMemberships.findIndex(
          (membership) => membership.user.toString() === userId.toString()
        );
        nextWorkspaceId = fallbackMemberships[requesterIndex]!.workspace;

        // Update default workspaces before deleting the target workspace.
        await User.bulkWrite(
          workspaceMemberships.map((membership, index) => ({
            updateOne: {
              filter: {
                _id: membership.user,
                defaultWorkspace: workspaceId,
              },
              update: {
                $set: {
                  defaultWorkspace: fallbackMemberships[index]!.workspace,
                },
              },
            },
          })),
          { session }
        );

        await Promise.all([
          Blog.deleteMany({ workspace: workspaceId }).session(session),
          Category.deleteMany({ workspace: workspaceId }).session(session),
          Tag.deleteMany({ workspace: workspaceId }).session(session),
          Membership.deleteMany({ workspace: workspaceId }).session(session),
          Workspace.deleteOne({ _id: workspaceId }).session(session),
        ]);

        cloudinaryPublicIds = [
          workspace.logoPublicId,
          workspace.bannerPublicId,
          ...blogs.map((blog) => blog.heroImagePublicId),
        ].filter((publicId): publicId is string => Boolean(publicId));
      });
    } finally {
      await session.endSession();
    }

    // External media deletion cannot participate in MongoDB's transaction.
    // A media failure is logged, but never rolls back the completed database deletion.
    const mediaDeletionResults = await Promise.allSettled(
      cloudinaryPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    mediaDeletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to delete Cloudinary asset ${cloudinaryPublicIds[index]}:`,
          result.reason
        );
      }
    });

    if (!nextWorkspaceId) {
      throw new Error("A fallback workspace was not found after deletion");
    }

    const nextWorkspace = await Workspace.findById(nextWorkspaceId).lean();

    if (!nextWorkspace) {
      throw new Error("A fallback workspace was not found after deletion");
    }

    const response = NextResponse.json({
      message: "Workspace deleted successfully",
      workspace: nextWorkspace,
    });

    response.cookies.set("activeWorkspaceId", nextWorkspaceId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof WorkspaceDeletionError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Delete workspace error:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
