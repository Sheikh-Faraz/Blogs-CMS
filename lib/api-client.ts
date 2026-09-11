const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type WorkspaceAccessEvent = {
  code: "WORKSPACE_ACCESS_REVOKED" | "WORKSPACE_ACCESS_DENIED";
  workspaceId?: string;
  previousWorkspaceId?: string;
  defaultWorkspaceId?: string | null;
  message?: string;
};

const notifyWorkspaceAccess = (detail: WorkspaceAccessEvent) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<WorkspaceAccessEvent>("workspace-access-error", {
      detail,
    })
  );
};

/**
 * Shared client-side fetch wrapper.
 * Workspace access failures are identified by the API error code directly.
 */
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init);

  // if (response.status !== 403 || typeof window === "undefined") {
  //   return response;
  // }

  const url = typeof input === "string" ? input : input.toString();

  if (url.includes("/api/workspace/currentActiveWorkspace")) {
    return response;
  }

  let responseData: Record<string, unknown> = {};

  try {
    responseData = (await response.clone().json()) as Record<string, unknown>;
  } catch {
    return response;
  }

  const code = responseData.code;

  if (
    code !== "WORKSPACE_ACCESS_REVOKED" &&
    code !== "WORKSPACE_ACCESS_DENIED"
  ) {
    return response;
  }

  notifyWorkspaceAccess({
    code,
    workspaceId:
      typeof responseData.workspaceId === "string"
        ? responseData.workspaceId
        : undefined,
    defaultWorkspaceId:
      typeof responseData.defaultWorkspaceId === "string"
        ? responseData.defaultWorkspaceId
        : null,
    message:
      typeof responseData.error === "string" ? responseData.error : undefined,
  });

  return response;
};
