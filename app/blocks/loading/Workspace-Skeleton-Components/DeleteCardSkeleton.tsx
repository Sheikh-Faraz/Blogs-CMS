"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DeleteCardSkeleton() {
  return (
    <div>
      {/* ─────────────────────────────────────────────────────────────
          Danger Zone
      ───────────────────────────────────────────────────────────── */}
      <div className="my-6">
        <div className="relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm">

          <div className="relative p-5">

            {/* Header */}
            <div className="mb-3">
              <div className="flex gap-2 items-center">

                {/* Warning Icon */}
                <Skeleton className="h-[18px] w-[18px] rounded-full" />

                {/* Danger Zone */}
                <Skeleton className="h-6 w-32 rounded-md" />

              </div>
            </div>


            {/* Divider */}
            <Skeleton className="h-px w-full mb-4" />


            {/* Content + Delete Button */}
            <div className="leading-relaxed flex justify-between items-center gap-4">

              {/* Text */}
              <div>
                {/* Delete Workspace */}
                <Skeleton className="h-5 w-40 rounded-md" />

                {/* Confirmation text */}
                <Skeleton className="h-3 w-64 rounded-md my-2" />
              </div>

              {/* Delete Button */}
              <Skeleton className="h-9 w-32 rounded-md shrink-0" />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}