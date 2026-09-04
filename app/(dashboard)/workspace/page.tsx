"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Context 
import { useUser } from "@/context/User.context";

// Workspace Loading Skeleton
import WorkspaceSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/WorkspaceSkeleton";

// import { Button } from "@/components/ui/button";

// Header 
import HeaderCard from "@/app/blocks/workspace-blocks/header-card";
// About & Stats
import AboutCard from "@/app/blocks/workspace-blocks/about-card";

// Stats
import WorkspaceAnalytics from "@/app/blocks/workspace-blocks/workspaceAnalytics";

// import StatsCard from "@/app/blocks/workspace-blocks/stats-card";

// Team Members 
// import TeamCard from "@/app/blocks/workspace-blocks/team-card";

// Right Side info card 
import RightCard from "@/app/blocks/workspace-blocks/Right-Card";
// Delete card 
import DeleteCard from "@/app/blocks/workspace-blocks/delete-card";
import CreateWorkspaceDialog from "@/app/blocks/workspace-blocks/create-workspace-dialog";
import PendingInvitationsCard from "@/app/blocks/workspace-blocks/pending-invitaionts-card";


// Invite user/member dialog
import InviteMemberDialog from "@/app/blocks/workspace-blocks/invite-member-dialog";


import { FiPlusCircle as Plus, } from "react-icons/fi";
import { FaDoorOpen as LeaveIcon } from "react-icons/fa6";




export default function WorkspacePage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
    const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
    const createWorkspaceRequested = searchParams.get("create") === "1";

    // User Context
    const { 
      authUser,
      members,

      workspaceAnalyticsLoading,
      fetchAnalytics,
      analytics,

      CurrentActiveWorkspace,
      fetchPendingInvitations,
    } = useUser();


    useEffect(() => {

      const loadWorkspaceData = async () => {
        try {

          await CurrentActiveWorkspace();
          await fetchPendingInvitations();
          await fetchAnalytics();

        } catch (error) {
          console.error( "Failed to load workspace data:", error );
        }
      };

      loadWorkspaceData();
      
    }, []);

    const currentMember =
      members.find(
        (member) =>
          member.user._id === authUser?._id
      );

    // const canInvite = currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";


    const handleCreateWorkspaceOpenChange = (open: boolean) => {
      setCreateWorkspaceOpen(open);

      if (!open && createWorkspaceRequested) {
        router.replace("/workspace");
      }
    };


    if(workspaceAnalyticsLoading) {
      return <WorkspaceSkeleton />
    };

  return (
    <div>

      {/* Create Dialog Opens to create new workspace */}
      <CreateWorkspaceDialog
        open={createWorkspaceRequested || createWorkspaceOpen}
        onOpenChange={handleCreateWorkspaceOpenChange}
      />


      {/* <InviteMemberDialog
        open={inviteMemberOpen}
        onOpenChange={setInviteMemberOpen}
      /> */}
    
    <div className="flex justify-between items-center px-4 mb-8">
      <p className="text-3xl font-bold">Current Workspace</p>

      <div className="flex items-center gap-3">

          <button
            className="border py-2 px-3 bg-card text-card-foreground rounded-md flex gap-2 items-center hover:bg-muted"
          >
            <LeaveIcon className="mr-2 text-[#E85129]" />
            Leave current workspace
          </button>
      

      {/* Create new workspace */}
      <Link 
        href="/workspace?create=1" 
        className="border py-2 px-3 bg-card text-card-foreground rounded-md flex gap-2 items-center hover:bg-muted"
      >
        <Plus className="text-[#E85129]" />
        Create New Workspace 
      </Link>

      </div>

    </div>

      {/* <div className="flex gap-5 p-4 min-h-full border border-blue-600"> */}
      <div className="p-4 min-h-full">
        <HeaderCard />

        {/* ── Main column ────────────────────────────────────────────────────── */}
        <div className="flex gap-3">

        <div className="flex-1 min-w-0 space-y-4">

          <AboutCard 
            totalBlogs={analytics?.overview.totalBlogs ?? 0}
            publishedBlogs={analytics?.overview.publishedBlogs ?? 0}
            draftBlogs={analytics?.overview.draftBlogs ?? 0}
            authors={analytics?.overview.totalAuthors ?? 0 }
          />

          {/* <StatsCard /> */}


          <WorkspaceAnalytics
            totalBlogs={analytics?.overview.totalBlogs ?? 0}
            publishedBlogs={analytics?.overview.publishedBlogs ?? 0}
            draftBlogs={analytics?.overview.draftBlogs ?? 0}
            authors={analytics?.authors.map((author) => ({
              _id: author.id,
              fullName: author.name,
              profilePic: author.profilePic,
              totalBlogs: author.totalBlogs,
              publishedBlogs: author.published,
              draftBlogs: author.drafts,

              location: author.location,
            })) ?? []}
          />

          <PendingInvitationsCard />
          {/* <TeamCard /> */}
          
          <DeleteCard />

        </div>

          <RightCard />
        </div>


      </div>

    </div>
  );
}
