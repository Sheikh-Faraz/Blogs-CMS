"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUser } from "@/context/User.context";
import { useBlog } from "@/context/Blog.context";
import { getWorkspaceApi, selectWorkspaceApi } from "@/services/auth.services";

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
    fetchAnalytics,
  } = useUser();
  const { getAllBlogs } = useBlog();
  const router = useRouter();

  const [recovering, setRecovering] = useState(false);
  const recoveryInProgress = useRef(false);

  const checkWorkspaceAccess = useCallback(async () => {
    if (!authUser || recoveryInProgress.current) return;

    try {
      const res = await getWorkspaceApi();
      const data = (await res.json()) as AccessResponse & {
        workspace?: unknown;
      };

      // Ordinary stale/invalid active workspace is recovered by the server
      // to the user's valid default workspace and returned as a 200.
      if (res.ok) {
        if (data.workspace) {
          await CurrentActiveWorkspace();
        }
        return;
      }

      if (res.status !== 403 || data.code !== "WORKSPACE_ACCESS_REVOKED") {
        return;
      }

      if (!data.defaultWorkspaceId) return;

      recoveryInProgress.current = true;
      setRecovering(true);

      const toastId = toast.loading(
        "You were removed from this workspace. Switching to your default workspace..."
      );

      try {
        await selectWorkspaceApi(data.defaultWorkspaceId);
        await CurrentActiveWorkspace();
        await fetchAnalytics();
        await getAllBlogs();
        router.push("/blogs");

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
      // Background access validation should not interrupt the UI when the
      // network/server is temporarily unavailable.
    }
  }, [
    authUser,
    CurrentActiveWorkspace,
    fetchAnalytics,
    getAllBlogs,
    router,
  ]);

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
