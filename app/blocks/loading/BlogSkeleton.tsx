"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-3">
          <Skeleton className="h-7 w-44 rounded-none sm:h-8 sm:w-56" />
          <Skeleton className="h-4 w-32 rounded-none sm:w-40" />
        </div>

        <Skeleton className="h-10 w-full rounded-none sm:w-28" />
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b px-4 py-3 sm:gap-8 sm:px-6">
        <Skeleton className="h-4 w-24 rounded-none sm:w-28" />
        <Skeleton className="h-4 w-32 rounded-none sm:w-40" />
        <Skeleton className="h-4 w-36 rounded-none sm:w-44" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3">
        {/* LEFT SIDE / EDITOR */}
        <div className="border lg:col-span-2">
          {/* TITLE */}
          <div className="space-y-4 p-4 sm:p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20 rounded-none sm:w-24" />
              <Skeleton className="h-10 w-full rounded-none sm:h-12" />
            </div>
          </div>

          {/* TABS */}
          <div className="my-4 w-full sm:my-5">
            <div className="flex gap-4 overflow-x-hidden border-b px-4 pb-4 sm:gap-6 sm:px-6">
              <Skeleton className="h-5 w-12 shrink-0 rounded-none sm:w-14" />
              <Skeleton className="h-5 w-16 shrink-0 rounded-none sm:w-20" />
              <Skeleton className="h-5 w-10 shrink-0 rounded-none sm:w-12" />
              <Skeleton className="h-5 w-24 shrink-0 rounded-none sm:w-32" />
            </div>

            {/* CONTENT AREA */}
            <div className="m-3 border rounded-none sm:m-4">
              <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
                <Skeleton className="h-10 w-full rounded-none" />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Skeleton className="h-10 w-full rounded-none" />
                  <Skeleton className="h-10 w-full rounded-none" />
                </div>

                <Skeleton className="h-72 w-full rounded-none sm:h-100" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="h-full overflow-hidden border">
          <div className="m-4">
            <Skeleton className="h-7 w-40 rounded-none sm:w-52" />
          </div>

          <Card className="m-3 h-full rounded-none border-y sm:m-4">
            <CardContent className="space-y-6 p-4 sm:space-y-8">
              {/* SLUG */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 rounded-none sm:w-28" />
                <Skeleton className="h-10 w-full rounded-none sm:h-12" />
              </div>

              {/* STATUS */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-16 rounded-none sm:w-20" />
                <Skeleton className="h-10 w-full rounded-none sm:h-12" />
              </div>

              {/* CATEGORY */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-20 rounded-none sm:w-24" />

                <div className="flex gap-2">
                  <Skeleton className="h-10 min-w-0 flex-1 rounded-none sm:h-12" />
                  <Skeleton className="h-10 w-10 shrink-0 rounded-none sm:h-12 sm:w-12" />
                </div>

                <Skeleton className="h-10 w-full rounded-none sm:h-12" />
              </div>

              {/* TAGS */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-12 rounded-none sm:w-14" />

                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-none sm:w-20" />
                  <Skeleton className="h-8 w-20 rounded-none sm:w-24" />
                </div>

                <Skeleton className="h-10 w-full rounded-none sm:h-12" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";

// export default function BlogSkeleton() {
//   return (
//     <div className="w-full animate-pulse">

//       {/* 🔥 HEADER */}
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <div className="space-y-3">
//           <Skeleton className="h-8 w-56 rounded-none" />
//           <Skeleton className="h-4 w-40 rounded-none" />
//         </div>

//         <Skeleton className="h-10 w-28 rounded-none" />
//       </div>

//       {/* INFO BAR */}
//       <div className="flex flex-wrap gap-8 px-6 py-3 border-b">
//         <Skeleton className="h-4 w-28 rounded-none" />
//         <Skeleton className="h-4 w-40 rounded-none" />
//         <Skeleton className="h-4 w-44 rounded-none" />
//       </div>

//       {/* 🔥 MAIN GRID */}
//       <div className="grid grid-cols-3 px-6 py-4">

//         {/* LEFT SIDE */}
//         <div className="col-span-2 border">

//           {/* TITLE */}
//           <div className="p-6 space-y-4">
//             <div className="space-y-3">
//               <Skeleton className="h-4 w-24 rounded-none" />
//               <Skeleton className="h-12 w-full rounded-none" />
//             </div>
//           </div>

//           {/* TABS */}
//           <div className="w-full my-5">

//             <div className="flex gap-6 px-6 border-b pb-4">
//               <Skeleton className="h-5 w-14 rounded-none" />
//               <Skeleton className="h-5 w-20 rounded-none" />
//               <Skeleton className="h-5 w-12 rounded-none" />
//               <Skeleton className="h-5 w-32 rounded-none" />
//             </div>

//             {/* CONTENT AREA */}
//             <div className="m-4 border rounded-none">
//               <div className="p-6 space-y-6">

//                 <Skeleton className="h-10 w-full rounded-none" />

//                 <div className="flex gap-3">
//                   <Skeleton className="h-10 flex-1 rounded-none" />
//                   <Skeleton className="h-10 flex-1 rounded-none" />
//                 </div>

//                 <Skeleton className="h-100 w-full rounded-none" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔥 RIGHT SIDEBAR */}
//         {/* <div className="bg-[#0A0A0A] overflow-hidden h-full border"> */}
//         <div className="overflow-hidden h-full border">
          
//           <div className="m-4">
//             <Skeleton className="h-7 w-52 rounded-none" />
//           </div>

//           <Card className="border-y h-full rounded-none m-4">
//             <CardContent className="p-4 space-y-8">

//               {/* SLUG */}
//               <div className="space-y-3">
//                 <Skeleton className="h-4 w-28 rounded-none" />
//                 <Skeleton className="h-12 w-full rounded-none" />
//               </div>

//               {/* STATUS */}
//               <div className="space-y-3">
//                 <Skeleton className="h-4 w-20 rounded-none" />
//                 <Skeleton className="h-12 w-full rounded-none" />
//               </div>

//               {/* CATEGORY */}
//               <div className="space-y-3">
//                 <Skeleton className="h-4 w-24 rounded-none" />

//                 <div className="flex gap-2">
//                   <Skeleton className="h-12 flex-1 rounded-none" />
//                   <Skeleton className="h-12 w-12 rounded-none" />
//                 </div>

//                 <Skeleton className="h-12 w-full rounded-none" />
//               </div>

//               {/* TAGS */}
//               <div className="space-y-3">
//                 <Skeleton className="h-4 w-14 rounded-none" />

//                 <div className="flex gap-2">
//                   <Skeleton className="h-8 w-20 rounded-none" />
//                   <Skeleton className="h-8 w-24 rounded-none" />
//                 </div>

//                 <Skeleton className="h-12 w-full rounded-none" />
//               </div>

//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }