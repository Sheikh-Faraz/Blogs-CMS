import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();

    const response = NextResponse.json({
      success: true,
    });

    // Setting the workspace
    response.cookies.set("activeWorkspaceId", workspaceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to set workspace" },
      { status: 500 }
    );
  }
}