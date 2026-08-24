import type { Types } from "mongoose";

import { requireRole } from "@/lib/roleValidator";

export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "EDITOR"
  | "VIEWER";

export type InvitationRole =
  | "ADMIN"
  | "EDITOR"
  | "VIEWER";

export const getInvitationRolesForUser = (
  inviterRole: WorkspaceRole
): InvitationRole[] => {
  switch (inviterRole) {
    case "OWNER":
      return [
        "ADMIN",
        "EDITOR",
        "VIEWER",
      ];

    case "ADMIN":
      return [
        "EDITOR",
        "VIEWER",
      ];

    default:
      return [];
  }
};

export const requireInvitationPermission = async (
  userId: string,
  workspaceId: string
) => {
  const membership = await requireRole(
    userId,
    workspaceId,
    ["OWNER", "ADMIN"]
  );

  return membership;
};

export const canInviteRole = (
  inviterRole: WorkspaceRole,
  invitedRole: InvitationRole
) => {
  return getInvitationRolesForUser(
    inviterRole
  ).includes(invitedRole);
};