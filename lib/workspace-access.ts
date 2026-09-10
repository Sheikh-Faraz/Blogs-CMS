import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";
import type { Permission, WorkspaceRole } from "@/lib/permission-config";
import { hasPermission } from "@/lib/permission-config";

export type WorkspaceAccessCode =
  | "WORKSPACE_ACCESS_REVOKED"
  | "WORKSPACE_ACCESS_DENIED";

export class WorkspaceAccessError extends Error {
  code: WorkspaceAccessCode;
  workspaceId: string;

  constructor(
    code: WorkspaceAccessCode,
    message: string,
    workspaceId: string
  ) {
    super(message);
    this.name = "WorkspaceAccessError";
    this.code = code;
    this.workspaceId = workspaceId;
  }
}

/**
 * Returns the user's membership when they still belong to the workspace.
 * If membership is gone, distinguish a kick from every other access loss.
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

  const removal = await WorkspaceRemoval.findOne({
    user: userId,
    workspace: workspaceId,
    reason: "KICKED",
  });

  if (removal) {
    throw new WorkspaceAccessError(
      "WORKSPACE_ACCESS_REVOKED",
      "You were removed from this workspace",
      workspaceId
    );
  }

  throw new WorkspaceAccessError(
    "WORKSPACE_ACCESS_DENIED",
    "You are not a member of this workspace",
    workspaceId
  );
};

/**
 * Central permission + membership check for protected workspace APIs.
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

/**
 * Keep only the latest kick event for a user/workspace pair.
 */
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

/**
 * A successful re-add makes old kick information irrelevant.
 */
export const clearWorkspaceRemoval = async (
  userId: string,
  workspaceId: string
) => {
  await WorkspaceRemoval.deleteMany({
    user: userId,
    workspace: workspaceId,
  });
};
