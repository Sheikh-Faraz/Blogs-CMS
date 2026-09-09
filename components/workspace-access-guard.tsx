"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/context/User.context";
import { getWorkspaceApi } from "@/services/auth.services";
import toast from "react-hot-toast";

const CHECK_INTERVAL = 15_000;

type AccessResponse = {
  code?: "WORKSPACE_ACCESS_REVOKED" | "WORKSPACE_ACCESS_DENIED";
  defaultWorkspaceId?: string | null;
  error?: string;
};

export default function WorkspaceAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    authUser,
    workspace,
    CurrentActiveWorkspace,
    selectWorkspace,
  } = useUser();

  const [recovering, setRecovering] = useState(false);
  const recoveryInProgress = useRef(false);

  const checkWorkspaceAccess = useCallback(async () => {
    if (!authUser || recoveryInProgress.current) return;

    try {
      const res = await getWorkspaceApi();
      const data = (await res.json()) as AccessResponse & {
        workspace?: unknown;
      };

      // The server may have silently recovered an ordinary stale workspace
      // to the user's valid default workspace.
      if (res.ok) {
        if (data.workspace) {
          await CurrentActiveWorkspace();
        }
        return;
      }

      if (res.status !== 403) return;

      // A normal access denial should not be treated as a kick.
      // The server already handles ordinary stale workspace access by
      // recovering to the default workspace when possible.
      if (data.code !== "WORKSPACE_ACCESS_REVOKED") return;

      if (!data.defaultWorkspaceId) return;

      recoveryInProgress.current = true;
      setRecovering(true);

      const toastId = toast.loading(
        "You were removed from this workspace. Switching to your default workspace..."
      );

      try {
        await selectWorkspace(data.defaultWorkspaceId);
        toast.success("You were removed from the workspace.", {
          id: toastId,
          duration: 3500,
        });
      } catch {
        toast.error("We couldn't switch to your default workspace.", {
          id: toastId,
          duration: 4000,
        });
      } finally {
        setRecovering(false);
        recoveryInProgress.current = false;
      }
    } catch {
      // Access checks are a background safety mechanism. Network/server
      // failures should not interrupt the user's current UI.
    }
  }, [authUser, CurrentActiveWorkspace, selectWorkspace]);

  useEffect(() => {
    if (!authUser || !workspace) return;

    checkWorkspaceAccess();

    const interval = window.setInterval(checkWorkspaceAccess, CHECK_INTERVAL);

    const handleFocus = () => {
      checkWorkspaceAccess();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkWorkspaceAccess();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authUser, workspace, checkWorkspaceAccess]);

  return (
    <>
      {children}

      {recovering && (
        <div className="fixed inset-0 z-[9999] cursor-wait bg-background/60 backdrop-blur-[1px]" />
      )}
    </>
  );
}
