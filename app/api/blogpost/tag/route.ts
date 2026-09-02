import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tag from "@/models/Tags";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { requirePermission } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    await requirePermission(user._id.toString(), workspace._id.toString(), "VIEW_BLOGS");

    const tags = await Tag.find({ workspace: workspace._id }).sort({ name: 1 }).lean();
    return Response.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
