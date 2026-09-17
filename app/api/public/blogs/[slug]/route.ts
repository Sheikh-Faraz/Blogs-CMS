import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tags";
import User from "@/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const blog = await Blog.findOne({
      slug,
      status: "published",
    })
      .populate("category", "name")
      .populate("tags", "name")
      .populate("author", "fullName profilePic about")
      .lean();

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
