"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AboutCardSkeleton() {
  const stats = [
    { labelWidth: "w-24" },
    { labelWidth: "w-20" },
    { labelWidth: "w-28" },
    { labelWidth: "w-24" },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="my-4 grid grid-cols-2 gap-3 sm:my-6 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="w-full">
            <div className="relative w-full overflow-hidden rounded-xl border backdrop-blur-md">
              <div className="p-3 sm:p-4">
                {/* Icon */}
                <Skeleton className="mb-2 h-8 w-8 rounded-md sm:h-9 sm:w-9" />

                {/* Label */}
                <Skeleton
                  className={`mb-2 h-3 ${stat.labelWidth} max-w-full rounded-md`}
                />

                {/* Value */}
                <Skeleton className="h-6 w-10 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Workspace */}
      <div className="my-4 sm:my-6">
        <div className="relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-md">
          <div className="relative p-4 sm:p-5">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                {/* Exclamation Icon */}
                <Skeleton className="h-4 w-4 shrink-0 rounded-full sm:h-4.5 sm:w-4.5" />

                {/* About Workspace */}
                <Skeleton className="h-5 w-40 max-w-full rounded-md sm:h-6 sm:w-52" />
              </div>
            </div>

            {/* Divider */}
            <Skeleton className="mb-4 h-px w-full" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-[90%] rounded-md sm:w-[95%]" />
              <Skeleton className="h-3 w-[70%] rounded-md sm:w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { Skeleton } from "@/components/ui/skeleton";

// export default function AboutCardSkeleton() {
//   return (
//     <div>

//       {/* ─────────────────────────────────────────────────────────────
//           STATS CARDS
//           Matches:
//           flex gap-3 my-6
//       ───────────────────────────────────────────────────────────── */}
//       <div className="flex flex-col gap-3 my-6 lg:flex-row">

//         {/* Team Members */}
//         <div className="w-full">
//           <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
//             <div className="p-4">

//               {/* Icon */}
//               <Skeleton className="mb-2 h-9 w-9 rounded-md" />

//               {/* Label */}
//               <Skeleton className="h-3 w-24 rounded-md mb-2" />

//               {/* Value */}
//               <Skeleton className="h-6 w-10 rounded-md" />

//             </div>
//           </div>
//         </div>


//         {/* All Blogs */}
//         <div className="w-full">
//           <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
//             <div className="p-4">

//               {/* Icon */}
//               <Skeleton className="mb-2 h-9 w-9 rounded-md" />

//               {/* Label */}
//               <Skeleton className="h-3 w-20 rounded-md mb-2" />

//               {/* Value */}
//               <Skeleton className="h-6 w-10 rounded-md" />

//             </div>
//           </div>
//         </div>


//         {/* Published Blogs */}
//         <div className="w-full">
//           <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
//             <div className="p-4">

//               {/* Icon */}
//               <Skeleton className="mb-2 h-9 w-9 rounded-md" />

//               {/* Label */}
//               <Skeleton className="h-3 w-28 rounded-md mb-2" />

//               {/* Value */}
//               <Skeleton className="h-6 w-10 rounded-md" />

//             </div>
//           </div>
//         </div>


//         {/* Drafted Blogs */}
//         <div className="w-full">
//           <div className="relative overflow-hidden rounded-xl w-full backdrop-blur-md border">
//             <div className="p-4">

//               {/* Icon */}
//               <Skeleton className="mb-2 h-9 w-9 rounded-md" />

//               {/* Label */}
//               <Skeleton className="h-3 w-24 rounded-md mb-2" />

//               {/* Value */}
//               <Skeleton className="h-6 w-10 rounded-md" />

//             </div>
//           </div>
//         </div>

//       </div>


//       {/* ─────────────────────────────────────────────────────────────
//           ABOUT WORKSPACE
//           Matches:
//           my-6
//           Card -> CardContent p-5
//       ───────────────────────────────────────────────────────────── */}
//       <div className="my-6">

//         <div className="relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm">

//           <div className="relative p-5">

//             {/* Header */}
//             <div className="mb-3">

//               <div className="flex gap-2 items-center">

//                 {/* Exclamation Icon */}
//                 <Skeleton className="h-4.5 w-4.5 rounded-full" />

//                 {/* About Workspace */}
//                 <Skeleton className="h-6 w-52 rounded-md" />

//               </div>

//             </div>


//             {/* Divider */}
//             <Skeleton className="h-px w-full mb-4" />


//             {/* Description */}
//             <div className="space-y-2">

//               <Skeleton className="h-3 w-full rounded-md" />

//               <Skeleton className="h-3 w-[95%] rounded-md" />

//               <Skeleton className="h-3 w-[80%] rounded-md" />

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }