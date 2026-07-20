import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
<div className="flex justify-between items-center p-4">
  <div className="space-y-3">
    <Skeleton className="h-8 w-80" />
    <Skeleton className="h-4 w-72" />
  </div>

  <div className="flex gap-2">
    <Skeleton className="h-10 w-72 rounded-md" />
    <Skeleton className="h-10 w-24 rounded-md" />
  </div>
</div>
  );
}