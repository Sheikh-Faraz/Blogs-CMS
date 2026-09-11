// import {
//   requireWorkspaceMembership,
//   requireWorkspacePermission,
// } from "@/lib/workspace-access";

// import {
//   canManageTargetRole,
//   getPermissionsForRole,
//   getVisibleMemberFields,
//   hasPermission,
//   type Permission,
//   type WorkspaceRole,
// } from "@/lib/permission-config";

// export type { Permission, WorkspaceRole } from "@/lib/permission-config";

// export {
//   canManageTargetRole,
//   getPermissionsForRole,
//   getVisibleMemberFields,
//   hasPermission,
// };

// export const requireMembership = requireWorkspaceMembership;

// export const requirePermission = async (
//   userId: string,
//   workspaceId: string,
//   permission: Permission
// ) => requireWorkspacePermission(userId, workspaceId, permission);






// import {
//   canManageTargetRole,
//   getPermissionsForRole,
//   getVisibleMemberFields,
//   hasPermission,
//   type Permission,
//   type WorkspaceRole,
// } from "@/lib/permission-config";

// export type { Permission, WorkspaceRole } from "@/lib/permission-config";

// export {
//   canManageTargetRole,
//   getPermissionsForRole,
//   getVisibleMemberFields,
//   hasPermission,
// };








import {
  requireWorkspaceMembership,
  requireWorkspacePermission,
  switchToDefaultWorkspace,
} from "@/lib/workspace-access";

import {
  canManageTargetRole,
  getPermissionsForRole,
  getVisibleMemberFields,
  hasPermission,
  // type Permission,
  // type WorkspaceRole,
} from "@/lib/permission-config";

export type { Permission, WorkspaceRole } from "@/lib/permission-config";

export {
  canManageTargetRole,
  getPermissionsForRole,
  getVisibleMemberFields,
  hasPermission,
  switchToDefaultWorkspace,
};

export const requireMembership = requireWorkspaceMembership;

export const requirePermission = requireWorkspacePermission;