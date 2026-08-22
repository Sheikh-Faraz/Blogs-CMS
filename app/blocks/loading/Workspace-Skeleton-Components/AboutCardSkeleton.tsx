"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AboutCardSkeleton() {
  return (
    <div>

      {/* ─────────────────────────────────────────────────────────────
          STATS CARDS
          Matches:
          flex gap-3 my-6
      ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 my-6">

        {/* Team Members */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
            <div className="p-4">

              {/* Icon */}
              <Skeleton className="mb-2 h-9 w-9 rounded-md" />

              {/* Label */}
              <Skeleton className="h-3 w-24 rounded-md mb-2" />

              {/* Value */}
              <Skeleton className="h-6 w-10 rounded-md" />

            </div>
          </div>
        </div>


        {/* All Blogs */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
            <div className="p-4">

              {/* Icon */}
              <Skeleton className="mb-2 h-9 w-9 rounded-md" />

              {/* Label */}
              <Skeleton className="h-3 w-20 rounded-md mb-2" />

              {/* Value */}
              <Skeleton className="h-6 w-10 rounded-md" />

            </div>
          </div>
        </div>


        {/* Published Blogs */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
            <div className="p-4">

              {/* Icon */}
              <Skeleton className="mb-2 h-9 w-9 rounded-md" />

              {/* Label */}
              <Skeleton className="h-3 w-28 rounded-md mb-2" />

              {/* Value */}
              <Skeleton className="h-6 w-10 rounded-md" />

            </div>
          </div>
        </div>


        {/* Drafted Blogs */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
            <div className="p-4">

              {/* Icon */}
              <Skeleton className="mb-2 h-9 w-9 rounded-md" />

              {/* Label */}
              <Skeleton className="h-3 w-24 rounded-md mb-2" />

              {/* Value */}
              <Skeleton className="h-6 w-10 rounded-md" />

            </div>
          </div>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          ABOUT WORKSPACE
          Matches:
          my-6
          Card -> CardContent p-5
      ───────────────────────────────────────────────────────────── */}
      <div className="my-6">

        <div className="relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm">

          <div className="relative p-5">

            {/* Header */}
            <div className="mb-3">

              <div className="flex gap-2 items-center">

                {/* Exclamation Icon */}
                <Skeleton className="h-[18px] w-[18px] rounded-full" />

                {/* About Workspace */}
                <Skeleton className="h-6 w-52 rounded-md" />

              </div>

            </div>


            {/* Divider */}
            <Skeleton className="h-px w-full mb-4" />


            {/* Description */}
            <div className="space-y-2">

              <Skeleton className="h-3 w-full rounded-md" />

              <Skeleton className="h-3 w-[95%] rounded-md" />

              <Skeleton className="h-3 w-[80%] rounded-md" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}