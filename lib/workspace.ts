// import { cookies } from "next/headers";

// import Membership from "@/models/Membership";
// import Workspace from "@/models/Workspace";
// import User from "@/models/User";
// import { requireWorkspaceMembership } from "@/lib/workspace-access";

// export async function getActiveWorkspace(userId: string) {
//   const cookieStore = await cookies();
//   const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

//   // If an active workspace is selected, access is checked centrally.
//   if (activeWorkspaceId) {
//     const membership = await requireWorkspaceMembership(
//       userId,
//       activeWorkspaceId
//     );

//     const workspace = await Workspace.findById(membership.workspace);

//     if (workspace) return workspace;
//   }

//   // No active workspace: use the user's valid default workspace.
//   const user = await User.findById(userId).select("defaultWorkspace");

//   if (!user?.defaultWorkspace) {
//     throw new Error("User has no default workspace");
//   }

//   await requireWorkspaceMembership(
//     userId,
//     user.defaultWorkspace.toString()
//   );

//   const workspace = await Workspace.findById(user.defaultWorkspace);

//   if (!workspace) {
//     throw new Error("Default workspace not found");
//   }

//   return workspace;
// }





import { cookies } from "next/headers";

import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";
import User from "@/models/User";
import { switchToDefaultWorkspace } from "@/lib/workspace-access";

export async function getActiveWorkspace(userId: string) {
  const cookieStore = await cookies();

  const activeWorkspaceId =
    cookieStore.get("activeWorkspaceId")?.value;

  /*
   * Get user's default workspace.
   * Every user should have one.
   */
  const user = await User.findById(userId)
    .select("defaultWorkspace")
    .lean();

  if (!user?.defaultWorkspace) {
    throw new Error("User has no default workspace");
  }

  const defaultWorkspaceId = user.defaultWorkspace.toString();

  /*
   * ============================================================
   * Active workspace exists
   * ============================================================
   */
  if (activeWorkspaceId) {
    const membership = await Membership.findOne({
      user: userId,
      workspace: activeWorkspaceId,
    });

    /*
     * User is a member of the active workspace.
     */
    if (membership) {
      const workspace = await Workspace.findById(activeWorkspaceId);

      if (workspace) {
        return workspace;
      }
    }

    /*
     * User is NOT a member of the active workspace.
     *
     * Regardless of whether they were kicked or simply aren't
     * a member, switch them back to their default workspace.
     */
    await switchToDefaultWorkspace(defaultWorkspaceId);

    const defaultWorkspace = await Workspace.findById(
      defaultWorkspaceId
    );

    if (!defaultWorkspace) {
      throw new Error("Default workspace not found");
    }

    return defaultWorkspace;
  }

  /*
   * ============================================================
   * No active workspace cookie
   * ============================================================
   */

  const defaultWorkspace = await Workspace.findById(
    defaultWorkspaceId
  );

  if (!defaultWorkspace) {
    throw new Error("Default workspace not found");
  }

  /*
   * Make sure the cookie is set.
   */
  await switchToDefaultWorkspace(defaultWorkspaceId);

  return defaultWorkspace;
}