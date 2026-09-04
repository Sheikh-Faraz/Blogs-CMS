import { requirePermission, type WorkspaceRole } from "@/lib/permissions";

export type InvitationRole = "ADMIN" | "EDITOR" | "VIEWER";

export const getInvitationRolesForUser = (
  inviterRole: WorkspaceRole
): InvitationRole[] => {
  switch (inviterRole) {
    case "OWNER":
      return ["ADMIN", "EDITOR", "VIEWER"];
    case "ADMIN":
      return ["EDITOR", "VIEWER"];
    default:
      return [];
  }
};

export const requireInvitationPermission = async (
  userId: string,
  workspaceId: string
) => requirePermission(userId, workspaceId, "INVITE_MEMBERS");

export const canInviteRole = (
  inviterRole: WorkspaceRole,
  invitedRole: InvitationRole
) => getInvitationRolesForUser(inviterRole).includes(invitedRole);
