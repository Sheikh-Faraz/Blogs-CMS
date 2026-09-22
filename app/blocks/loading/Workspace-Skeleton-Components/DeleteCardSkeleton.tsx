
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DeleteCardSkeleton() {
  return (
    <div>
      {/* Danger Zone */}
      <div className="my-4 sm:my-6">
        <div className="relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-md">
          <div className="relative p-4 sm:p-5">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                {/* Warning Icon */}
                <Skeleton className="h-4 w-4 shrink-0 rounded-full sm:h-4.5 sm:w-4.5" />

                {/* Danger Zone */}
                <Skeleton className="h-5 w-28 rounded-md sm:h-6 sm:w-32" />
              </div>
            </div>

            {/* Divider */}
            <Skeleton className="mb-4 h-px w-full" />

            {/* Content + Delete Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Text */}
              <div className="min-w-0">
                {/* Delete Workspace */}
                <Skeleton className="h-5 w-36 max-w-full rounded-md sm:w-40" />

                {/* Confirmation text */}
                <Skeleton className="my-2 h-3 w-52 max-w-full rounded-md sm:w-64" />
              </div>

              {/* Delete Button */}
              <Skeleton className="h-9 w-full shrink-0 rounded-md sm:w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Skeleton } from "@/components/ui/skeleton";

// export default function DeleteCardSkeleton() {
//   return (
//     <div>
//       {/* ─────────────────────────────────────────────────────────────
//           Danger Zone
//       ───────────────────────────────────────────────────────────── */}
//       <div className="my-6">
//         <div className="relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm">

//           <div className="relative p-5">

//             {/* Header */}
//             <div className="mb-3">
//               <div className="flex gap-2 items-center">

//                 {/* Warning Icon */}
//                 <Skeleton className="h-[18px] w-[18px] rounded-full" />

//                 {/* Danger Zone */}
//                 <Skeleton className="h-6 w-32 rounded-md" />

//               </div>
//             </div>


//             {/* Divider */}
//             <Skeleton className="h-px w-full mb-4" />


//             {/* Content + Delete Button */}
//             <div className="leading-relaxed flex justify-between items-center gap-4">

//               {/* Text */}
//               <div>
//                 {/* Delete Workspace */}
//                 <Skeleton className="h-5 w-40 rounded-md" />

//                 {/* Confirmation text */}
//                 <Skeleton className="h-3 w-64 rounded-md my-2" />
//               </div>

//               {/* Delete Button */}
//               <Skeleton className="h-9 w-32 rounded-md shrink-0" />

//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }