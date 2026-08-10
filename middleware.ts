import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // No token
  if (!token && !isAuthPage) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Verify token
  if (token) {
    const valid = await verifyToken(token);

    // Invalid token
    if (!valid) {
      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.cookies.delete("token");

      return response;
    }

    // Logged in user visiting auth page
    if (isAuthPage) {
      return NextResponse.redirect(
        new URL("/blogs", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    // "/dashboard/:path*",
    "/blogs",
    "/analytics",
    "/create-blog",
    "/edit-blog/:path*",
    "/profile",
    "/workspace",
    "/login",
    "/signup",
  ],
};