// // By the way gpt was saying something that the verify token will not work because next js middlware works in edge runtime for that we have to jose library

// import { NextRequest, NextResponse } from "next/server";
// // import { verifyToken } from "./lib/auth";


// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   const { pathname } = req.nextUrl;


//   const isAuthPage =
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/signup");

//   // 🔒 If accessing protected route without token
//   if (!token && !isAuthPage) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 🔒 If logged in user tries to access login page
//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // Commented it out because of edge runtime issue, which causes infinite redirect loop.
//   // 🔒 Optional: verify token
//   // if (token) {
//   //   const valid = verifyToken(token);
//   //   if (!valid) {
//   //     return NextResponse.redirect(new URL("/login", req.url));
//   //   }
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",
//     // "/chat/:path*",
//     // "/profile/:path*",
//     "/dashboard/:path*",
//     "/blogs/:path*",
//     "/login",
//     "/signup",
//   ],
// };



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