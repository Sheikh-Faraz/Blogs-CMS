"use client"

import { Building2, ChevronsUpDown, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Workspace } from "@/app/Types/workspace.type"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
}: {
  workspaces: Workspace[]
  activeWorkspaceId?: string
  onWorkspaceSelect: (workspaceId: string) => void
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const activeWorkspace =
    workspaces.find((workspace) => workspace._id === activeWorkspaceId) ||
    workspaces[0]

  if (!activeWorkspace) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
            >
              {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#E85129] text-sidebar-primary-foreground border border-red-600 p-1"> */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                {activeWorkspace.logo ? (
                  <img src={activeWorkspace.logo} alt="" className="h-full w-full" />
                ) : (
                  <Building2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeWorkspace.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace._id}
                onClick={() => onWorkspaceSelect(workspace._id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {workspace.logo ? (
                    <img src={workspace.logo} alt="" className="h-full w-full" />
                  ) : (
                    <Building2 className="size-3.5" />
                  )}
                </div>
                <span className="truncate">{workspace.name}</span>
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push("/workspace?create=1")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
