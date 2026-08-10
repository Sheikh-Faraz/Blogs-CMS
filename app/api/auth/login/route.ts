import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";                // For decrypting password
import connectDB from "@/lib/db";             // For coneecting to the database
import { generateToken } from "@/lib/auth";   // Generating JWT token for the user, Authentication


// Models/Schemas
import User from "@/models/User";   
import "@/models/Workspace";                  // Importing Workspace which is used in populate for membership
import Membership from "@/models/Membership";  



export async function POST(req: NextRequest) {
  try {

    await connectDB();  // Connect to database

    // Getting data / to be used
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });   // Fetching User from database using email

    // If data for the intended user does not exist from db
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



    const isMatch = await bcrypt.compare(password, user.passwordHash);  // Decrypting and comparing pass from body with user pass from db
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    };

    
    const token = await generateToken(user._id.toString());  // Generating Token for the user using their id, which will be used for authentication

    // Fetching memberships for the user to get their workspace
    const memberships = await Membership.find({
      user: user._id,
    }).populate("workspace");


    const workspace = user.defaultWorkspace || memberships[0]?.workspace?._id;  // Getting the default workspace of the user, if not available, getting the first workspace from memberships
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

    // Creating a safe user object to send back in the response, without sensitive information like password etc
    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      about: user.about,
      createdAt: user.createdAt,
      defaultWorkspace: workspace.toString(),
    };


    // Creating a response with the token and safe user object
    // const response = NextResponse.json({
      //   token,
      //   user: safeUser,
      // });


    // Creating a response with safe user object
    const response = NextResponse.json({
      user: safeUser
    });


    // Store JWT in a secure cookie.
    // `secure` automatically becomes false on localhost (HTTP) and true in production (HTTPS), based on NODE_ENV.
    response.cookies.set("token", token, {
      httpOnly: true,                                   // Prevents JavaScript from accessing the JWT.
      secure: process.env.NODE_ENV === "production",    // HTTP locally, HTTPS in production.
      sameSite: "lax",                                  // Helps protect against CSRF attacks.
      path: "/",                                        // Makes the cookie available across the whole app.
      maxAge: 60 * 60 * 24 * 7,                         // Cookie expires after 7 days.
    });


    // Store the user's active workspace in a secure cookie.
    // Same settings apply for localhost and production.
    response.cookies.set("activeWorkspaceId", workspace.toString(), {
      httpOnly: true,                                   // Prevents JavaScript from accessing the workspace ID.
      secure: process.env.NODE_ENV === "production",    // HTTP locally, HTTPS in production.
      sameSite: "lax",                                  // Helps protect against CSRF attacks.
      path: "/",                                        // Makes the cookie available across the whole app.
      maxAge: 60 * 60 * 24 * 7,                         // Cookie expires after 7 days.
    });


    return response; // Returning the response with the safe user object


  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
