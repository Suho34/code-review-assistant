import { Skeleton } from "@/components/ui/skeleton";

export default function SessionReviewLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <Skeleton className="h-10 w-64" />
                <Skeleton className="mt-2 h-4 w-48" />
              </div>
              <Skeleton className="h-12 w-48 rounded-xl" />
            </div>
          </div>

          {/* Feedback Section Skeleton */}
          <section className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-80 rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
            </div>
          </section>

          {/* Transcript Section Skeleton */}
          <section className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="border border-border/40 rounded-3xl bg-card overflow-hidden">
              <div className="divide-y divide-border/40">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-8 flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
