export type WorkspaceRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type Permission =
  | "VIEW_WORKSPACE"
  | "UPDATE_WORKSPACE"
  | "DELETE_WORKSPACE"
  | "VIEW_BLOGS"
  | "CREATE_BLOG"
  | "UPDATE_BLOG"
  | "DELETE_BLOG"
  | "VIEW_ANALYTICS"
  | "VIEW_TEAM"
  | "VIEW_MEMBER_DETAILS"
  | "INVITE_MEMBERS"
  | "MANAGE_MEMBER_ROLES"
  | "MANAGE_INVITATIONS";

export const permissionsByRole: Record<WorkspaceRole, readonly Permission[]> = {
  OWNER: [
    "VIEW_WORKSPACE",
    "UPDATE_WORKSPACE",
    "DELETE_WORKSPACE",
    "VIEW_BLOGS",
    "CREATE_BLOG",
    "UPDATE_BLOG",
    "DELETE_BLOG",
    "VIEW_ANALYTICS",
    "VIEW_TEAM",
    "VIEW_MEMBER_DETAILS",
    "INVITE_MEMBERS",
    "MANAGE_MEMBER_ROLES",
    "MANAGE_INVITATIONS",
  ],
  ADMIN: [
    "VIEW_WORKSPACE",
    "UPDATE_WORKSPACE",
    "VIEW_BLOGS",
    "CREATE_BLOG",
    "UPDATE_BLOG",
    "DELETE_BLOG",
    "VIEW_ANALYTICS",
    "VIEW_TEAM",
    "VIEW_MEMBER_DETAILS",
    "INVITE_MEMBERS",
    "MANAGE_MEMBER_ROLES",
    "MANAGE_INVITATIONS",
  ],
  EDITOR: [
    "VIEW_WORKSPACE",
    "VIEW_BLOGS",
    "CREATE_BLOG",
    "UPDATE_BLOG",
    "VIEW_TEAM",
  ],
  VIEWER: ["VIEW_WORKSPACE", "VIEW_BLOGS", "VIEW_TEAM"],
};

export const getPermissionsForRole = (role: WorkspaceRole) =>
  permissionsByRole[role];

export const hasPermission = (
  role: WorkspaceRole,
  permission: Permission
) => permissionsByRole[role].includes(permission);

export const canManageTargetRole = (
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole
) => {
  if (actorRole === "OWNER") return targetRole !== "OWNER";
  if (actorRole === "ADMIN") {
    return targetRole === "EDITOR" || targetRole === "VIEWER";
  }
  return false;
};

export const getVisibleMemberFields = (role: WorkspaceRole) => {
  const basic = ["fullName", "profilePic", "email"];

  if (hasPermission(role, "VIEW_MEMBER_DETAILS")) {
    return [...basic, "location", "about", "socials"];
  }

  return basic;
};
