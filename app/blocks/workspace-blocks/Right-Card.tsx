"use client";

import { useEffect } from "react";

// Context 
import { useUser } from "@/context/User.context";

import { Card, CardContent } from "@/components/ui/card";


import { DonutChart } from "@/app/blocks/workspace-blocks/Donut-Chart";

import { HorizontalBarChart } from "@/app/blocks/workspace-blocks/Horizontal-Bar-Chart";


export default function RightCard() {

    // User Context
    const { 
      fetchUser, 
      // authUser, 
      
      CurrentActiveWorkspace, 
      workspace,

    } = useUser();
    
          
    useEffect(() => {

      fetchUser();

      CurrentActiveWorkspace();   // Fetch the current active workspace details

    }, [])

  return (


<div className="w-80 shrink-0 space-y-6 my-6">

        {/* Organisation status */}
        <Card className="rounded-2xl border shadow-sm text-white bg-[#E85129]">
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Organisation status</h3>
            <div className="space-y-2">

                <div className="flex items-center justify-between gap-2 text-center ">
                  <span className="text-md shrink-0">Founded:</span>
                  <span className="text-md font-medium text-right">{workspace?.founded ? String(new Date(workspace.founded).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })) 
                    : ""}
              </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-center ">
                  <span className="text-md shrink-0">Location:</span>
                  <span className="text-md font-medium text-right">{workspace?.location || ""}</span>
                </div>

            </div>
          </CardContent>
        </Card>
      
      
      {/* Showing Donut Chart/Pie */}
      <DonutChart />

      {/* Showing Horizontal Chart/Pie */}
      <HorizontalBarChart />

      </div>
  );
}
