import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";
import User from "@/models/User";
import type { Permission, WorkspaceRole } from "@/lib/permission-config";
import { hasPermission } from "@/lib/permission-config";

export type WorkspaceAccessCode =
  | "WORKSPACE_ACCESS_REVOKED"
  | "WORKSPACE_ACCESS_DENIED";

export class WorkspaceAccessError extends Error {
  code: WorkspaceAccessCode;
  workspaceId: string;
  defaultWorkspaceId: string | null;
  status = 403;

  constructor(
    code: WorkspaceAccessCode,
    message: string,
    workspaceId: string,
    defaultWorkspaceId: string | null = null
  ) {
    super(message);
    this.name = "WorkspaceAccessError";
    this.code = code;
    this.workspaceId = workspaceId;
    this.defaultWorkspaceId = defaultWorkspaceId;
  }
}

/**
 * Finds a workspace the user can safely switch to.
 * The user's default workspace is preferred when it is still valid.
 * Otherwise the first remaining membership is used and saved as default.
 */
export const getWorkspaceFallback = async (
  userId: string,
  excludedWorkspaceId?: string
) => {
  const user = await User.findById(userId).select("defaultWorkspace").lean();

  if (
    user?.defaultWorkspace &&
    user.defaultWorkspace.toString() !== excludedWorkspaceId
  ) {
    const defaultMembership = await Membership.exists({
      user: userId,
      workspace: user.defaultWorkspace,
    });

    if (defaultMembership) {
      return user.defaultWorkspace.toString();
    }
  }

  const fallbackMembership = await Membership.findOne({
    user: userId,
    ...(excludedWorkspaceId
      ? { workspace: { $ne: excludedWorkspaceId } }
      : {}),
  })
    .sort({ createdAt: 1 })
    .select("workspace")
    .lean();

  if (!fallbackMembership) return null;

  const fallbackId = fallbackMembership.workspace.toString();

  if (user?.defaultWorkspace?.toString() !== fallbackId) {
    await User.updateOne(
      { _id: userId },
      { $set: { defaultWorkspace: fallbackMembership.workspace } }
    );
  }

  return fallbackId;
};

/**
 * Central workspace access check.
 * Returns membership when access is valid and throws a structured error when it is not.
 */
export const requireWorkspaceMembership = async (
  userId: string,
  workspaceId: string
) => {
  const membership = await Membership.findOne({
    user: userId,
    workspace: workspaceId,
  });

  if (membership) return membership;

  const fallbackWorkspaceId = await getWorkspaceFallback(userId, workspaceId);

  const removal = await WorkspaceRemoval.findOne({
    user: userId,
    workspace: workspaceId,
    reason: "KICKED",
  });

  if (removal) {
    throw new WorkspaceAccessError(
      "WORKSPACE_ACCESS_REVOKED",
      "You were removed from this workspace",
      workspaceId,
      fallbackWorkspaceId
    );
  }

  throw new WorkspaceAccessError(
    "WORKSPACE_ACCESS_DENIED",
    "You are not a member of this workspace",
    workspaceId,
    fallbackWorkspaceId
  );
};

/**
 * Central permission + workspace access check for protected workspace APIs.
 */
export const requireWorkspacePermission = async (
  userId: string,
  workspaceId: string,
  permission: Permission
) => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);
  const role = membership.role as WorkspaceRole;

  if (!hasPermission(role, permission)) {
    throw new Error("Insufficient permissions");
  }

  return membership;
};

export const recordWorkspaceKick = async (
  userId: string,
  workspaceId: string
) => {
  await WorkspaceRemoval.deleteMany({
    user: userId,
    workspace: workspaceId,
    reason: "KICKED",
  });

  return WorkspaceRemoval.create({
    user: userId,
    workspace: workspaceId,
    reason: "KICKED",
  });
};

export const clearWorkspaceRemoval = async (
  userId: string,
  workspaceId: string
) => {
  await WorkspaceRemoval.deleteMany({
    user: userId,
    workspace: workspaceId,
  });
};
