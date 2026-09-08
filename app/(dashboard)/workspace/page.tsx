"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Context 
import { useUser } from "@/context/User.context";

// Permission to show buttons bases on role
import { useWorkspacePermissions } from "@/hooks/use-workspace-permissions";

// Services
import { leaveWorkspaceApi, } from "@/services/auth.services";

// For notifications
import toast from "react-hot-toast";

// Workspace Loading Skeleton
import WorkspaceSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/WorkspaceSkeleton";

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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Loading icons spinner
import LoaderIcon from "@/app/blocks/loading/Loader";

// Invite user/member dialog
// import InviteMemberDialog from "@/app/blocks/workspace-blocks/invite-member-dialog";


import { FiPlusCircle as Plus, } from "react-icons/fi";
import { FaDoorOpen as LeaveIcon } from "react-icons/fa6";




export default function WorkspacePage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
    const createWorkspaceRequested = searchParams.get("create") === "1";
    // const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

    // User Context
    const { 
      workspaceAnalyticsLoading,
      fetchAnalytics,
      analytics,

      workspace,     
      CurrentActiveWorkspace,
      selectWorkspace,
      fetchPendingInvitations,
    } = useUser();

    // Permission according to role
    const { can, loading } = useWorkspacePermissions();

    const [ openLeaveDialog, setOpenLeaveDialog ] = useState(false); 
    const [ leaveWorkspaceLoading, setLeaveWorkspaceLoading ] = useState(false);


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


    const handleCreateWorkspaceOpenChange = (open: boolean) => {
      setCreateWorkspaceOpen(open);

      if (!open && createWorkspaceRequested) {
        router.replace("/workspace");
      }
    };

    
    const handleLeaveWorkspace = async () => {
      const workspaceId = workspace?._id;

      if (!workspaceId) {
        setOpenLeaveDialog(false);
        setLeaveWorkspaceLoading(false);
        toast.error("No active workspace found");
        return;
      }

      setLeaveWorkspaceLoading(true);

      try {
        const res = await leaveWorkspaceApi(workspaceId);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        };

        if (data.leavingActiveWorkspace && data.newActiveWorkspaceId) {
          await selectWorkspace(data.newActiveWorkspaceId);
        }

        setOpenLeaveDialog(false);
        toast.success("You left the workspace");

        // Refresh workspace/user context here
      } catch (error) {
        console.error("Failed to leave workspace:", error);
        toast.error("Failed to leave workspace");
      } finally {
        setLeaveWorkspaceLoading(false);
      }
    };


    if(workspaceAnalyticsLoading || loading) {
      return <WorkspaceSkeleton />
    };

  return (
    <div>

      {/* Create Dialog Opens to create new workspace */}
      <CreateWorkspaceDialog
        open={createWorkspaceRequested || createWorkspaceOpen}
        onOpenChange={handleCreateWorkspaceOpenChange}
      />


      {/* Leave workspace dialog */}
          <Dialog open={openLeaveDialog} onOpenChange={setOpenLeaveDialog}>
            <DialogContent className="sm:max-w-md">
              
              <DialogHeader>
                <DialogTitle>Leave workspace</DialogTitle>
      
                <DialogDescription className="my-2">
                  {`Are you sure you want to leave '${workspace?.name}' workspace? You will lose access to all its blogs and content.`}
                </DialogDescription>
      
              </DialogHeader>
    
      
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={leaveWorkspaceLoading}
                  onClick={() => setOpenLeaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={leaveWorkspaceLoading}
                  onClick={handleLeaveWorkspace}
                >
                  {leaveWorkspaceLoading 
                      ? 
                    <LoaderIcon 
                      size="xl"
                    />
                      : 
                    "Leave workspace"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

    
    <div className="flex justify-between items-center px-4 mb-8">
      <p className="text-3xl font-bold">Current Workspace</p>

      <div className="flex items-center gap-3">

          <button
            disabled={leaveWorkspaceLoading}
            onClick = {()=> setOpenLeaveDialog(true)}
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

        {can("INVITE_MEMBERS") && (
          <PendingInvitationsCard />
         )} 

          {/* <TeamCard /> */}
          
          <DeleteCard />

        </div>

          <RightCard />
        </div>


      </div>

    </div>
  );
}
