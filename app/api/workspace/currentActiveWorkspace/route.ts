// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// import connectDB from "@/lib/db";
// import { getCurrentUser } from "@/lib/getCurrentUser";
// // import {
// //   getWorkspaceFallback,
// //   requireWorkspaceMembership,
// //   WorkspaceAccessError,
// // } from "@/lib/workspace-access";
// import Workspace from "@/models/Workspace";
// import User from "@/models/User";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const user = await getCurrentUser(req);

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const cookieStore = await cookies();
//     const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

//     if (activeWorkspaceId) {
//       try {
//         await requireWorkspaceMembership(
//           user._id.toString(),
//           activeWorkspaceId
//         );

//         const workspace = await Workspace.findById(activeWorkspaceId);

//         if (!workspace) {
//           return NextResponse.json(
//             { error: "Workspace not found" },
//             { status: 404 }
//           );
//         }

//         return NextResponse.json({ workspace, recovered: false });
//       } catch (error) {
//         if (error instanceof WorkspaceAccessError) {
//           return NextResponse.json(
//             {
//               error: error.message,
//               code: error.code,
//               workspaceId: error.workspaceId,
//               defaultWorkspaceId: error.defaultWorkspaceId,
//             },
//             { status: 403 }
//           );
//         }

//         throw error;
//       }
//     }

//     const userWithDefault = await User.findById(user._id).select(
//       "defaultWorkspace"
//     );

//     if (!userWithDefault?.defaultWorkspace) {
//       return NextResponse.json(
//         { error: "No active workspace" },
//         { status: 404 }
//       );
//     }

//     const defaultWorkspaceId = await getWorkspaceFallback(
//       user._id.toString()
//     );

//     if (!defaultWorkspaceId) {
//       return NextResponse.json(
//         { error: "No workspace available" },
//         { status: 404 }
//       );
//     }

//     const workspace = await Workspace.findById(defaultWorkspaceId);

//     if (!workspace) {
//       return NextResponse.json(
//         { error: "Workspace not found" },
//         { status: 404 }
//       );
//     }

//     const response = NextResponse.json({
//       workspace,
//       recovered: true,
//       recoveryCode: "WORKSPACE_ACCESS_RECOVERED",
//       defaultWorkspaceId,
//       previousWorkspaceId: null,
//     });

//     response.cookies.set("activeWorkspaceId", defaultWorkspaceId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });

//     return response;
//   } catch (error) {
//     console.error("Current active workspace error:", error);

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch current workspace",
//       },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Workspace from "@/models/Workspace";
import User from "@/models/User";
import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const activeWorkspaceId =
      cookieStore.get("activeWorkspaceId")?.value;

    /*
     * ============================================================
     * 1. ACTIVE WORKSPACE EXISTS
     * ============================================================
     */
    if (activeWorkspaceId) {
      const membership = await Membership.findOne({
        user: user._id,
        workspace: activeWorkspaceId,
      });

      /*
       * User is a member -> normal flow
       */
      if (membership) {
        const workspace = await Workspace.findById(activeWorkspaceId);

        if (!workspace) {
          return NextResponse.json(
            { error: "Workspace not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          workspace,
          recovered: false,
        });
      }

      /*
       * ============================================================
       * User is NOT a member
       * ============================================================
       */

      // Get user's default workspace
      const userWithDefault = await User.findById(user._id).select(
        "defaultWorkspace"
      );

      const defaultWorkspaceId =
        userWithDefault?.defaultWorkspace?.toString();

      if (!defaultWorkspaceId) {
        return NextResponse.json(
          { error: "No default workspace available" },
          { status: 404 }
        );
      }

      // Check whether the user was kicked
      const wasKicked = await WorkspaceRemoval.exists({
        user: user._id,
        workspace: activeWorkspaceId,
        reason: "KICKED",
      });

      /*
       * Switch active workspace to default
       */
      cookieStore.set("activeWorkspaceId", defaultWorkspaceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      /*
       * KICKED
       */
      if (wasKicked) {
        return NextResponse.json(
          {
            accessDenied: true,
            kicked: true,
            message:
              "You were kicked from this workspace. Switching to your default workspace.",
            previousWorkspaceId: activeWorkspaceId,
            defaultWorkspaceId,
          },
          { status: 403 }
        );
      }

      /*
       * NOT A MEMBER
       */
      return NextResponse.json(
        {
          accessDenied: true,
          kicked: false,
          message:
            "You are not a member of this workspace. Switching to your default workspace.",
          previousWorkspaceId: activeWorkspaceId,
          defaultWorkspaceId,
        },
        { status: 403 }
      );
    }

    /*
     * ============================================================
     * 2. NO ACTIVE WORKSPACE COOKIE
     * ============================================================
     */

    const userWithDefault = await User.findById(user._id).select(
      "defaultWorkspace"
    );

    const defaultWorkspaceId =
      userWithDefault?.defaultWorkspace?.toString();

    if (!defaultWorkspaceId) {
      return NextResponse.json(
        { error: "No default workspace available" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(defaultWorkspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    /*
     * Set default workspace as active
     */
    cookieStore.set("activeWorkspaceId", defaultWorkspaceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      workspace,
      recovered: true,
      defaultWorkspaceId,
      previousWorkspaceId: null,
    });
  } catch (error) {
    console.error("Current active workspace error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch current workspace",
      },
      { status: 500 }
    );
  }
}