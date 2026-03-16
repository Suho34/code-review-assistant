import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950/50 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-6 w-64" />
          </div>
          <Skeleton className="hidden h-12 w-12 rounded-full sm:flex" />
        </div>

        {/* Stats Overview Skeleton */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>

        {/* Analytics Section Skeleton */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Start Skeleton */}
            <section>
              <Skeleton className="mb-6 h-8 w-32" />
              <div className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-3xl" />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Recent Activity Skeleton */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800/80 dark:bg-slate-900/50">
              <Skeleton className="mb-6 h-6 w-32" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-2xl" />
                ))}
              </div>
            </section>
            
            <Skeleton className="h-40 rounded-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
