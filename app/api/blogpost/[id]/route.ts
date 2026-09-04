import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tags";
import Membership from "@/models/Membership";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { hasPermission } from "@/lib/permissions";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspace._id,
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "UPDATE_BLOG")) {
      return NextResponse.json(
        { error: "You do not have permission to update blogs" },
        { status: 403 }
      );
    }

    const existingBlog = await Blog.findOne({
      _id: id,
      workspace: workspace._id,
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim() || "";
    const slug = formData.get("slug")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "draft";
    const contentRaw = formData.get("content")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const tags = JSON.parse(formData.get("tags")?.toString() || "[]");

    if (!title || !slug || !contentRaw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = JSON.parse(contentRaw);
    if (!Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ error: "Blog content is required" }, { status: 400 });
    }

    let finalSlug = slug;
    let count = 1;
    while (
      await Blog.findOne({
        slug: finalSlug,
        workspace: workspace._id,
        _id: { $ne: existingBlog._id },
      })
    ) {
      finalSlug = `${slug}-${count}`;
      count += 1;
    }

    let heroImage = existingBlog.heroImage || "";
    let heroImagePublicId = existingBlog.heroImagePublicId || "";
    const heroFile = formData.get("heroImage");
    const heroImageUrlFromClient = formData.get("heroImageUrl")?.toString() || "";

    if (heroFile instanceof File && heroFile.size > 0) {
      const uploaded = await uploadToCloudinary(heroFile, "blog-images");
      heroImage = uploaded.url;
      heroImagePublicId = uploaded.public_id;
    } else if (heroImageUrlFromClient) {
      heroImage = heroImageUrlFromClient;
      if (heroImageUrlFromClient !== existingBlog.heroImage) {
        heroImagePublicId = "";
      }
    }

    let categoryDoc = null;
    if (category.trim()) {
      const normalizedCategory = category.trim();
      categoryDoc = await Category.findOne({
        name: normalizedCategory,
        workspace: workspace._id,
      });

      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: normalizedCategory,
          workspace: workspace._id,
        });
      }
    }

    const tagDocs: any[] = [];
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag !== "string" || !tag.trim()) continue;
        const normalizedTag = tag.trim();
        let existingTag = await Tag.findOne({
          name: normalizedTag,
          workspace: workspace._id,
        });

        if (!existingTag) {
          existingTag = await Tag.create({
            name: normalizedTag,
            workspace: workspace._id,
          });
        }

        tagDocs.push(existingTag._id);
      }
    }

    existingBlog.title = title;
    existingBlog.slug = finalSlug;
    existingBlog.content = content;
    existingBlog.status = status;
    existingBlog.heroImage = heroImage;
    existingBlog.heroImagePublicId = heroImagePublicId;
    existingBlog.category = categoryDoc?._id || null;
    existingBlog.tags = tagDocs;

    await existingBlog.save();

    const populatedBlog = await Blog.findById(existingBlog._id)
      .populate("category")
      .populate("tags")
      .populate("author", "fullName profilePic email")
      .lean();

    const authorMembership = await Membership.findOne({
      workspace: workspace._id,
      user: existingBlog.author,
    });

    return NextResponse.json({
      ...populatedBlog,
      authorRole: authorMembership?.role || "UNKNOWN",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspace._id,
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "DELETE_BLOG")) {
      return NextResponse.json(
        { error: "You do not have permission to delete blogs" },
        { status: 403 }
      );
    }

    const blog = await Blog.findOneAndDelete({
      _id: id,
      workspace: workspace._id,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspace._id,
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "VIEW_BLOGS")) {
      return NextResponse.json(
        { error: "You do not have permission to view blogs" },
        { status: 403 }
      );
    }

    const blog = await Blog.findOne({
      _id: id,
      workspace: workspace._id,
    })
      .populate("category")
      .populate("tags");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
