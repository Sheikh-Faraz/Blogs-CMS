// I think this was for validating the role to allow or deny certain permissions 
// to perform certian operations for people of certain role
// Change or check if according to logic

import Membership from "@/models/Membership";

export async function requireRole(
  userId: string,
  workspaceId: string,
  allowedRoles: string[]
) {
  const membership =
    await Membership.findOne({
      user: userId,
      workspace: workspaceId,
    });

  if (!membership) {
    throw new Error(
      "You are not a member of this workspace"
    );
  }

  if (
    !allowedRoles.includes(
      membership.role
    )
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  return membership;
}