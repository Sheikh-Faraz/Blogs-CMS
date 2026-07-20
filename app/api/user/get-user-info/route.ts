import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    // Populate workspace
    await user.populate(
      "defaultWorkspace",
      "name logo slug about location banner createdAt"
    );

    const safeUser = {
      _id: user._id,

      email: user.email,
      fullName: user.fullName,

      about: user.about,
      gender: user.gender,
      location: user.location,

      profilePic: user.profilePic,
      banner: user.banner,

      socials: user.socials,

      defaultWorkspace: user.defaultWorkspace,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Get user info error:", error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}