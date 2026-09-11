import WorkspaceRemoval from "@/models/WorkspaceRemoval";

/**
 * Keep only the latest kick event for a user/workspace pair.
 * This record can be used later if kick handling is reintroduced.
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
 * Remove any previous workspace removal record when a user is re-added.
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
