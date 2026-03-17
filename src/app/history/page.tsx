import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import SessionCard from "@/components/dashboard/SessionCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description: "Review your past interview performances and track your progress.",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-slate-500">Please sign in to view your history.</p>
      </div>
    );
  }

  const { page: pageStr, type } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || "1"));
  const currentType = type || "all";
  const pageSize = 10;

  const where = {
    userId: user.id,
    ...(currentType !== "all" ? { type: currentType } : {}),
  };

  const [sessions, totalCount] = await Promise.all([
    prisma.interviewSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.interviewSession.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const filterTabs = [
    { id: "all", label: "All Sessions" },
    { id: "dsa", label: "DSA" },
    { id: "behavioral", label: "Behavioral" },
    { id: "system-design", label: "System Design" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/dashboard"
              className="group mb-4 inline-flex items-center font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              BACK TO DASHBOARD
            </Link>
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground">
              History
            </h1>
            <p className="mt-1 text-muted-foreground font-medium">
              Review and track your progress over time.
            </p>
          </div>

          {/* Filters and Stats */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {filterTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/history?type=${tab.id}&page=1`}
                  className={`whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-medium transition-all ${currentType === tab.id
                      ? "bg-foreground text-background"
                      : "bg-surface text-muted-foreground border border-border hover:border-muted-foreground/30 hover:text-foreground"
                    }`}
                >
                  {tab.label.toUpperCase()}
                </Link>
              ))}
            </div>

            <div className="font-mono text-[10px] text-muted-foreground">
              SHOWING {sessions.length} OF {totalCount} SESSIONS
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-px rounded-xl border border-border bg-surface overflow-hidden">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search className="h-8 w-8 text-muted" />
                <div className="font-mono mt-4">NO SESSIONS FOUND</div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">
                  Try adjusting filters or start a new interview.
                </p>
                <Button asChild variant="outline" className="mt-8 border-subtle">
                  <Link href="/dashboard">Start Interview</Link>
                </Button>
              </div>
            ) : (
              sessions.map((s, i) => (
                <div key={s.id} className={i !== 0 ? "border-t border-subtle" : ""}>
                  <SessionCard session={s} />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                asChild
                className={`h-10 w-10 border-subtle rounded-lg ${currentPage <= 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                <Link href={`/history?type=${currentType}&page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>

              <div className="flex h-10 items-center rounded-lg border border-subtle bg-surface px-4 font-mono text-[11px]">
                <span className="text-foreground">{currentPage}</span>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-muted-foreground">{totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                asChild
                className={`h-10 w-10 border-subtle rounded-lg ${currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}`}
              >
                <Link href={`/history?type=${currentType}&page=${currentPage + 1}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
