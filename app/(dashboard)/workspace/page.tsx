"use client";

import { useEffect } from "react";
import Link from "next/link";

// Context 
import { useUser } from "@/context/User.context";

// Loading context
// import { useGlobalLoading } from "@/context/Loading.context";


// Header 
import HeaderCard from "@/app/blocks/workspace-blocks/header-card";
// About & Stats
import AboutCard from "@/app/blocks/workspace-blocks/about-card";
// Stats
import StatsCard from "@/app/blocks/workspace-blocks/stats-card";
// Team Members 
import TeamCard from "@/app/blocks/workspace-blocks/team-card";
// Right Side info card 
import RightCard from "@/app/blocks/workspace-blocks/Right-Card";
// Delete card 
import DeleteCard from "@/app/blocks/workspace-blocks/delete-card";


import { FiPlusCircle as Plus } from "react-icons/fi";



export default function WorkspacePage() {

    // User Context
    const { fetchUser, 
      // authUser, 
      // members 
    } = useUser();

    // Loading context 
    // const { setIsLoading } = useGlobalLoading();

    useEffect(() => {

        // setIsLoading(false);
        fetchUser();

    }, [])

  return (
    <div>
    
    <div className="flex justify-between items-center px-4 mb-8">
      <p className="text-3xl font-bold">Current Workspace</p>
      <Link href="#" className="border py-2 px-3 bg-[#E85129] text-white rounded-md flex gap-2 items-center">
        <Plus />
        Create New Workspace
      </Link>
    </div>

      {/* <div className="flex gap-5 p-4 min-h-full border border-blue-600"> */}
      <div className="p-4 min-h-full">
        <HeaderCard />

        {/* ── Main column ────────────────────────────────────────────────────── */}
        <div className="flex gap-3">

        <div className="flex-1 min-w-0 space-y-4">

          <AboutCard />

          {/* <StatsCard /> */}

          {/* <TeamCard /> */}
          
          <DeleteCard />

        </div>

          <RightCard />
        </div>


      </div>

    </div>
  );
}
