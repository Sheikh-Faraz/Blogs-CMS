const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type WorkspaceAccessEvent = {
  code: "WORKSPACE_ACCESS_REVOKED" | "WORKSPACE_ACCESS_DENIED";
  workspaceId?: string;
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
 * Shared client-side fetch wrapper for protected API calls.
 * Normal responses are returned untouched. When a workspace-scoped API
 * denies access, we ask the canonical current-workspace endpoint why access
 * was lost and notify the UserProvider once recovery information is known.
 */
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init);

  if (response.status !== 403 || typeof window === "undefined") {
    return response;
  }

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

  const responseMessage =
    typeof responseData.message === "string" ? responseData.message : "";
  const responseError =
    typeof responseData.error === "string" ? responseData.error : "";

  const looksLikeWorkspaceAccessError =
    responseMessage.toLowerCase().includes("not a member") ||
    responseError.toLowerCase().includes("not a member");

  if (!looksLikeWorkspaceAccessError) {
    return response;
  }

  try {
    const accessResponse = await fetch(
      `${BASE_URL}/api/workspace/currentActiveWorkspace`,
      {
        cache: "no-store",
        method: "GET",
        credentials: "include",
      }
    );

    const accessData = (await accessResponse.json()) as WorkspaceAccessEvent & {
      recovered?: boolean;
    };

    if (accessData.code === "WORKSPACE_ACCESS_REVOKED") {
      notifyWorkspaceAccess({
        code: accessData.code,
        workspaceId: accessData.workspaceId,
        defaultWorkspaceId: accessData.defaultWorkspaceId,
        message: accessData.error || responseMessage || responseError,
      });
      return response;
    }

    if (accessData.recovered && accessData.defaultWorkspaceId) {
      notifyWorkspaceAccess({
        code: "WORKSPACE_ACCESS_DENIED",
        workspaceId: accessData.previousWorkspaceId,
        defaultWorkspaceId: accessData.defaultWorkspaceId,
        message: accessData.error || responseMessage || responseError,
      });
    }
  } catch {
    // Do not replace the original API response when recovery lookup fails.
  }

  return response;
};
