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


// ✅ UPDATE BLOG
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // --------------------------------------------------
    // AUTH
    // --------------------------------------------------

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

    if (membership.role === "VIEWER") {
      return Response.json(
        {
          error:
            "You do not have permission to update blogs",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // FIND BLOG
    // --------------------------------------------------

    const existingBlog = await Blog.findOne({
      _id: id,
      workspace: workspace._id,
    });

    if (!existingBlog) {
      return Response.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // FORM DATA
    // --------------------------------------------------

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const status = formData.get("status") as string;

    const contentRaw = formData.get("content");

    const content = contentRaw
      ? JSON.parse(contentRaw as string)
      : [];

    const category =
      formData.get("category") as string | null;

    const tags = JSON.parse(
      (formData.get("tags") as string) || "[]"
    );

    const heroFile =
      formData.get("heroImage") as File | null;

    const heroImageUrlFromClient =
      formData.get("heroImageUrl") as string | null;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (
      !title ||
      !slug ||
      !content ||
      content.length === 0
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SLUG
    // Prevent another blog from having the same slug
    // --------------------------------------------------

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
      count++;
    }

    // --------------------------------------------------
    // HERO IMAGE
    // --------------------------------------------------

    let heroImage =
      existingBlog.heroImage || "";

    let heroImagePublicId =
      existingBlog.heroImagePublicId || "";

    // New device upload
    if (heroFile && heroFile.size > 0) {
      const uploaded =
        await uploadToCloudinary(
          heroFile,
          "blog-images"
        );

      heroImage = uploaded.url;
      heroImagePublicId =
        uploaded.public_id;
    }

    // Existing URL or Unsplash URL
    else if (heroImageUrlFromClient) {
      heroImage =
        heroImageUrlFromClient;

      // URL images don't have a Cloudinary public ID
      if (
        heroImageUrlFromClient !==
        existingBlog.heroImage
      ) {
        heroImagePublicId = "";
      }
    }

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

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

    // --------------------------------------------------
    // TAGS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    existingBlog.title = title;
    existingBlog.slug = finalSlug;
    existingBlog.content = content;
    existingBlog.status =
      status || "draft";

    existingBlog.heroImage =
      heroImage;

    existingBlog.heroImagePublicId =
      heroImagePublicId;

    existingBlog.category =
      categoryDoc?._id || null;

    existingBlog.tags =
      tagDocs;

    await existingBlog.save();

    // --------------------------------------------------
    // POPULATE UPDATED BLOG
    // --------------------------------------------------

    const populatedBlog =
      await Blog.findById(existingBlog._id)
        .populate("category")
        .populate("tags")
        .populate(
          "author",
          "fullName profilePic email"
        )
        .lean();

    const authorMembership =
      await Membership.findOne({
        workspace: workspace._id,
        user: existingBlog.author,
      });

    return Response.json({
      ...populatedBlog,
      authorRole:
        authorMembership?.role ||
        "UNKNOWN",
    });
  } catch (error) {
    console.error(
      "Error updating blog:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update blog",
      },
      { status: 500 }
    );
  }
}





// ✅ DELETE BLOG
export async function DELETE( req: Request,  { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const { id } = await params;
  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: "Blog deleted" }), {
    headers: { "Content-Type": "application/json" },
  });
}


// ✅ GET SINGLE BLOG BY ID
export async function GET( req: Request,  { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  // const body = await req.json();
  const { id } = await params;

  const blogById = await Blog.findById(id)
  .populate("category")
  .populate("tags");;

  if (!blogById) {
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(blogById), {
    headers: { "Content-Type": "application/json" },
  });
}