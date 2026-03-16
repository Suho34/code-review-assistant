import { Star, BrainCircuit, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { INTERVIEW_TYPE_LABELS } from "@/lib/constants";

interface SessionCardProps {
  session?: {
    id: string;
    type: string;
    status: string;
    score: number | null;
    createdAt: Date | string;
  };
  loading?: boolean;
  compact?: boolean;
}

const getScoreConfig = (score: number | null, isCompleted: boolean) => {
  if (score === null || !isCompleted) {
    return {
      label: "—",
      textColor: "text-muted-foreground",
      badgeBg: "bg-[#1a1a1a]",
      badgeBorder: "border-[#2a2a2a]",
      badgeText: "text-muted-foreground",
      bar: "bg-[#2a2a2a]",
      barWidth: "0%",
    };
  }
  if (score >= 7)
    return {
      label: score.toFixed(1),
      textColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/20",
      badgeText: "text-emerald-400",
      bar: "bg-emerald-500",
      barWidth: `${(score / 10) * 100}%`,
    };
  if (score >= 5)
    return {
      label: score.toFixed(1),
      textColor: "text-amber-400",
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/20",
      badgeText: "text-amber-400",
      bar: "bg-amber-500",
      barWidth: `${(score / 10) * 100}%`,
    };
  return {
    label: score.toFixed(1),
    textColor: "text-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/20",
    badgeText: "text-rose-400",
    bar: "bg-rose-500",
    barWidth: `${(score / 10) * 100}%`,
  };
};

export default function SessionCard({
  session,
  loading,
  compact,
}: SessionCardProps) {
  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={`animate-pulse border-b border-[#1a1a1a] bg-[#0a0a0a] p-4 ${
          compact ? "" : "sm:p-6"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-[#1a1a1a]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-24 rounded bg-[#1a1a1a]" />
            <div className="h-2.5 w-32 rounded bg-[#1a1a1a]" />
          </div>
          <div className="h-6 w-12 rounded bg-[#1a1a1a]" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  // ── Derived values ────────────────────────────────────────────────
  const typeLabel =
    (INTERVIEW_TYPE_LABELS as any)[session.type] || session.type;
  const isCompleted = session.status === "completed";
  const score = session.score;
  const scoreConfig = getScoreConfig(score, isCompleted);

  const dateStr = new Date(session.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: compact ? undefined : "numeric",
  });

  // ── Compact mode ──────────────────────────────────────────────────
  if (compact) {
    return (
      <Link
        href={`/session/${session.id}`}
        className="group flex items-center justify-between border-b border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 transition-colors hover:bg-[#111111]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-[#666666] transition-colors group-hover:border-[#3a3a3a] group-hover:text-[#ededed]">
            {isCompleted ? (
              <Star className="h-3.5 w-3.5" />
            ) : (
              <BrainCircuit className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#ededed] capitalize">
              {session.type}
            </span>
            <span className="font-mono text-[10px] text-[#444444] uppercase tracking-widest mt-0.5">
              {dateStr}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${scoreConfig.badgeBg} ${scoreConfig.badgeBorder} ${scoreConfig.badgeText}`}
          >
            {scoreConfig.label}
          </span>
          <ChevronRight className="h-4 w-4 text-[#444444] transition-transform group-hover:translate-x-1 group-hover:text-[#ededed]" />
        </div>
      </Link>
    );
  }

  // ── Full card ─────────────────────────────────────────────────────
  return (
    <Link
      href={`/session/${session.id}`}
      className="group flex flex-col gap-4 border-b border-[#1a1a1a] bg-[#0a0a0a] p-6 transition-colors hover:bg-[#111111] sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left — icon + info */}
      <div className="flex items-center gap-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-[#666666] transition-colors group-hover:border-[#3a3a3a] group-hover:text-[#ededed]">
          {isCompleted ? (
            <Star className="h-4 w-4" />
          ) : (
            <BrainCircuit className="h-4 w-4" />
          )}
        </div>

        <div>
          <h3 className="text-base font-medium text-[#ededed] capitalize tracking-tight">
            {typeLabel}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#444444] uppercase tracking-widest">
              <Calendar className="h-3 w-3" />
              {dateStr}
            </span>

            {/* Status badge */}
            <span
              className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded ${
                isCompleted
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-400"
              }`}
            >
              {session.status === "in_progress"
                ? "IN PROGRESS"
                : session.status}
            </span>
          </div>
        </div>
      </div>

      {/* Right — score */}
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] text-[#444444] uppercase tracking-widest mb-1">
            SCORE
          </p>
          <p className={`text-xl font-bold ${scoreConfig.textColor}`}>
            {scoreConfig.label}
          </p>

          {/* Mini score bar — only when score exists */}
          {score !== null && isCompleted && (
            <div className="mt-2 h-0.5 w-16 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${scoreConfig.bar}`}
                style={{ width: scoreConfig.barWidth }}
              />
            </div>
          )}
        </div>

        <ChevronRight className="h-4 w-4 text-[#444444] transition-transform group-hover:translate-x-1 group-hover:text-[#ededed]" />
      </div>
    </Link>
  );
}
