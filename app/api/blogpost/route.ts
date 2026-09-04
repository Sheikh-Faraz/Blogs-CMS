import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tags";
import Membership from "@/models/Membership";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { hasPermission, type Permission } from "@/lib/permissions";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

const getPermissionResponse = (permission: Permission) =>
  NextResponse.json(
    { error: `You do not have permission to ${permission.toLowerCase().replaceAll("_", " ")}` },
    { status: 403 }
  );

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
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "VIEW_BLOGS")) {
      return getPermissionResponse("VIEW_BLOGS");
    }

    const blogs = await Blog.find({ workspace: workspace._id })
      .populate("category")
      .populate("tags")
      .populate("author", "fullName profilePic email banner")
      .sort({ createdAt: -1 })
      .lean();

    const memberships = await Membership.find({ workspace: workspace._id }).lean();
    const roleMap = new Map(
      memberships.map((member) => [member.user.toString(), member.role])
    );

    const enrichedBlogs = blogs.map((blog) => ({
      ...blog,
      authorRole: blog.author
        ? roleMap.get(blog.author._id.toString()) || "UNKNOWN"
        : "UNKNOWN",
    }));

    return NextResponse.json(enrichedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "CREATE_BLOG")) {
      return getPermissionResponse("CREATE_BLOG");
    }

    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim() || "";
    const contentRaw = formData.get("content")?.toString() || "";
    const slug = formData.get("slug")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || "";
    const status = formData.get("status")?.toString() || "draft";
    const tags = JSON.parse(formData.get("tags")?.toString() || "[]");

    if (!title || !slug || !contentRaw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = JSON.parse(contentRaw);
    if (!Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ error: "Blog content is required" }, { status: 400 });
    }

    const heroFile = formData.get("heroImage");
    const heroImageUrlFromClient = formData.get("heroImageUrl")?.toString() || "";

    let heroImageUrl = "";
    let heroImagePublicId = "";

    if (heroFile instanceof File && heroFile.size > 0) {
      const uploaded = await uploadToCloudinary(heroFile, "blog-images");
      heroImageUrl = uploaded.url;
      heroImagePublicId = uploaded.public_id;
    } else if (heroImageUrlFromClient) {
      heroImageUrl = heroImageUrlFromClient;
    }

    let finalSlug = slug;
    let count = 1;
    while (await Blog.findOne({ slug: finalSlug, workspace: workspace._id })) {
      finalSlug = `${slug}-${count}`;
      count += 1;
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

    const blog = await Blog.create({
      title,
      content,
      slug: finalSlug,
      status,
      heroImage: heroImageUrl,
      heroImagePublicId,
      category: categoryDoc?._id,
      tags: tagDocs,
      workspace: workspace._id,
      author: user._id,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate("category")
      .populate("tags")
      .populate("author", "fullName profilePic email")
      .lean();

    return NextResponse.json(populatedBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create blog" },
      { status: 500 }
    );
  }
}
