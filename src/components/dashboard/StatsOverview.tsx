import { InterviewSession } from "@prisma/client";

interface StatsOverviewProps {
  sessions: InterviewSession[];
}

export default function StatsOverview({ sessions }: StatsOverviewProps) {
  const totalSessions = sessions.length;

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const averageScore =
    completedSessions.length > 0
      ? (
          completedSessions.reduce((acc, s) => acc + (s.score || 0), 0) /
          completedSessions.length
        ).toFixed(1)
      : "—";

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.createdAt) >= oneWeekAgo,
  ).length;

  const completionRate =
    totalSessions > 0
      ? Math.round((completedSessions.length / totalSessions) * 100) + "%"
      : "—";

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="TOTAL INTERVIEWS" value={totalSessions.toString()} />
      <StatsCard label="AVERAGE SCORE" value={averageScore} />
      <StatsCard
        label="SESSIONS THIS WEEK"
        value={sessionsThisWeek.toString()}
      />
      <StatsCard label="COMPLETION RATE" value={completionRate} />
    </div>
  );
}

function StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-6">
      <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </p>
      <h3 className="mt-4 text-3xl font-bold text-foreground">{value}</h3>
    </div>
  );
}
