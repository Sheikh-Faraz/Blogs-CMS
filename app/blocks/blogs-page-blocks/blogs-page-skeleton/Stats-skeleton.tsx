import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent } from "@/components/ui/card";

export default function StatsSkeleton() {
  return (
<div className="flex gap-4 my-6 px-4">
  {[1,2,3,4].map((i) => (
    <Card key={i} className="w-full rounded-xl">
      <CardContent className="p-4">
        {/* Label */}
        <Skeleton className="h-6 w-24 mb-4" />

        {/* Value + Icon */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="size-5 rounded-md" />
        </div>
      </CardContent>
    </Card>
  ))}
</div>
  );
}