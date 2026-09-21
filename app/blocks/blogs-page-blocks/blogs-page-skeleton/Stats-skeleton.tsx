import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 my-6 sm:gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="w-full rounded-xl">
          <CardContent className="p-3 sm:p-4">
            {/* Label */}
            <Skeleton className="mb-3 h-5 w-20 sm:mb-4 sm:h-6 sm:w-24" />

            {/* Value + Icon */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-10 w-14 sm:h-12 sm:w-16" />
              <Skeleton className="size-4 rounded-md sm:size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// import { Skeleton } from "@/components/ui/skeleton";

// import { Card, CardContent } from "@/components/ui/card";

// export default function StatsSkeleton() {
//   return (
// <div className="flex gap-4 my-6 px-4">
//   {[1,2,3,4].map((i) => (
//     <Card key={i} className="w-full rounded-xl">
//       <CardContent className="p-4">
//         {/* Label */}
//         <Skeleton className="h-6 w-24 mb-4" />

//         {/* Value + Icon */}
//         <div className="flex items-center gap-3">
//           <Skeleton className="h-12 w-16" />
//           <Skeleton className="size-5 rounded-md" />
//         </div>
//       </CardContent>
//     </Card>
//   ))}
// </div>
//   );
// }