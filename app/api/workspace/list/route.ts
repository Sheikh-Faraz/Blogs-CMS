import { NextRequest, NextResponse } from "next/server";
import Membership from "@/models/Membership";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id"); 
    // (later we can extract from JWT middleware)

    const memberships = await Membership.find({
      user: userId,
    }).populate("workspace");

    const workspaces = memberships.map((m) => m.workspace);

    return NextResponse.json(workspaces);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}