"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceAnalyticsSkeleton() {
  return (
    <div className="w-full">
      <div className="overflow-hidden border border-border/60 bg-card shadow-sm">
        {/* HEADER */}
        <div className="border-b border-border/60 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            {/* Left side */}
            <div>
              <Skeleton className="h-4 w-28 rounded-md sm:w-32" />

              <div className="mt-2 flex items-baseline gap-2 sm:gap-3">
                <Skeleton className="h-9 w-12 rounded-md sm:h-10 sm:w-14" />
                <Skeleton className="h-4 w-16 rounded-md sm:w-20" />
              </div>
            </div>

            {/* Right side summary */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Published */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />

                <div className="space-y-1">
                  <Skeleton className="h-3 w-14 rounded-md sm:w-16" />
                  <Skeleton className="h-4 w-8 rounded-md" />
                </div>
              </div>

              {/* Drafts */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />

                <div className="space-y-1">
                  <Skeleton className="h-3 w-10 rounded-md sm:w-12" />
                  <Skeleton className="h-4 w-8 rounded-md" />
                </div>
              </div>

              {/* Authors */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-md" />

                <div className="space-y-1">
                  <Skeleton className="h-3 w-10 rounded-md sm:w-12" />
                  <Skeleton className="h-4 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="px-4 pt-6 sm:px-6 sm:pt-8">
          {/* Chart heading */}
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div>
              <Skeleton className="h-4 w-28 rounded-md sm:w-32" />
              <Skeleton className="mt-2 h-3 w-40 rounded-md sm:w-56" />
            </div>

            {/* Chart legend */}
            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            </div>
          </div>

          {/* Fake chart */}
          <div className="h-64 w-full sm:h-80">
            <div className="relative h-full w-full">
              {/* Horizontal chart lines */}
              <div className="absolute inset-x-0 top-[15%] border-t border-dashed border-border/60" />
              <div className="absolute inset-x-0 top-[35%] border-t border-dashed border-border/60" />
              <div className="absolute inset-x-0 top-[55%] border-t border-dashed border-border/60" />
              <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-border/60" />
              <div className="absolute inset-x-0 top-[95%] border-t border-dashed border-border/60" />

              {/* Y-axis labels */}
              <div className="absolute left-0 top-[10%]">
                <Skeleton className="h-3 w-5 rounded-sm" />
              </div>

              <div className="absolute left-0 top-[30%]">
                <Skeleton className="h-3 w-5 rounded-sm" />
              </div>

              <div className="absolute left-0 top-[50%]">
                <Skeleton className="h-3 w-5 rounded-sm" />
              </div>

              <div className="absolute left-0 top-[70%]">
                <Skeleton className="h-3 w-5 rounded-sm" />
              </div>

              {/* Fake bars */}
              <div className="absolute inset-x-8 bottom-7 top-5 flex items-end justify-around gap-4 sm:inset-x-10 sm:gap-8">
                <Skeleton className="h-[45%] w-10 rounded-t-md sm:w-16" />
                <Skeleton className="h-[70%] w-10 rounded-t-md sm:w-16" />
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                <Skeleton className="h-3 w-12 rounded-sm sm:w-16" />
                <Skeleton className="h-3 w-10 rounded-sm sm:w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 border-y border-border/60 sm:grid-cols-3">
          {/* Total blogs */}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="mt-2 h-7 w-12 rounded-md" />
            <Skeleton className="mt-2 h-3 w-24 rounded-md sm:w-28" />
          </div>

          {/* Published */}
          <div className="border-t border-border/60 px-4 py-4 sm:border-l sm:border-t-0 sm:px-6 sm:py-5">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="mt-2 h-7 w-16 rounded-md" />
            <Skeleton className="mt-2 h-3 w-28 rounded-md sm:w-32" />
          </div>

          {/* Drafts */}
          <div className="border-t border-border/60 px-4 py-4 sm:border-l sm:border-t-0 sm:px-6 sm:py-5">
            <Skeleton className="h-3 w-12 rounded-md" />
            <Skeleton className="mt-2 h-7 w-16 rounded-md" />
            <Skeleton className="mt-2 h-3 w-32 rounded-md sm:w-36" />
          </div>
        </div>

        {/* AUTHORS */}
        <div>
          {/* Author header */}
          <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <Skeleton className="h-4 w-28 rounded-md sm:w-32" />
              <Skeleton className="mt-2 h-3 w-40 rounded-md sm:w-56" />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-md" />
              <Skeleton className="h-3 w-12 rounded-md sm:w-16" />
            </div>
          </div>

          {/* Table header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-border/60 px-6 py-3 md:grid">
            <Skeleton className="h-3 w-12 rounded-md" />
            <Skeleton className="ml-auto h-3 w-10 rounded-md" />
            <Skeleton className="ml-auto h-3 w-16 rounded-md" />
            <Skeleton className="ml-auto h-3 w-12 rounded-md" />
            <Skeleton className="ml-auto h-3 w-12 rounded-md" />
          </div>

          {/* Author rows */}
          <div className="divide-y divide-border/60">
            {[1, 2, 3].map((row) => (
              <div key={row} className="px-4 py-4 sm:px-6">
                {/* Desktop */}
                <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 md:grid">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />

                    <div className="space-y-2">
                      <Skeleton
                        className={`h-4 ${
                          row === 1
                            ? "w-28"
                            : row === 2
                              ? "w-32"
                              : "w-24"
                        } rounded-md`}
                      />
                      <Skeleton className="h-3 w-12 rounded-md" />
                    </div>
                  </div>

                  <Skeleton className="ml-auto h-4 w-8 rounded-md" />
                  <Skeleton className="ml-auto h-4 w-8 rounded-md" />
                  <Skeleton className="ml-auto h-4 w-8 rounded-md" />

                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-1.5 w-14 rounded-full" />
                    <Skeleton className="h-3 w-8 rounded-md" />
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-center justify-between gap-3 md:hidden">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0 space-y-2">
                      <Skeleton
                        className={`h-4 ${
                          row === 1
                            ? "w-28"
                            : row === 2
                              ? "w-32"
                              : "w-24"
                        } max-w-[35vw] rounded-md`}
                      />
                      <Skeleton className="h-3 w-14 rounded-md" />
                    </div>
                  </div>

                  <div className="shrink-0 space-y-2 text-right">
                    <Skeleton className="ml-auto h-4 w-16 rounded-md sm:w-20" />
                    <Skeleton className="ml-auto h-3 w-12 rounded-md sm:w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Skeleton } from "@/components/ui/skeleton";

// export default function WorkspaceAnalyticsSkeleton() {
//   return (
//     <div className="w-full">
//       <div className="overflow-hidden border border-border/60 bg-card shadow-sm">

//         {/* ============================================================
//             HEADER
//         ============================================================ */}
//         <div className="border-b border-border/60 px-6 py-6">
//           <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

//             {/* Left side */}
//             <div>
//               {/* Workspace content */}
//               <Skeleton className="h-4 w-32 rounded-md" />

//               {/* Total blogs */}
//               <div className="mt-2 flex items-baseline gap-3">
//                 <Skeleton className="h-10 w-14 rounded-md" />
//                 <Skeleton className="h-4 w-20 rounded-md" />
//               </div>
//             </div>

//             {/* Right side summary */}
//             <div className="flex flex-wrap items-center gap-5">

//               {/* Published */}
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-2.5 w-2.5 rounded-full" />

//                 <div className="space-y-1">
//                   <Skeleton className="h-3 w-16 rounded-md" />
//                   <Skeleton className="h-4 w-8 rounded-md" />
//                 </div>
//               </div>

//               {/* Drafts */}
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-2.5 w-2.5 rounded-full" />

//                 <div className="space-y-1">
//                   <Skeleton className="h-3 w-12 rounded-md" />
//                   <Skeleton className="h-4 w-8 rounded-md" />
//                 </div>
//               </div>

//               {/* Authors */}
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-4 w-4 rounded-md" />

//                 <div className="space-y-1">
//                   <Skeleton className="h-3 w-12 rounded-md" />
//                   <Skeleton className="h-4 w-8 rounded-md" />
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>


//         {/* ============================================================
//             CHART
//         ============================================================ */}
//         <div className="px-6 pt-8">

//           {/* Chart heading */}
//           <div className="mb-5 flex items-center justify-between">

//             <div>
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="mt-2 h-3 w-56 rounded-md" />
//             </div>

//             {/* Chart legend */}
//             <div className="hidden items-center gap-4 sm:flex">

//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-2 w-2 rounded-full" />
//                 <Skeleton className="h-3 w-16 rounded-md" />
//               </div>

//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-2 w-2 rounded-full" />
//                 <Skeleton className="h-3 w-12 rounded-md" />
//               </div>

//             </div>
//           </div>


//           {/* Fake chart */}
//           <div className="h-80 w-full">

//             <div className="relative h-full w-full">

//               {/* Horizontal chart lines */}
//               <div className="absolute inset-x-0 top-[15%] border-t border-dashed border-border/60" />
//               <div className="absolute inset-x-0 top-[35%] border-t border-dashed border-border/60" />
//               <div className="absolute inset-x-0 top-[55%] border-t border-dashed border-border/60" />
//               <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-border/60" />
//               <div className="absolute inset-x-0 top-[95%] border-t border-dashed border-border/60" />

//               {/* Y-axis labels */}
//               <div className="absolute left-0 top-[10%]">
//                 <Skeleton className="h-3 w-6 rounded-sm" />
//               </div>

//               <div className="absolute left-0 top-[30%]">
//                 <Skeleton className="h-3 w-6 rounded-sm" />
//               </div>

//               <div className="absolute left-0 top-[50%]">
//                 <Skeleton className="h-3 w-6 rounded-sm" />
//               </div>

//               <div className="absolute left-0 top-[70%]">
//                 <Skeleton className="h-3 w-6 rounded-sm" />
//               </div>


//               {/* Fake bars */}
//               <div className="absolute inset-x-10 bottom-8 top-5 flex items-end justify-around gap-8">

//                 <Skeleton className="h-[45%] w-16 rounded-t-md" />

//                 <Skeleton className="h-[70%] w-16 rounded-t-md" />

//               </div>


//               {/* X-axis labels */}
//               <div className="absolute bottom-0 left-0 right-0 flex justify-around">

//                 <Skeleton className="h-3 w-16 rounded-sm" />

//                 <Skeleton className="h-3 w-12 rounded-sm" />

//               </div>

//             </div>
//           </div>
//         </div>


//         {/* ============================================================
//             SUMMARY
//         ============================================================ */}
//         <div className="grid grid-cols-1 border-y border-border/60 sm:grid-cols-3">

//           {/* Total blogs */}
//           <div className="px-6 py-5">
//             <Skeleton className="h-3 w-20 rounded-md" />

//             <Skeleton className="mt-2 h-7 w-12 rounded-md" />

//             <Skeleton className="mt-2 h-3 w-28 rounded-md" />
//           </div>


//           {/* Published */}
//           <div className="border-t border-border/60 px-6 py-5 sm:border-l sm:border-t-0">

//             <Skeleton className="h-3 w-16 rounded-md" />

//             <Skeleton className="mt-2 h-7 w-16 rounded-md" />

//             <Skeleton className="mt-2 h-3 w-32 rounded-md" />

//           </div>


//           {/* Drafts */}
//           <div className="border-t border-border/60 px-6 py-5 sm:border-l sm:border-t-0">

//             <Skeleton className="h-3 w-12 rounded-md" />

//             <Skeleton className="mt-2 h-7 w-16 rounded-md" />

//             <Skeleton className="mt-2 h-3 w-36 rounded-md" />

//           </div>

//         </div>


//         {/* ============================================================
//             AUTHORS
//         ============================================================ */}
//         <div>

//           {/* Author header */}
//           <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">

//             <div>
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="mt-2 h-3 w-56 rounded-md" />
//             </div>

//             <div className="flex items-center gap-2">
//               <Skeleton className="h-3.5 w-3.5 rounded-md" />
//               <Skeleton className="h-3 w-16 rounded-md" />
//             </div>

//           </div>


//           {/* Table header */}
//           <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-border/60 px-6 py-3 md:grid">

//             <Skeleton className="h-3 w-12 rounded-md" />
//             <Skeleton className="ml-auto h-3 w-10 rounded-md" />
//             <Skeleton className="ml-auto h-3 w-16 rounded-md" />
//             <Skeleton className="ml-auto h-3 w-12 rounded-md" />
//             <Skeleton className="ml-auto h-3 w-12 rounded-md" />

//           </div>


//           {/* Author rows */}
//           <div className="divide-y divide-border/60">

//             {/* Row 1 */}
//             <div className="px-6 py-4">

//               {/* Desktop */}
//               <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 md:grid">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-28 rounded-md" />
//                     <Skeleton className="h-3 w-12 rounded-md" />
//                   </div>

//                 </div>

//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />

//                 <div className="flex items-center justify-end gap-2">
//                   <Skeleton className="h-1.5 w-14 rounded-full" />
//                   <Skeleton className="h-3 w-8 rounded-md" />
//                 </div>

//               </div>


//               {/* Mobile */}
//               <div className="flex items-center justify-between md:hidden">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-28 rounded-md" />
//                     <Skeleton className="h-3 w-16 rounded-md" />
//                   </div>

//                 </div>

//                 <div className="space-y-2 text-right">
//                   <Skeleton className="ml-auto h-4 w-20 rounded-md" />
//                   <Skeleton className="ml-auto h-3 w-14 rounded-md" />
//                 </div>

//               </div>

//             </div>


//             {/* Row 2 */}
//             <div className="px-6 py-4">

//               {/* Desktop */}
//               <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 md:grid">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-32 rounded-md" />
//                     <Skeleton className="h-3 w-12 rounded-md" />
//                   </div>

//                 </div>

//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />

//                 <div className="flex items-center justify-end gap-2">
//                   <Skeleton className="h-1.5 w-14 rounded-full" />
//                   <Skeleton className="h-3 w-8 rounded-md" />
//                 </div>

//               </div>


//               {/* Mobile */}
//               <div className="flex items-center justify-between md:hidden">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-32 rounded-md" />
//                     <Skeleton className="h-3 w-16 rounded-md" />
//                   </div>

//                 </div>

//                 <div className="space-y-2 text-right">
//                   <Skeleton className="ml-auto h-4 w-20 rounded-md" />
//                   <Skeleton className="ml-auto h-3 w-14 rounded-md" />
//                 </div>

//               </div>

//             </div>


//             {/* Row 3 */}
//             <div className="px-6 py-4">

//               {/* Desktop */}
//               <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 md:grid">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-24 rounded-md" />
//                     <Skeleton className="h-3 w-12 rounded-md" />
//                   </div>

//                 </div>

//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />
//                 <Skeleton className="ml-auto h-4 w-8 rounded-md" />

//                 <div className="flex items-center justify-end gap-2">
//                   <Skeleton className="h-1.5 w-14 rounded-full" />
//                   <Skeleton className="h-3 w-8 rounded-md" />
//                 </div>

//               </div>


//               {/* Mobile */}
//               <div className="flex items-center justify-between md:hidden">

//                 <div className="flex items-center gap-3">

//                   <Skeleton className="h-9 w-9 rounded-full" />

//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-24 rounded-md" />
//                     <Skeleton className="h-3 w-16 rounded-md" />
//                   </div>

//                 </div>

//                 <div className="space-y-2 text-right">
//                   <Skeleton className="ml-auto h-4 w-20 rounded-md" />
//                   <Skeleton className="ml-auto h-3 w-14 rounded-md" />
//                 </div>

//               </div>

//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }