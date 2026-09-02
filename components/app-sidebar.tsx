"use client"

import * as React from "react"
import { useEffect } from "react";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  FileTextIcon,
  Settings2Icon,
  User,
  Users,
} from "lucide-react"
import { CgOrganisation as Organization } from "react-icons/cg";
import { LayoutDashboard } from 'lucide-react';
import { RiPenNibLine as Penlogo } from "react-icons/ri";
import { FcInvite as InviteLogo } from "react-icons/fc";

import { WorkspaceSwitcher } from "@/app/blocks/Navbar/Workspace-Switcher";
import { useUser } from "@/context/User.context";

const data = {
  navMain: [
    {
      title: "Blogs",
      url: "/blogs",
      icon: (<LayoutDashboard />),
    },
    {
      title: "Create Blog",
      url: "/create-blog",
      icon: (<FileTextIcon />),
    },
    {
      title: "Profile",
      url: "/profile",
      icon: (<User />),
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: (<Organization />),
    },
    {
      title: "Invitations",
      url: "/invitations",
      icon: (<InviteLogo />),
    },
    {
      title: "Team",
      url: "/team",
      icon: (<Users />),
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (<Settings2Icon />),
    },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    authUser,
    workspace,
    workspaces,
    selectWorkspace,
    fetchUser,
    fetchWorkspaces,
    CurrentActiveWorkspace,
  } = useUser();

  useEffect(() => {
    fetchUser();
    fetchWorkspaces();
    CurrentActiveWorkspace();
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspaces}
          activeWorkspaceId={workspace?._id}
          onWorkspaceSelect={selectWorkspace}
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-transparent! my-4"
            >
              <a href="#" className="flex items-center gap-2">
                <div className="bg-[#E85129] p-2 rounded-full">
                  <Penlogo className="text-white" size={25}/>
                </div>
                <div className="text-xl font-bold">Inkwell.</div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain}/>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{
          name: authUser?.fullName || "Guest",
          email: authUser?.email || "something@email.com",
          avatar: authUser?.profilePic || "no nothing",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}