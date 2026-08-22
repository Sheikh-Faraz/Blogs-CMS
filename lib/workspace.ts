import { cookies } from "next/headers";

import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

export async function getActiveWorkspace( userId: string ) {

    const cookieStore = await cookies();

    const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

      // STEP 1
      // Try cookie workspace

      // Get the current active workspace
      if (activeWorkspaceId) {
        const membership = await Membership.findOne({
          user: userId,
          workspace: activeWorkspaceId,
      });


      // Check if the user is a member of the workspace
      if (membership) {
        const workspace = await Workspace.findById(activeWorkspaceId);
      
      if (workspace) {
        return workspace;
      }

    }
  }

  // STEP 2
  // Fallback to default workspace

  const user = await User.findById(userId);

  if (!user?.defaultWorkspace) {
    throw new Error(
      "User has no default workspace"
    );
  }

  const workspace = await Workspace.findById(
    user.defaultWorkspace
  );

  if (!workspace) {
    throw new Error(
      "Default workspace not found"
    );
  }

  return workspace;
}