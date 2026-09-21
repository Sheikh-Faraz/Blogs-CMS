import { Skeleton } from "@/components/ui/skeleton";

export default function BlogTableSkeleton() {
  return (
    <div className="m-4 overflow-x-auto rounded-md border">
      <table className="w-full min-w-175 text-sm">
        {/* Header Skeleton */}
        <thead className="bg-muted/40">
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i} className="p-3 text-left sm:p-4">
                <Skeleton className="h-4 w-20 sm:w-24" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Rows Skeleton */}
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-t">
              {/* Post Details */}
              <td className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-none sm:h-12 sm:w-12" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 sm:w-40" />
                    <Skeleton className="h-3 w-24 sm:w-28" />
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="p-3 sm:p-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>

              {/* Status */}
              <td className="p-3 sm:p-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </td>

              {/* Created */}
              <td className="p-3 sm:p-4">
                <Skeleton className="h-4 w-20 sm:w-24" />
              </td>

              {/* Actions */}
              <td className="p-3 sm:p-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// import { Skeleton } from "@/components/ui/skeleton";

// export default function BlogTableSkeleton() {
//   return (
//     <div className="border overflow-hidden m-4">
//       <table className="w-full text-sm">

//         {/* 🔥 HEADER SKELETON */}
//         <thead className="bg-muted/40">
//           <tr>
//             {Array.from({ length: 5 }).map((_, i) => (
//               <th key={i} className="p-4">
//                 <Skeleton className="h-4 w-24" />
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* 🔥 ROWS SKELETON */}
//         <tbody>
//           {Array.from({ length: 5 }).map((_, i) => (
//             <tr key={i} className="border-t">

//               {/* Post Details */}
//               <td className="p-4">
//                 <div className="flex items-center gap-3">
//                   <Skeleton className="w-12 h-12 rounded-none" />
//                   <div className="space-y-2">
//                     <Skeleton className="h-4 w-40" />
//                     <Skeleton className="h-3 w-28" />
//                   </div>
//                 </div>
//               </td>

//               {/* Category */}
//               <td className="p-4">
//                 <Skeleton className="h-6 w-20 rounded-full" />
//               </td>

//               {/* Status */}
//               <td className="p-4">
//                 <Skeleton className="h-6 w-24 rounded-full" />
//               </td>

//               {/* Created */}
//               <td className="p-4">
//                 <Skeleton className="h-4 w-24" />
//               </td>

//               {/* Actions */}
//               <td className="p-4">
//                 <div className="flex justify-end gap-2">
//                   <Skeleton className="h-8 w-8 rounded-md" />
//                   <Skeleton className="h-8 w-8 rounded-md" />
//                 </div>
//               </td>

//             </tr>
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }