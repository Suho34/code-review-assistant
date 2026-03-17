import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950/50 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-6 w-64" />
          </div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Session List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
