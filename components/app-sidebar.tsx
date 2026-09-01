"use client"

import * as React from "react"
import { useEffect } from "react";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
// import { Button } from "@/components/ui/button"
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
  // CameraIcon, 
  // ChartNoAxesColumn, 
  // ChevronsUpDown, 
} from "lucide-react"
import { CgOrganisation as Organization } from "react-icons/cg";

import { LayoutDashboard } from 'lucide-react';

import { RiPenNibLine as Penlogo } from "react-icons/ri";
import { FcInvite as InviteLogo } from "react-icons/fc";


import { WorkspaceSwitcher } from "@/app/blocks/Navbar/Workspace-Switcher";

// Context 
import { useUser } from "@/context/User.context";


const data = {
  // user: {
  //   name: { },
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },

  navMain: [
    {
      title: "Blogs",
      url: "/blogs",
      icon: (
        <LayoutDashboard />
      ),
    },
    {
      title: "Create Blog",
      url: "/create-blog",
      icon: (
        <FileTextIcon />
      ),
    },
    // {
    //   title: "Analytics",
    //   url: "/analytics",
    //   icon: (
    //     <ChartNoAxesColumn  />
    //   ),
    // },
    {
      title: "Profile",
      url: "/profile",
      icon: (
        <User  />
      ),
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: (
        <Organization  />
      ),
    },
    {
      title: "Invitations",
      url: "/invitations",
      icon: (
        <InviteLogo />
      ),
    },
    {
      title: "Team",
      url: "/blogs",
      icon: (
        <Users  />
      ),
    },
  ],


  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: (
  //       <CameraIcon
  //       />
  //     ),
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: (
  //       <FileTextIcon
  //       />
  //     ),
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: (
  //       <FileTextIcon
  //       />
  //     ),
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
  ],
  documents: [
    // {
    //   name: "Data Library",
    //   url: "#",
    //   icon: (
    //     <DatabaseIcon
    //     />
    //   ),
    // },
    // {
    //   name: "Reports",
    //   url: "#",
    //   icon: (
    //     <FileChartColumnIcon
    //     />
    //   ),
    // },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: (
    //     <FileIcon
    //     />
    //   ),
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    // Context
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
    // <Sidebar collapsible="offcanvas" {...props}>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader >
            <WorkspaceSwitcher
              workspaces={workspaces}
              activeWorkspaceId={workspace?._id}
              onWorkspaceSelect={selectWorkspace}
            />
        <SidebarMenu>
          <SidebarMenuItem>

            {/* <SidebarMenuButton
              size="lg"
              asChild
              // className="items-center justify-center border border-green-600" 
              // className="items-center justify-center border border-green-600" 
            > */}



              {/* <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild> 
                      <button className="w-full flex items-center gap-2 justify-center py-4 rounded-md border ">

                          <span className="bg-[#E85129] rounded-md p-2">
                            <SquareTerminal size={20} className="text-white "/>
                          </span>

                          <span className="text-md">
                            {authUser?.defaultWorkspace?.name || "Workspace"}
                          </span>

                        <span className="ml-4">
                          <ChevronsUpDown  size={15}/>
                        </span>

                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    // className="w-32"
                    align='center'
                    className='w-full! items-center justify-center'
                    >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                      <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem value="top">{authUser?.defaultWorkspace?.name || "Workspace"}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div> */}


            <SidebarMenuButton
              size="lg"
              // variant="default"
              className="bg-transparent! my-4"
            >
        
              <a href="#" className="flex items-center gap-2">

                <div className="bg-[#E85129] p-2 rounded-full">
                  {/* <Penlogo className="text-white h-6! w-6!" /> */}
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
        {/* <NavDocuments items={data.documents}/> */}
      </SidebarContent>


      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <NavUser user={{
          name: authUser?.fullName || "Guest",
          email: authUser?.email || "something@email.com",
          avatar: authUser?.profilePic || "no nothing",
        }} />
      </SidebarFooter>

    </Sidebar>
  )
}
