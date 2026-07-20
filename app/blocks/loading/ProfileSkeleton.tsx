import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-8 m-4">
      {/* Banner */}
      <Skeleton className="h-72 w-full rounded-xl" />

      {/* Profile Header */}
      <div className="relative px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          {/* Avatar */}
          <Skeleton className="h-36 w-36 rounded-full border-4 border-background -mt-20" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80" />

            <div className="flex gap-2 pt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-10 rounded-full"
                />
              ))}
            </div>
          </div>

          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 rounded-xl"
          />
        ))}
      </div>

      {/* About */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-44" />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-14 rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Social Cards */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-xl" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <Skeleton className="h-10 w-full rounded-md" />

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>

                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}