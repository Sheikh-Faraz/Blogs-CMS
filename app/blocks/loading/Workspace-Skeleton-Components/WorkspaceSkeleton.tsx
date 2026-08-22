import { Skeleton } from "@/components/ui/skeleton";

import HeaderCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/HeaderCardSkeleton";
import AboutCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/AboutCardSkeleton";
import WorkspaceAnalyticsSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/WorkspaceAnalyticsSkeleton";
import DeleteCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/DeleteCardSkeleton";
import RightCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/RightCardSkeleton";


export default function WorkspaceSkeleton() {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          Page Header
      ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center px-4 mb-8">
        {/* Current Workspace title */}
        <Skeleton className="h-9 w-64 rounded-md" />

        {/* Create New Workspace button */}
        <Skeleton className="h-10 w-52 rounded-md" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Main Content
      ───────────────────────────────────────────────────────────── */}
      <div className="p-4 min-h-full">

        {/* Header Card Skeleton */}
        <HeaderCardSkeleton />

        {/* ─────────────────────────────────────────────────────────
            Main + Right Column
        ───────────────────────────────────────────────────────── */}
        <div className="flex gap-3">

          {/* Main Column */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* About Card */}
            <AboutCardSkeleton />

            {/* Analytics */}
            <WorkspaceAnalyticsSkeleton />

            {/* Delete Card */}
            <DeleteCardSkeleton />

          </div>

          {/* Right Sidebar */}
          <RightCardSkeleton />

        </div>
      </div>
    </>
  );
}