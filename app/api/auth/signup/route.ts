import { NextResponse, NextRequest } from "next/server";

import { generateToken } from "@/lib/auth";   // To create token
import bcrypt from "bcryptjs";                // For encrypting the password
import connectDB from "@/lib/db";             // For connecting to database

// Models
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";


export async function POST(req: NextRequest) {
  try {
        await connectDB(); // Connect to database

        // Getting data from request body
        const body = await req.json();
        const { email, password, fullName } = body;


        // Checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
          );
        }
    
        const passwordHash = await bcrypt.hash(password, 10); // Hashing the password before storing it


        // Automatically creating a workspace for the user upon signup
        const workspace = await Workspace.create({
          name: `${fullName}'s Workspace`,
          slug: fullName
            .toLowerCase()
            .replace(/\s+/g, "-") + "-" + Date.now(),
        });


        // Creating the user in the database with the cradentials and linking them to the newly created workspace
        const user = await User.create({
          email,
          passwordHash,
          fullName,
          defaultWorkspace: workspace._id,
        });


        // Creating a membership for the user in the newly created workspace and assigning them the role of "OWNER"
        await Membership.create({
          user: user._id,
          workspace: workspace._id,
          role: "OWNER",
        });

        const token = await generateToken(user._id.toString()); // Generating Token for the user using their id, which will be used for authentication in future requests
    
        // Creating a safe user object to send back in the response, without sensitive information like password etc
        const safeUser = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          about: user.about,
          createdAt: user.createdAt,
          defaultWorkspace: user.defaultWorkspace,
        };
      
    
        // Creating response with safe user object
        const response = NextResponse.json({
          user: safeUser,
        });


        // Store JWT in a secure cookie.
        // `secure` automatically becomes false on localhost (HTTP) and true in production (HTTPS), based on NODE_ENV.
        response.cookies.set("token", token, {
          httpOnly: true,                                 // Prevents JavaScript from accessing the JWT.
          secure: process.env.NODE_ENV === "production",  // HTTP locally, HTTPS in production.
          sameSite: "lax",                                // Helps protect against CSRF attacks.
          path: "/",                                      // Makes the cookie available across the whole app.
          maxAge: 60 * 60 * 24 * 7,                       // Cookie expires after 7 days.
        });


        // Store the user's active workspace in a secure cookie.
        // Same settings apply automatically for localhost and production.
        response.cookies.set("activeWorkspaceId", workspace._id.toString(), {
          httpOnly: true,                                 // Prevents JavaScript from accessing the workspace ID.
          secure: process.env.NODE_ENV === "production",  // HTTP locally, HTTPS in production.
          sameSite: "lax",                                // Helps protect against CSRF attacks.
          path: "/",                                      // Makes the cookie available across the whole app.
          maxAge: 60 * 60 * 24 * 7,                       // Cookie expires after 7 days.
        });
        
        
        // The JWT itself is stored in an HttpOnly cookie below.
        return response; // Returning the response with the safe user object


  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
