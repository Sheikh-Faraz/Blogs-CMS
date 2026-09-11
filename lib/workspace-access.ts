// import Membership from "@/models/Membership";
// import WorkspaceRemoval from "@/models/WorkspaceRemoval";
// import User from "@/models/User";
// import type { Permission, WorkspaceRole } from "@/lib/permission-config";
// import { hasPermission } from "@/lib/permission-config";

// export type WorkspaceAccessCode =
//   | "WORKSPACE_ACCESS_REVOKED"
//   | "WORKSPACE_ACCESS_DENIED";

// export class WorkspaceAccessError extends Error {
//   code: WorkspaceAccessCode;
//   workspaceId: string;
//   defaultWorkspaceId: string | null;
//   status = 403;

//   constructor(
//     code: WorkspaceAccessCode,
//     message: string,
//     workspaceId: string,
//     defaultWorkspaceId: string | null = null
//   ) {
//     super(message);
//     this.name = "WorkspaceAccessError";
//     this.code = code;
//     this.workspaceId = workspaceId;
//     this.defaultWorkspaceId = defaultWorkspaceId;
//   }
// }

// /**
//  * Finds a workspace the user can safely switch to.
//  * The user's default workspace is preferred when it is still valid.
//  * Otherwise the first remaining membership is used and saved as default.
//  */
// export const getWorkspaceFallback = async (
//   userId: string,
//   excludedWorkspaceId?: string
// ) => {
//   const user = await User.findById(userId).select("defaultWorkspace").lean();

//   if (
//     user?.defaultWorkspace &&
//     user.defaultWorkspace.toString() !== excludedWorkspaceId
//   ) {
//     const defaultMembership = await Membership.exists({
//       user: userId,
//       workspace: user.defaultWorkspace,
//     });

//     if (defaultMembership) {
//       return user.defaultWorkspace.toString();
//     }
//   }

//   const fallbackMembership = await Membership.findOne({
//     user: userId,
//     ...(excludedWorkspaceId
//       ? { workspace: { $ne: excludedWorkspaceId } }
//       : {}),
//   })
//     .sort({ createdAt: 1 })
//     .select("workspace")
//     .lean();

//   if (!fallbackMembership) return null;

//   const fallbackId = fallbackMembership.workspace.toString();

//   if (user?.defaultWorkspace?.toString() !== fallbackId) {
//     await User.updateOne(
//       { _id: userId },
//       { $set: { defaultWorkspace: fallbackMembership.workspace } }
//     );
//   }

//   return fallbackId;
// };

// /**
//  * Central workspace access check.
//  * Returns membership when access is valid and throws a structured error when it is not.
//  */
// export const requireWorkspaceMembership = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   const membership = await Membership.findOne({
//     user: userId,
//     workspace: workspaceId,
//   });

//   if (membership) return membership;

//   const fallbackWorkspaceId = await getWorkspaceFallback(userId, workspaceId);

//   const removal = await WorkspaceRemoval.findOne({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });

//   if (removal) {
//     throw new WorkspaceAccessError(
//       "WORKSPACE_ACCESS_REVOKED",
//       "You were removed from this workspace",
//       workspaceId,
//       fallbackWorkspaceId
//     );
//   }

//   throw new WorkspaceAccessError(
//     "WORKSPACE_ACCESS_DENIED",
//     "You are not a member of this workspace",
//     workspaceId,
//     fallbackWorkspaceId
//   );
// };

// /**
//  * Central permission + workspace access check for protected workspace APIs.
//  */
// export const requireWorkspacePermission = async (
//   userId: string,
//   workspaceId: string,
//   permission: Permission
// ) => {
//   const membership = await requireWorkspaceMembership(userId, workspaceId);
//   const role = membership.role as WorkspaceRole;

//   if (!hasPermission(role, permission)) {
//     throw new Error("Insufficient permissions");
//   }

//   return membership;
// };

// export const recordWorkspaceKick = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   await WorkspaceRemoval.deleteMany({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });

//   return WorkspaceRemoval.create({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });
// };

// export const clearWorkspaceRemoval = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   await WorkspaceRemoval.deleteMany({
//     user: userId,
//     workspace: workspaceId,
//   });
// };






// import { cookies } from "next/headers";
// import Membership from "@/models/Membership";
// import WorkspaceRemoval from "@/models/WorkspaceRemoval";
// import User from "@/models/User";

// export const checkWorkspaceAccess = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   const membership = await Membership.findOne({
//     user: userId,
//     workspace: workspaceId,
//   });

//   // if (membership) {
//   //   return {
//   //     allowed: true,
//   //     kicked: false,
//   //     defaultWorkspaceId: null,
//   //     message: null,
//   //   };
//   // }

//   if (membership) {
//     return {
//       allowed: true,
//       kicked: false,
//       membership,
//       defaultWorkspaceId: null,
//       message: null,
//     };
//   }

