import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import connectDB from "./db";
import User from "@/models/User";

import "@/models/Workspace"; // Ensure Workspace model is registered

export const getCurrentUser = async (req: NextRequest) => {
  await connectDB();

  // const authHeader = req.headers.get("authorization");
  // if (!authHeader) throw new Error("Unauthorized");

  // const token = authHeader.split(" ")[1];
  // if (!token) throw new Error("Unauthorized");
  
  // const decoded = await verifyToken(token) as { userId: string };


  // Read token from cookie
  const token =
    req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  // FIX
  const decoded = await verifyToken(token);

  if (!decoded?.userId) {
    throw new Error("Invalid token");
  }

  // const user = await User.findById(decoded.userId);
  const user = await User.findById( decoded.userId).populate(
    "defaultWorkspace",
    "name slug createdAt"
  );

  if (!user) throw new Error("User not found");

  return user;
};
