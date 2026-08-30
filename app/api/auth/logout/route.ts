import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({message: "Logged out successfully",});

    // Clear authentication cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    // Clear active workspace cookie
    // response.cookies.set("activeWorkspaceId", "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   path: "/",
    //   expires: new Date(0),
    // });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}