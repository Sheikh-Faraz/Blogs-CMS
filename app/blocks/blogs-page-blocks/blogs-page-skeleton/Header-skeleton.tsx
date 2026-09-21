import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title + description */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 sm:w-64 md:w-80" />
        <Skeleton className="h-4 w-40 sm:w-56 md:w-72" />
      </div>

      {/* Actions */}
      <div className="flex w-full gap-2 sm:w-auto">
        <Skeleton className="h-10 flex-1 rounded-md sm:w-56 sm:flex-none md:w-72" />
        <Skeleton className="h-10 w-20 rounded-md sm:w-24" />
      </div>
    </div>
  );
}

// import { Skeleton } from "@/components/ui/skeleton";

// export default function HeaderSkeleton() {
//   return (
// <div className="flex justify-between items-center p-4">
//   <div className="space-y-3">
//     <Skeleton className="h-8 w-80" />
//     <Skeleton className="h-4 w-72" />
//   </div>

//   <div className="flex gap-2">
//     <Skeleton className="h-10 w-72 rounded-md" />
//     <Skeleton className="h-10 w-24 rounded-md" />
//   </div>
// </div>
//   );
// }