import { Skeleton } from "@/components/ui/skeleton";

import HeaderCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/HeaderCardSkeleton";
import AboutCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/AboutCardSkeleton";
import WorkspaceAnalyticsSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/WorkspaceAnalyticsSkeleton";
import DeleteCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/DeleteCardSkeleton";
import RightCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/RightCardSkeleton";

export default function WorkspaceSkeleton() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-3 px-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
        {/* Current Workspace title */}
        <Skeleton className="h-8 w-48 rounded-md sm:h-9 sm:w-64" />

        {/* Create New Workspace button */}
        <Skeleton className="h-10 w-full rounded-md sm:w-52" />
      </div>

      {/* Main Content */}
      <div className="min-h-full p-4">
        {/* Header Card */}
        <HeaderCardSkeleton />

        {/* Main + Right Column */}
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-3">
          {/* Main Column */}
          <div className="min-w-0 flex-1 space-y-4">
            {/* About Card */}
            <AboutCardSkeleton />

            {/* Analytics */}
            <WorkspaceAnalyticsSkeleton />

            {/* Show for smaller and not on bigger screens */}
            <div className="xl:hidden w-full lg:w-auto">
              <RightCardSkeleton />
            </div>

            {/* Delete Card */}
            <DeleteCardSkeleton />
          </div>

          {/* Right Sidebar */}
          {/* <div className="w-full lg:w-auto">
            <RightCardSkeleton />
          </div> */}

                    {/* Show this on larger screns and donot show this on smaller screens for responsiveness */}
                    <div className="hidden xl:block w-full lg:w-auto">
                      <RightCardSkeleton />
                    </div>

        </div>
      </div>
    </>
  );
}


// import { Skeleton } from "@/components/ui/skeleton";

// import HeaderCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/HeaderCardSkeleton";
// import AboutCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/AboutCardSkeleton";
// import WorkspaceAnalyticsSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/WorkspaceAnalyticsSkeleton";
// import DeleteCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/DeleteCardSkeleton";
// import RightCardSkeleton from "@/app/blocks/loading/Workspace-Skeleton-Components/RightCardSkeleton";


// export default function WorkspaceSkeleton() {
//   return (
//     <>
//       {/* ─────────────────────────────────────────────────────────────
//           Page Header
//       ───────────────────────────────────────────────────────────── */}
//       <div className="flex justify-between items-center px-4 mb-8">
//         {/* Current Workspace title */}
//         <Skeleton className="h-9 w-64 rounded-md" />

//         {/* Create New Workspace button */}
//         <Skeleton className="h-10 w-52 rounded-md" />
//       </div>

//       {/* ─────────────────────────────────────────────────────────────
//           Main Content
//       ───────────────────────────────────────────────────────────── */}
//       <div className="p-4 min-h-full">

//         {/* Header Card Skeleton */}
//         <HeaderCardSkeleton />

//         {/* ─────────────────────────────────────────────────────────
//             Main + Right Column
//         ───────────────────────────────────────────────────────── */}
//         <div className="flex gap-3">

//           {/* Main Column */}
//           <div className="flex-1 min-w-0 space-y-4">

//             {/* About Card */}
//             <AboutCardSkeleton />

//             {/* Analytics */}
//             <WorkspaceAnalyticsSkeleton />

//             {/* Delete Card */}
//             <DeleteCardSkeleton />

//           </div>

//           {/* Right Sidebar */}
//           <RightCardSkeleton />

//         </div>
//       </div>
//     </>
//   );
// }