"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function RightCardSkeleton() {
  return (
    <div className="w-80 shrink-0 space-y-6 my-6">

      {/* ============================================================
          ORGANISATION STATUS
      ============================================================ */}
      <div className="rounded-2xl border shadow-sm bg-card">
        <div className="p-4">

          {/* Heading */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-6 w-44 rounded-md" />
          </div>

          <div className="space-y-3">

            {/* Founded */}
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>

            {/* Location */}
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>

          </div>
        </div>
      </div>


      {/* ============================================================
          AUTHORS BY GENDER — DONUT CHART
      ============================================================ */}
      <div className="rounded-xl border bg-card">

        {/* Card Header */}
        <div className="flex flex-col items-center p-6 pb-0">

          <Skeleton className="h-5 w-36 rounded-md" />

        </div>


        {/* Donut Chart */}
        <div className="flex justify-center px-6 pb-0">

          <div className="relative flex h-[250px] w-full items-center justify-center">

            {/* Outer donut */}
            <Skeleton className="h-[180px] w-[180px] rounded-full" />

            {/* Inner hole */}
            <div className="absolute h-[110px] w-[110px] rounded-full bg-card" />

          </div>

        </div>


        {/* Footer */}
        <div className="flex flex-col items-center gap-2 p-6 pt-2">

          <Skeleton className="h-4 w-28 rounded-md" />

        </div>

      </div>


      {/* ============================================================
          AUTHORS BY LOCATION — HORIZONTAL BAR CHART
      ============================================================ */}
      <div className="rounded-xl border bg-card">

        {/* Chart area */}
        <div className="p-6">

          <div className="space-y-5">

            {/* Country 1 */}
            <div className="flex items-center gap-3">

              <Skeleton className="h-4 w-20 shrink-0 rounded-md" />

              <Skeleton className="h-4 flex-1 rounded-md" />

            </div>


            {/* Country 2 */}
            <div className="flex items-center gap-3">

              <Skeleton className="h-4 w-24 shrink-0 rounded-md" />

              <Skeleton className="h-4 w-[75%] rounded-md" />

            </div>


            {/* Country 3 */}
            <div className="flex items-center gap-3">

              <Skeleton className="h-4 w-16 shrink-0 rounded-md" />

              <Skeleton className="h-4 w-[55%] rounded-md" />

            </div>


            {/* Country 4 */}
            <div className="flex items-center gap-3">

              <Skeleton className="h-4 w-20 shrink-0 rounded-md" />

              <Skeleton className="h-4 w-[40%] rounded-md" />

            </div>


            {/* Country 5 */}
            <div className="flex items-center gap-3">

              <Skeleton className="h-4 w-28 shrink-0 rounded-md" />

              <Skeleton className="h-4 w-[65%] rounded-md" />

            </div>

          </div>

        </div>


        {/* Footer */}
        <div className="flex flex-col items-center gap-2 p-6 pt-2">

          <Skeleton className="h-4 w-36 rounded-md" />

        </div>

      </div>

    </div>
  );
}