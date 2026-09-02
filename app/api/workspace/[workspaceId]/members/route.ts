import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Membership from "@/models/Membership";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const { workspaceId } = await params;
    const currentUser = await getCurrentUser(req);

    const currentMembership = await Membership.findOne({
      user: currentUser._id,
      workspace: workspaceId,
    });

    if (!currentMembership) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not a member of this workspace",
        },
        { status: 403 }
      );
    }

    const members = await Membership.find({
      workspace: workspaceId,
    })
      .populate({
        path: "user",
        select: "fullName email profilePic location about socials createdAt",
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
        message:
          error instanceof Error ? error.message : "Failed to fetch workspace members",
      },
      { status: 500 }
    );
  }
}
