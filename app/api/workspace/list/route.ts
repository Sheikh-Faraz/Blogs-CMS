import { NextRequest, NextResponse } from "next/server";
import Membership from "@/models/Membership";
import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    const memberships = await Membership.find({
      user: currentUser._id,
    })
      .populate("workspace")
      .sort({ createdAt: 1 });

    const workspaces = memberships
      .map((membership) => membership.workspace)
      .filter(Boolean);

    return NextResponse.json(workspaces);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}
