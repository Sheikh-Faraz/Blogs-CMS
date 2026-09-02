const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const updateWorkspaceMemberRoleApi = async (
  workspaceId: string,
  membershipId: string,
  role: "ADMIN" | "EDITOR" | "VIEWER"
) => {
  const res = await fetch(
    `${BASE_URL}/api/workspace/${workspaceId}/members/${membershipId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update member role");
  }

  return result;
};
