"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderCardSkeleton() {
  return (
    <div>
      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border shadow-sm bg-card">

        {/* ─────────────────────────────────────────────────────────
            Hero Banner
            Matches:
            h-80 + m-2 + rounded-md
        ───────────────────────────────────────────────────────── */}
        <div className="h-80 m-2 rounded-md overflow-hidden">
          <Skeleton className="w-full h-full rounded-md" />
        </div>


        {/* ─────────────────────────────────────────────────────────
            Content
        ───────────────────────────────────────────────────────── */}
        <div className="px-5 pt-0 pb-0">

          {/* Logo + Edit Button */}
          <div className="flex items-start justify-between mb-3">

            {/* Workspace Logo */}
            <Skeleton className="w-14 h-14 rounded-2xl" />

            {/* Edit Workspace Button */}
            <Skeleton className="h-10 w-36 rounded-md mt-5" />

          </div>


          {/* ─────────────────────────────────────────────────────
              Workspace Information
          ───────────────────────────────────────────────────── */}
          <div className="my-3">

            {/* Workspace Name */}
            <Skeleton className="h-6 w-48 rounded-md mt-2" />

            {/* Location */}
            <div className="flex items-center gap-2 my-3">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>

            {/* About */}
            <Skeleton className="h-4 w-3/4 rounded-md" />

          </div>


          {/* ─────────────────────────────────────────────────────
              Social Icons
          ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 my-6">

            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />

          </div>


          {/* Separator */}
          <div className="h-px w-full bg-border" />

        </div>
      </div>
    </div>
  );
}