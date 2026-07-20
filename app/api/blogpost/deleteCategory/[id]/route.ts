import connectDB from "@/lib/db";

import Category from "@/models/Category";
import Blog from "@/models/Blog";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { requireMembership } from "@/lib/premission";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const nextReq = req as any;

    // AUTH
    const user = await getCurrentUser(nextReq);

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ACTIVE WORKSPACE
    const workspace = await getActiveWorkspace(
      user._id.toString()
    );

    // MEMBERSHIP
    const membership = await requireMembership(
      user._id.toString(),
      workspace._id.toString()
    );

    // PERMISSION
    if (membership.role === "VIEWER") {
      return Response.json(
        {
          error:
            "You do not have permission to delete categories",
        },
        { status: 403 }
      );
    }

    // FIND CATEGORY FIRST
    const category = await Category.findOne({
      _id: id,
      workspace: workspace._id,
    });

    if (!category) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // REMOVE CATEGORY FROM ALL BLOGS USING IT
    await Blog.updateMany(
      {
        category: category._id,
        workspace: workspace._id,
      },
      {
        $unset: {
          category: "",
        },
      }
    );

    // DELETE CATEGORY
    await Category.deleteOne({
      _id: category._id,
      workspace: workspace._id,
    });

    return Response.json(
      {
        message:
          "Category deleted successfully",
        category,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting category:", err);

    return Response.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}