"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function RightCardSkeleton() {
  return (
    <div className="my-4 w-full shrink-0 space-y-4 sm:my-6 sm:space-y-6 lg:w-80">
      {/* ============================================================
          ORGANISATION STATUS
      ============================================================ */}
      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="p-4 sm:p-5">
          {/* Heading */}
          <div className="mb-4 flex justify-center">
            <Skeleton className="h-6 w-40 rounded-md sm:w-44" />
          </div>

          <div className="space-y-3">
            {/* Founded */}
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-16 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-24 max-w-[45%] rounded-md sm:w-28" />
            </div>

            {/* Location */}
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-16 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-20 max-w-[45%] rounded-md sm:w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          AUTHORS BY GENDER — DONUT CHART
      ============================================================ */}
      <div className="rounded-xl border bg-card">
        {/* Card Header */}
        <div className="flex flex-col items-center p-4 pb-0 sm:p-6 sm:pb-0">
          <Skeleton className="h-5 w-32 rounded-md sm:w-36" />
        </div>

        {/* Donut Chart */}
        <div className="flex justify-center px-4 pb-0 sm:px-6">
          <div className="relative flex h-[210px] w-full items-center justify-center sm:h-[250px]">
            {/* Outer donut */}
            <Skeleton className="h-[150px] w-[150px] rounded-full sm:h-[180px] sm:w-[180px]" />

            {/* Inner hole */}
            <div className="absolute h-[90px] w-[90px] rounded-full bg-card sm:h-[110px] sm:w-[110px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 p-4 pt-1 sm:p-6 sm:pt-2">
          <Skeleton className="h-4 w-24 rounded-md sm:w-28" />
        </div>
      </div>

      {/* ============================================================
          AUTHORS BY LOCATION — HORIZONTAL BAR CHART
      ============================================================ */}
      <div className="rounded-xl border bg-card">
        {/* Chart area */}
        <div className="p-4 sm:p-6">
          <div className="space-y-5">
            {/* Country 1 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Skeleton className="h-4 w-16 shrink-0 rounded-md sm:w-20" />
              <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
            </div>

            {/* Country 2 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Skeleton className="h-4 w-20 shrink-0 rounded-md sm:w-24" />
              <Skeleton className="h-4 w-[75%] rounded-md" />
            </div>

            {/* Country 3 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Skeleton className="h-4 w-14 shrink-0 rounded-md sm:w-16" />
              <Skeleton className="h-4 w-[55%] rounded-md" />
            </div>

            {/* Country 4 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Skeleton className="h-4 w-16 shrink-0 rounded-md sm:w-20" />
              <Skeleton className="h-4 w-[40%] rounded-md" />
            </div>

            {/* Country 5 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Skeleton className="h-4 w-24 shrink-0 rounded-md sm:w-28" />
              <Skeleton className="h-4 w-[65%] rounded-md" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 p-4 pt-1 sm:p-6 sm:pt-2">
          <Skeleton className="h-4 w-32 rounded-md sm:w-36" />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Skeleton } from "@/components/ui/skeleton";

// export default function RightCardSkeleton() {
//   return (
//     <div className="w-80 shrink-0 space-y-6 my-6">

//       {/* ============================================================
//           ORGANISATION STATUS
//       ============================================================ */}
//       <div className="rounded-2xl border shadow-sm bg-card">
//         <div className="p-4">

//           {/* Heading */}
//           <div className="flex justify-center mb-4">
//             <Skeleton className="h-6 w-44 rounded-md" />
//           </div>

//           <div className="space-y-3">

//             {/* Founded */}
//             <div className="flex items-center justify-between gap-2">
//               <Skeleton className="h-4 w-16 rounded-md" />
//               <Skeleton className="h-4 w-28 rounded-md" />
//             </div>

//             {/* Location */}
//             <div className="flex items-center justify-between gap-2">
//               <Skeleton className="h-4 w-16 rounded-md" />
//               <Skeleton className="h-4 w-24 rounded-md" />
//             </div>

//           </div>
//         </div>
//       </div>


//       {/* ============================================================
//           AUTHORS BY GENDER — DONUT CHART
//       ============================================================ */}
//       <div className="rounded-xl border bg-card">

//         {/* Card Header */}
//         <div className="flex flex-col items-center p-6 pb-0">

//           <Skeleton className="h-5 w-36 rounded-md" />

//         </div>


//         {/* Donut Chart */}
//         <div className="flex justify-center px-6 pb-0">

//           <div className="relative flex h-[250px] w-full items-center justify-center">

//             {/* Outer donut */}
//             <Skeleton className="h-[180px] w-[180px] rounded-full" />

//             {/* Inner hole */}
//             <div className="absolute h-[110px] w-[110px] rounded-full bg-card" />

//           </div>

//         </div>


//         {/* Footer */}
//         <div className="flex flex-col items-center gap-2 p-6 pt-2">

//           <Skeleton className="h-4 w-28 rounded-md" />

//         </div>

//       </div>


//       {/* ============================================================
//           AUTHORS BY LOCATION — HORIZONTAL BAR CHART
//       ============================================================ */}
//       <div className="rounded-xl border bg-card">

//         {/* Chart area */}
//         <div className="p-6">

//           <div className="space-y-5">

//             {/* Country 1 */}
//             <div className="flex items-center gap-3">

//               <Skeleton className="h-4 w-20 shrink-0 rounded-md" />

//               <Skeleton className="h-4 flex-1 rounded-md" />

//             </div>


//             {/* Country 2 */}
//             <div className="flex items-center gap-3">

//               <Skeleton className="h-4 w-24 shrink-0 rounded-md" />

//               <Skeleton className="h-4 w-[75%] rounded-md" />

//             </div>


//             {/* Country 3 */}
//             <div className="flex items-center gap-3">

//               <Skeleton className="h-4 w-16 shrink-0 rounded-md" />

//               <Skeleton className="h-4 w-[55%] rounded-md" />

//             </div>


//             {/* Country 4 */}
//             <div className="flex items-center gap-3">

//               <Skeleton className="h-4 w-20 shrink-0 rounded-md" />

//               <Skeleton className="h-4 w-[40%] rounded-md" />

//             </div>


//             {/* Country 5 */}
//             <div className="flex items-center gap-3">

//               <Skeleton className="h-4 w-28 shrink-0 rounded-md" />

//               <Skeleton className="h-4 w-[65%] rounded-md" />

//             </div>

//           </div>

//         </div>


//         {/* Footer */}
//         <div className="flex flex-col items-center gap-2 p-6 pt-2">

//           <Skeleton className="h-4 w-36 rounded-md" />

//         </div>

//       </div>

//     </div>
//   );
// }