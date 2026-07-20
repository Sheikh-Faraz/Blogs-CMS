
// api/blogpost/route.ts

import { NextRequest } from "next/server";
import connectDB from "@/lib/db";

import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tags";
import Membership from "@/models/Membership";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { requireMembership } from "@/lib/premission";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspace = await getActiveWorkspace(
      user._id.toString()
    );

    await requireMembership(
      user._id.toString(),
      workspace._id.toString()
    );

    // 1. Get blogs for workspace
    const blogs = await Blog.find({
      workspace: workspace._id,
    })
      .populate("category")
      .populate("tags")
      .populate("author", "fullName profilePic email")
      .sort({ createdAt: -1 })
      .lean();

    // 2. Get all memberships for this workspace (for roles)
    const memberships = await Membership.find({
      workspace: workspace._id,
    }).lean();

    // 3. Create userId -> role map
    const roleMap = new Map(
      memberships.map((m) => [
        m.user.toString(),
        m.role,
      ])
    );

    // 4. Attach role to each blog author
    const enrichedBlogs = blogs.map((blog) => ({
      ...blog,
      authorRole:
        roleMap.get(
          blog.author._id.toString()
        ) || "UNKNOWN",
    }));

    return Response.json(enrichedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return Response.json(
      {
        error: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}






export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspace = await getActiveWorkspace(
      user._id.toString()
    );

    const membership = await requireMembership(
      user._id.toString(),
      workspace._id.toString()
    );

    // Optional: role restriction (recommended)
    if (
      membership.role === "VIEWER"
    ) {
      return Response.json(
        {
          error:
            "You do not have permission to create blogs",
        },
        { status: 403 }
      );
    }

    // const body = await req.json();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = JSON.parse(formData.get("content") as string);
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;

    const tags = JSON.parse(formData.get("tags") as string || "[]");

    const heroFile = formData.get("heroImage") as File | null;
    const heroImageUrlFromClient = formData.get("heroImageUrl") as string | null;

    let heroImageUrl = "";
    let heroImagePublicId = "";

    // CASE 1: File upload (device)
    if (heroFile && heroFile.size > 0) {
      const uploaded = await uploadToCloudinary(heroFile, "blog-images");

      heroImageUrl = uploaded.url;
      heroImagePublicId = uploaded.public_id;
    }

    // CASE 2: Unsplash URL
    else if (heroImageUrlFromClient) {
      heroImageUrl = heroImageUrlFromClient;
    }


    if (!title || !slug || !content || content.length === 0) {
      return Response.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 }
      );
    }

    let finalSlug = slug;
    let count = 1;

    while (await Blog.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${count}`;
      count++;
    }

    // CATEGORY
    let categoryDoc = null;

    if (category?.trim()) {
      const normalizedCategory =
        category.trim();

      categoryDoc =
        await Category.findOne({
          name: normalizedCategory,
          workspace: workspace._id,
        });

      if (!categoryDoc) {
        categoryDoc =
          await Category.create({
            name: normalizedCategory,
            workspace: workspace._id,
          });
      }
    }


    // TAGS
    let tagDocs: any[] = [];

    if (tags?.length) {
      tagDocs = await Promise.all(
        tags.map(async (tag: string) => {

          const normalizedTag =
            tag.trim();

          let existingTag =
            await Tag.findOne({
              name: normalizedTag,
              workspace: workspace._id,
            });

          if (!existingTag) {
            existingTag =
              await Tag.create({
                name: normalizedTag,
                workspace: workspace._id,
              });
          }

          return existingTag._id;
        })
      );
    }

    // CREATE BLOG
    const blog = await Blog.create({
      title,
      content,
      slug: finalSlug,

      status: status || "draft",

      heroImage: heroImageUrl,
      heroImagePublicId,

      category: categoryDoc?._id,
      tags: tagDocs,

      workspace: workspace._id,
      author: user._id,
    });


    // Return populated blog
    const populatedBlog =
      await Blog.findById(
        blog._id
      )
        .populate("category")
        .populate("tags")
        .populate(
          "author",
          "fullName profilePic email"
        )
        .lean();

    return Response.json(
      populatedBlog,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create blog",
      },
      { status: 500 }
    );
  }
}