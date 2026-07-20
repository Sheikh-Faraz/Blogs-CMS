import Membership from "@/models/Membership";

export async function requireMembership(
  userId: string,
  workspaceId: string
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

  return membership;
}