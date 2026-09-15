import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Category from "@/models/Category";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { requireMembership } from "@/lib/premission";

// export async function POST(req: Request) {
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // const nextReq = req as any;
    // const user = await getCurrentUser(nextReq);

    const user = await getCurrentUser(req);

    if (!user) {
      // return Response.json(
      return NextResponse.json(
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
      // return Response.json(
      return NextResponse.json(
        { error: "You do not have permission to create categories", },
        { status: 403 }
      );
    }

    const body = await req.json();

    const categoryName =
      body.categoryName?.trim().replace(/\s+/g, " ");

    if (!categoryName) {
      // return Response.json(
      return NextResponse.json(
        { error: "Category name is required", },
        { status: 400 }
      );
    }

    const existingCategory =
      await Category.findOne({
        name: categoryName,
        workspace: workspace._id,
      });

    if (existingCategory) {
      // return Response.json(
      return NextResponse.json(
        { error: "Category already exists", },
        { status: 400 }
      );
    }

    const category =
      await Category.create({
        name: categoryName,
        workspace: workspace._id,
      });

    // return Response.json(category, {
    return NextResponse.json(
      category, 
      { status: 201,}
    );

  } catch (err) {

    console.error("Error creating category:", err);

    // return Response.json(
    return NextResponse.json(
      { error: "Internal Server Error", },
      { status: 500 }
    );
  }
}