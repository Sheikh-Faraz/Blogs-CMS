import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";

import User from "@/models/User";
import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";

import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    };

    
    const token = await generateToken(user._id.toString());

    const memberships = await Membership.find({
      user: user._id,
    }).populate("workspace");

    // let workspace = user.defaultWorkspace || memberships[0]?.workspace?._id;
    const workspace = user.defaultWorkspace || memberships[0]?.workspace?._id;

    if (!workspace) {
      return NextResponse.json(
        {
          message: "No workspace found",
        },
        {
          status: 400,
        }
      );
    }

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      about: user.about,
      createdAt: user.createdAt,
      defaultWorkspace: workspace.toString(),
    };



    const response = NextResponse.json({
      token,
      user: safeUser,
    });


    response.cookies.set("activeWorkspaceId", workspace.toString(),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;


  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
