export default function TeamSkeleton() {
  return (
    <div className="space-y-5 py-5" aria-label="Loading team members">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex min-h-20 items-center gap-3 border-b py-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-48 max-w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="hidden h-9 w-28 animate-pulse rounded-md bg-muted sm:block" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
        </div>
      ))}
    </div>
  );
}
