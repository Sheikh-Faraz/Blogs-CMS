import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Invitation from "@/models/Invitation";
import Workspace from "@/models/Workspace";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        {message: "Unauthorized",},
        {status: 401,}
      );
    }

    const invitations = await Invitation.find({
      email: currentUser.email.toLowerCase(),
      status: "PENDING",
    })
      .populate({
        path: "workspace",
        select: "name slug logo",
      })
      .select(
        "_id email role workspace expiresAt createdAt"
      )
      .sort({
        createdAt: -1,
      });

    // Mark expired invitations
    const now = new Date();

    const activeInvitations = [];

    for (const invitation of invitations) {
      if (invitation.expiresAt < now) {
        invitation.status = "EXPIRED";
        await invitation.save();

        continue;
      }

      activeInvitations.push(invitation);
    }

    return NextResponse.json(
      {invitations: activeInvitations,},
      {status: 200,}
    );
  } catch (error) {
    console.error("Fetch user pending invitations error:", error);

    return NextResponse.json(
      {message: "Failed to fetch pending invitations",},
      {status: 500,}
    );
  }
}