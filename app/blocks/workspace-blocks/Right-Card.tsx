"use client";

import { useEffect } from "react";

// Context 
import { useUser } from "@/context/User.context";

import { Card, CardContent } from "@/components/ui/card";


export default function RightCard() {

    // User Context
    const { fetchUser, authUser, 
      // members 
} = useUser();

    useEffect(() => {
        fetchUser();
    }, [])

  return (


<div className="w-80 shrink-0 space-y-6 my-6">

        {/* Organisation status */}
        <Card className="rounded-sm border shadow-sm text-white bg-[#E85129]">
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Organisation status</h3>
            <div className="space-y-2">

                <div className="flex items-center justify-between gap-2 text-center ">
                  <span className="text-md shrink-0">Founded</span>
                  <span className="text-md font-medium text-right">{authUser?.defaultWorkspace?.createdAt ? String(new Date(authUser.defaultWorkspace.createdAt).getFullYear()) : "N/A"}</span>
                </div>

                <div className="flex items-center justify-between gap-2 text-center ">
                  <span className="text-md shrink-0">Location</span>
                  <span className="text-md font-medium text-right">{authUser?.defaultWorkspace?.location || "N/A"}</span>
                </div>

            </div>
          </CardContent>
        </Card>

      </div>
  );
}
