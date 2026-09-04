"use client";

import { useCallback, useEffect, useState } from "react";
import {
  hasPermission,
  type Permission,
  type WorkspaceRole,
} from "@/lib/permission-config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type PermissionState = {
  role: WorkspaceRole | null;
  permissions: Permission[];
  workspaceId: string | null;
  loading: boolean;
};

export function useWorkspacePermissions() {
  const [state, setState] = useState<PermissionState>({
    role: null,
    permissions: [],
    workspaceId: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));

    try {
      const response = await fetch(`${BASE_URL}/api/workspace/permissions`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch workspace permissions");
      }

      setState({
        role: data.role ?? null,
        permissions: data.permissions ?? [],
        workspaceId: data.workspaceId ?? null,
        loading: false,
      });
    } catch {
      setState({
        role: null,
        permissions: [],
        workspaceId: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const can = useCallback(
    (permission: Permission) => {
      if (!state.role) return false;
      return hasPermission(state.role, permission);
    },
    [state.role]
  );

  return {
    ...state,
    can,
    refresh,
  };
}
