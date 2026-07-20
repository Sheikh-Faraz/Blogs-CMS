import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Membership from "@/models/Membership";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const { workspaceId } = await params;

    const members = await Membership.find({
      workspace: workspaceId,
    })
      .populate({
        path: "user",
        select: "fullName email profilePic location about",
      })
      .sort({ createdAt: 1 });

    return NextResponse.json(
      {
        success: true,
        members,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workspace members:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workspace members",
      },
      { status: 500 }
    );
  }
}