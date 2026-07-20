import { NextResponse, NextRequest } from "next/server";

// Token generation and encryption
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// DB connection
import connectDB from "@/lib/db";

// Models
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, fullName } = body;

    // 🔹 Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // 🔹 Hash password
    const passwordHash = await bcrypt.hash(password, 10);


    // Automatic creating workspace for the user 
    const workspace = await Workspace.create({
      name: `${fullName}'s Workspace`,

      slug: fullName
        .toLowerCase()
        .replace(/\s+/g, "-") + "-" + Date.now(),
    });


    // 🔹 Create user
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      defaultWorkspace: workspace._id,
    });


    // Auto assigning the creator of account to owner role
    await Membership.create({
      user: user._id,
      workspace: workspace._id,
      role: "OWNER",
    });

    // 🔹 Generate JWT
    // const token = generateToken(user._id);

    const token = await generateToken(user._id.toString());
    
        const safeUser = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          about: user.about,
          createdAt: user.createdAt,
          defaultWorkspace: user.defaultWorkspace,
        };
      
    const response = NextResponse.json({
      token, 
      user: safeUser,
    });

    response.cookies.set("activeWorkspaceId", workspace._id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

    // return NextResponse.json({
    //   token,
    //   // user,
    //   user: safeUser,
    // });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
