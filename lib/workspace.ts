import { cookies } from "next/headers";

import Membership from "@/models/Membership";
import Workspace from "@/models/Workspace";
import User from "@/models/User";
import { requireWorkspaceMembership } from "@/lib/workspace-access";

export async function getActiveWorkspace(userId: string) {
  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

  // If an active workspace is selected, access is checked centrally.
  if (activeWorkspaceId) {
    const membership = await requireWorkspaceMembership(
      userId,
      activeWorkspaceId
    );

    const workspace = await Workspace.findById(membership.workspace);

    if (workspace) return workspace;
  }

  // No active workspace: use the user's valid default workspace.
  const user = await User.findById(userId).select("defaultWorkspace");

  if (!user?.defaultWorkspace) {
    throw new Error("User has no default workspace");
  }

  await requireWorkspaceMembership(
    userId,
    user.defaultWorkspace.toString()
  );

  const workspace = await Workspace.findById(user.defaultWorkspace);

  if (!workspace) {
    throw new Error("Default workspace not found");
  }

  return workspace;
}