//   const user = await User.findById(userId)
//     .select("defaultWorkspace")
//     .lean();

//   const defaultWorkspaceId = user?.defaultWorkspace?.toString();

//   const wasKicked = await WorkspaceRemoval.exists({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });

//   if (wasKicked) {
//     return {
//       allowed: false,
//       kicked: true,
//       membership: null,
//       defaultWorkspaceId,
//       message:
//         "You were kicked from this workspace. Switching to your default workspace.",
//     };
//   }

//   return {
//     allowed: false,
//     kicked: false,
//     membership: null,
//     defaultWorkspaceId,
//     message:
//       "You are not a member of this workspace. Switching to your default workspace.",
//   };
// };

// export const switchToDefaultWorkspace = async (
//   defaultWorkspaceId: string
// ) => {
//   const cookieStore = await cookies();

//   cookieStore.set("activeWorkspaceId", defaultWorkspaceId, {
//     httpOnly: true,
//     path: "/",
//   });
// };


// export const recordWorkspaceKick = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   await WorkspaceRemoval.deleteMany({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });

//   return WorkspaceRemoval.create({
//     user: userId,
//     workspace: workspaceId,
//     reason: "KICKED",
//   });
// };

// export const clearWorkspaceRemoval = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   await WorkspaceRemoval.deleteMany({
//     user: userId,
//     workspace: workspaceId,
//   });
// };










import { cookies } from "next/headers";

import Membership from "@/models/Membership";
import WorkspaceRemoval from "@/models/WorkspaceRemoval";
import User from "@/models/User";

import type { Permission, WorkspaceRole } from "@/lib/permission-config";
import { hasPermission } from "@/lib/permission-config";

export type WorkspaceAccessCode =
  | "WORKSPACE_ACCESS_REVOKED"
  | "WORKSPACE_ACCESS_DENIED";

/**
 * Central workspace access check.
 *
 * Returns membership when the user has access.
 * If the user is not a member, it checks whether they were kicked
 * and returns their default workspace so the API can switch them.
 */
export const requireWorkspaceMembership = async (
  userId: string,
  workspaceId: string
) => {
  const membership = await Membership.findOne({
    user: userId,
    workspace: workspaceId,
  });

  // User is a member
  if (membership) {
    return {
      allowed: true,
      kicked: false,
      membership,
      defaultWorkspaceId: null,
      message: null,
      code: null,
    };
  }

  /*
   * User is not a member.
   * Get their default workspace.
   */
  const user = await User.findById(userId)
    .select("defaultWorkspace")
    .lean();

  const defaultWorkspaceId =
    user?.defaultWorkspace?.toString() ?? null;

  /*
   * Check if the user was kicked from this workspace.
   */
  const removal = await WorkspaceRemoval.findOne({
    user: userId,
    workspace: workspaceId,
    reason: "KICKED",
  });

  /*
   * User was kicked.
   */
  if (removal) {
    return {
      allowed: false,
      kicked: true,
      membership: null,
      defaultWorkspaceId,
      code: "WORKSPACE_ACCESS_REVOKED" as const,
      message:
        "You were kicked from this workspace. Switching to your default workspace.",
    };
  }

  /*
   * User is simply not a member.
   */
  return {
    allowed: false,
    kicked: false,
    membership: null,
    defaultWorkspaceId,
    code: "WORKSPACE_ACCESS_DENIED" as const,
    message:
      "You are not a member of this workspace. Switching to your default workspace.",
  };
};

/**
 * Central workspace + permission check.
 *
 * Returns the same access information as requireWorkspaceMembership,
 * but also checks whether the user's role has the required permission.
 */
export const requireWorkspacePermission = async (
  userId: string,
  workspaceId: string,
  permission: Permission
) => {
  const access = await requireWorkspaceMembership(
    userId,
    workspaceId
  );

  /*
   * User does not have workspace membership.
   * Return the access information instead of throwing.
   */
  if (!access.allowed) {
    return access;
  }

  const role = access.membership.role as WorkspaceRole;

  /*
   * User is a member but doesn't have the required permission.
   */
  if (!hasPermission(role, permission)) {
    return {
      allowed: false,
      kicked: false,
      membership: access.membership,
      defaultWorkspaceId: null,
      code: "WORKSPACE_PERMISSION_DENIED" as const,
      message: "Insufficient permissions",
    };
  }

  /*
   * Everything is valid.
   */
  return {
    ...access,
    allowed: true,
  };
};

/**
 * Switch the active workspace cookie to the user's default workspace.
 */
export const switchToDefaultWorkspace = async (
  defaultWorkspaceId: string
) => {
  const cookieStore = await cookies();

  cookieStore.set("activeWorkspaceId", defaultWorkspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

/**
 * Record that a user was kicked from a workspace.
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
 * Remove any previous workspace removal record.
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