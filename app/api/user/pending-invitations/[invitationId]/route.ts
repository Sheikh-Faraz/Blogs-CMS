import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Invitation from "@/models/Invitation";

export async function GET( req: NextRequest, { params, }: { params: Promise<{ invitationId: string }>; }) {
  try {

    await connectDB();

    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized", },
        { status: 401, }
      );
    }

    const { invitationId } = await params;

    const invitation = await Invitation.findById(invitationId)
      .populate({
        path: "workspace",
        select: "name slug logo",
      });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found", },
        { status: 404, }
      );
    }

    // Critical security check:
    // Users can only access invitations sent to their own email.
    if (
      invitation.email.toLowerCase() !==
      currentUser.email.toLowerCase()
    ) {
      return NextResponse.json(
        { message: "You do not have access to this invitation", },
        { status: 403, }
      );
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { message: `This invitation is ${invitation.status.toLowerCase()}`, },
        { status: 400, }
      );
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "EXPIRED";
      await invitation.save();

      return NextResponse.json(
        { message: "This invitation has expired", },
        { status: 400, }
      );
    }

    return NextResponse.json(
      { invitation, },
      { status: 200, }
    );
  } catch (error) {

    console.error("Fetch invitation details error:", error);
    return NextResponse.json(
      { message: "Failed to fetch invitation", },
      { status: 500, }
    );
  }
}