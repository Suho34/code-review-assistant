import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Target, TrendingUp, BarChart3 } from "lucide-react";
import StatsOverview from "@/components/dashboard/StatsOverview";
import QuickStart from "@/components/dashboard/QuickStart";
import SessionCard from "@/components/dashboard/SessionCard";
import PerformanceRadar from "@/components/dashboard/PerformanceRadar";
import ScoreTrend from "@/components/dashboard/ScoreTrend";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your interview performance, stats, and recent activity.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold">Please sign in</h2>
        <p className="mt-2 text-slate-500">
          You need to be authenticated to view your dashboard.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: user.id },
    include: { feedback: true },
    orderBy: { createdAt: "desc" },
  });

  const recentSessions = sessions.slice(0, 3);
  const completedSessions = sessions.filter(
    (s) => s.status === "completed" && s.score !== null,
  );

  // Prepare Trend Data (Last 5 completed)
  const trendData = completedSessions.slice(0, 5).map((s) => ({
    date: new Date(s.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: s.score || 0,
  }));

  // Prepare Radar Data (Average of latest completed sessions)
  const feedbackSessions = completedSessions
    .filter((s) => s.feedback)
    .slice(0, 5);
  const radarData =
    feedbackSessions.length > 0
      ? {
          clarity:
            feedbackSessions.reduce(
              (acc, s) => acc + (s.feedback?.clarity || 0),
              0,
            ) / feedbackSessions.length,
          depth:
            feedbackSessions.reduce(
              (acc, s) => acc + (s.feedback?.depth || 0),
              0,
            ) / feedbackSessions.length,
          communication:
            feedbackSessions.reduce(
              (acc, s) => acc + (s.feedback?.communication || 0),
              0,
            ) / feedbackSessions.length,
          technicalAccuracy:
            feedbackSessions.reduce(
              (acc, s) => acc + (s.feedback?.technicalAccuracy || 0),
              0,
            ) / feedbackSessions.length,
        }
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-275">
          {/* Header Section */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground">
                Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground font-medium">
                Welcome back, {user?.name?.split(" ")[0] || "Developer"}.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">
              {/* Stats Overview */}
              <section>
                <div className="font-mono mb-6">OVERVIEW</div>
                <ErrorBoundary>
                  <StatsOverview sessions={sessions} />
                </ErrorBoundary>
              </section>

              {/* Analytics Section */}
              <section className="grid gap-6 md:grid-cols-2">
                <Card className="bg-surface border-border p-6 rounded-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="font-mono">PERFORMANCE</div>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <ErrorBoundary>
                    <PerformanceRadar data={radarData} />
                  </ErrorBoundary>
                  <p className="mt-4 text-center font-mono text-[10px]">
                    LATEST {feedbackSessions.length} SESSIONS
                  </p>
                </Card>

                <Card className="bg-surface border-border p-6 rounded-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="font-mono">SCORE TREND</div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <ErrorBoundary>
                    <ScoreTrend data={trendData} />
                  </ErrorBoundary>
                  <p className="mt-4 text-center font-mono text-[10px]">
                    TRENDING SESSIONS
                  </p>
                </Card>
              </section>

              {/* Quick Start Section */}
              <section>
                <div className="font-mono mb-6">START NEW SESSION</div>
                <ErrorBoundary>
                  <QuickStart />
                </ErrorBoundary>
              </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-12">
              <section>
                <div className="font-mono mb-6">RECENT ACTIVITY</div>
                <div className="space-y-px rounded-xl border border-border bg-surface overflow-hidden">
                  {sessions.length > 0 ? (
                    recentSessions.map((s, i) => (
                      <div
                        key={s.id}
                        className={i !== 0 ? "border-t border-subtle" : ""}
                      >
                        <SessionCard session={s} compact />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BarChart3 className="h-8 w-8 text-muted" />
                      <div className="font-mono mt-4">NO ACTIVITY</div>
                    </div>
                  )}
                </div>
                {sessions.length > 0 && (
                  <Link
                    href="/history"
                    className="mt-4 block font-mono text-[10px] hover:text-foreground transition-colors"
                  >
                    VIEW FULL HISTORY →
                  </Link>
                )}
              </section>

              {/* Tip */}
              <Card className="bg-secondary/40 border-border p-8 rounded-xl">
                <h4 className="font-bold text-foreground">Pro Tip</h4>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Focus on the{" "}
                  <span className="text-foreground">STAR method</span> in your
                  behavioral responses to maximize your depth score.
                </p>
                <Button variant="outline" className="mt-6 w-full border-subtle">
                  Learn more
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
