"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderCardSkeleton() {
  return (
    <div>
      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Hero Banner */}
        <div className="m-2 h-40 overflow-hidden rounded-md sm:h-56 md:h-64 lg:h-80">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        {/* Content */}
        <div className="px-4 pb-0 sm:px-5">
          {/* Logo + Edit Button */}
          <div className="mb-3 flex items-start justify-between">
            {/* Workspace Logo */}
            <Skeleton className="h-12 w-12 rounded-2xl sm:h-14 sm:w-14" />

            {/* Edit Workspace Button */}
            <Skeleton className="mt-3 h-9 w-28 rounded-md sm:mt-5 sm:h-10 sm:w-36" />
          </div>

          {/* Workspace Information */}
          <div className="my-3">
            {/* Workspace Name */}
            <Skeleton className="mt-2 h-6 w-40 rounded-md sm:w-48" />

            {/* Location */}
            <div className="my-3 flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-md sm:w-32" />
            </div>

            {/* About */}
            <Skeleton className="h-4 w-full max-w-lg rounded-md sm:w-3/4" />
          </div>

          {/* Social Icons */}
          <div className="my-5 flex flex-wrap items-center gap-3 sm:my-6 sm:gap-4">
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
          </div>

          {/* Separator */}
          <div className="h-px w-full bg-border" />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Skeleton } from "@/components/ui/skeleton";

// export default function HeaderCardSkeleton() {
//   return (
//     <div>
//       {/* Profile Card */}
//       <div className="overflow-hidden rounded-2xl border shadow-sm bg-card">

//         {/* ─────────────────────────────────────────────────────────
//             Hero Banner
//             Matches:
//             h-80 + m-2 + rounded-md
//         ───────────────────────────────────────────────────────── */}
//         <div className="h-80 m-2 rounded-md overflow-hidden">
//           <Skeleton className="w-full h-full rounded-md" />
//         </div>


//         {/* ─────────────────────────────────────────────────────────
//             Content
//         ───────────────────────────────────────────────────────── */}
//         <div className="px-5 pt-0 pb-0">

//           {/* Logo + Edit Button */}
//           <div className="flex items-start justify-between mb-3">

//             {/* Workspace Logo */}
//             <Skeleton className="w-14 h-14 rounded-2xl" />

//             {/* Edit Workspace Button */}
//             <Skeleton className="h-10 w-36 rounded-md mt-5" />

//           </div>


//           {/* ─────────────────────────────────────────────────────
//               Workspace Information
//           ───────────────────────────────────────────────────── */}
//           <div className="my-3">

//             {/* Workspace Name */}
//             <Skeleton className="h-6 w-48 rounded-md mt-2" />

//             {/* Location */}
//             <div className="flex items-center gap-2 my-3">
//               <Skeleton className="size-4 rounded-full" />
//               <Skeleton className="h-4 w-32 rounded-md" />
//             </div>

//             {/* About */}
//             <Skeleton className="h-4 w-3/4 rounded-md" />

//           </div>


//           {/* ─────────────────────────────────────────────────────
//               Social Icons
//           ───────────────────────────────────────────────────── */}
//           <div className="flex items-center gap-4 my-6">

//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <Skeleton className="h-10 w-10 rounded-full" />

//           </div>


//           {/* Separator */}
//           <div className="h-px w-full bg-border" />

//         </div>
//       </div>
//     </div>
//   );
// }