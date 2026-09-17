import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Blog from "@/models/Blog";
// import Category from "@/models/Category";
import "@/models/Category";
// import Tag from "@/models/Tags";
import "@/models/Tags";
// import User from "@/models/User";
import "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find({
      status: "published",
    })
      .select(
        "title slug heroImage category tags author createdAt updatedAt"
      )
      .populate("category", "name")
      .populate("tags", "name")
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching published blogs:", error);

    return NextResponse.json(
      { error: "Failed to fetch published blogs" },
      { status: 500 }
    );
  }
}

