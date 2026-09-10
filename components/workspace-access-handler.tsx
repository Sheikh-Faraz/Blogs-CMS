"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUser } from "@/context/User.context";
import { getWorkspaceApi, selectWorkspaceApi } from "@/services/auth.services";
import type { WorkspaceAccessEvent } from "@/lib/api-client";

export default function WorkspaceAccessHandler() {
  const { authUser, CurrentActiveWorkspace, fetchAnalytics } = useUser();
  const router = useRouter();
  const handling = useRef(false);
  const [recovering, setRecovering] = useState(false);

  const recoverToDefault = async (detail: WorkspaceAccessEvent) => {
    if (handling.current || !authUser || !detail.defaultWorkspaceId) return;

    handling.current = true;
    setRecovering(true);

    const isRevoked = detail.code === "WORKSPACE_ACCESS_REVOKED";
    const toastId = isRevoked
      ? toast.loading(
          "You were removed from this workspace. Switching to your default workspace..."
        )
      : undefined;

    try {
      await selectWorkspaceApi(detail.defaultWorkspaceId);
      await CurrentActiveWorkspace();
      await fetchAnalytics();

      router.push("/blogs");
      router.refresh();

      if (toastId) {
        toast.success("You were removed from the workspace.", {
          id: toastId,
          duration: 3500,
        });
      }
    } catch {
      if (toastId) {
        toast.error("We couldn't switch to your default workspace.", {
          id: toastId,
          duration: 4000,
        });
      }
    } finally {
      setRecovering(false);
      handling.current = false;
    }
  };

  useEffect(() => {
    const handleAccessError = (event: Event) => {
      void recoverToDefault(
        (event as CustomEvent<WorkspaceAccessEvent>).detail
      );
    };

    window.addEventListener("workspace-access-error", handleAccessError);

    return () => {
      window.removeEventListener("workspace-access-error", handleAccessError);
    };
  }, [authUser]);

  // Check the active workspace when authentication becomes available.
  // There is no polling: this runs only when auth state changes/mounts.
  useEffect(() => {
    if (!authUser || handling.current) return;

    const validateActiveWorkspace = async () => {
      try {
        const response = await getWorkspaceApi();
        const data = (await response.json()) as WorkspaceAccessEvent & {
          recovered?: boolean;
          previousWorkspaceId?: string;
          workspace?: unknown;
        };

        if (
          response.status === 403 &&
          data.code === "WORKSPACE_ACCESS_REVOKED"
        ) {
          await recoverToDefault(data);
          return;
        }

        if (response.ok && data.recovered) {
          await CurrentActiveWorkspace();
          await fetchAnalytics();
          router.push("/blogs");
          router.refresh();
        }
      } catch {
        // Workspace recovery is best-effort; protected APIs remain authoritative.
      }
    };

    validateActiveWorkspace();
  }, [authUser, CurrentActiveWorkspace, fetchAnalytics, router]);

  if (!recovering) return null;

  return (
    <div className="fixed inset-0 z-[9999] cursor-wait bg-background/60 backdrop-blur-[1px]" />
  );
}
