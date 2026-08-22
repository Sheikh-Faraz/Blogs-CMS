import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Membership from "@/models/Membership";

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return NextResponse.json({ error: "Invalid workspace" }, { status: 400 });
    }

    await connectDB();
    const currentUser = await getCurrentUser(req);

    const membership = await Membership.exists({
      user: currentUser._id,
      workspace: workspaceId,
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this workspace" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    // Setting the workspace
    response.cookies.set("activeWorkspaceId", workspaceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to set workspace" },
      { status: 500 }
    );
  }
}
