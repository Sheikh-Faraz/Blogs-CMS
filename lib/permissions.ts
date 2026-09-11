import Membership from "@/models/Membership";
import {
  canManageTargetRole,
  getPermissionsForRole,
  getVisibleMemberFields,
  hasPermission,
  type Permission,
  type WorkspaceRole,
} from "@/lib/permission-config";

export type { Permission, WorkspaceRole } from "@/lib/permission-config";

export {
  canManageTargetRole,
  getPermissionsForRole,
  getVisibleMemberFields,
  hasPermission,
};

export const requirePermission = async (
  userId: string,
  workspaceId: string,
  permission: Permission
) => {
  const membership = await Membership.findOne({
    user: userId,
    workspace: workspaceId,
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  if (!hasPermission(membership.role as WorkspaceRole, permission)) {
    throw new Error("Insufficient permissions");
  }

  return membership;
};
