"use client";
import {
  CheckCircle2,
  TrendingUp,
  Target,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

interface FeedbackPanelProps {
  feedback: {
    clarity: number;
    depth: number;
    communication: number;
    technicalAccuracy: number;
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const scoreItems = [
    {
      label: "Technical Accuracy",
      value: feedback.technicalAccuracy,
      icon: Target,
    },
    { label: "Depth of Response", value: feedback.depth, icon: TrendingUp },
    {
      label: "Communication",
      value: feedback.communication,
      icon: MessageSquare,
    },
    { label: "Clarity", value: feedback.clarity, icon: CheckCircle2 },
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
      {/* Scores and Summary */}
      <div className="lg:col-span-2 space-y-px">
        <div className="bg-surface p-8 h-full">
          <h4 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-10">
            PERFORMANCE METRICS
          </h4>
          <div className="grid gap-12 sm:grid-cols-2 mb-16">
            {scoreItems.map((item) => (
              <div key={item.label} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    {item.value}%
                  </span>
                </div>
                <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-1000 ease-out"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-subtle">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              EXECUTIVE SUMMARY
            </h4>
            <p className="text-lg font-medium leading-[1.6] text-foreground tracking-tight max-w-[700px]">
              {feedback.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="flex flex-col space-y-px h-full">
        {/* Strengths */}
        <div className="bg-surface p-8 flex-1">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-2 mb-8">
            <CheckCircle2 className="h-3 w-3" />
            STRENGTHS
          </h4>
          <ul className="space-y-4">
            {feedback.strengths.map((s, i) => (
              <li
                key={i}
                className="flex gap-4 text-sm font-medium leading-relaxed text-muted-foreground"
              >
                <span className="text-foreground pt-1">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-surface p-8 flex-1">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-8">
            <Lightbulb className="h-3 w-3" />
            IMPROVEMENTS
          </h4>
          <ul className="space-y-4">
            {feedback.improvements.map((imp, i) => (
              <li
                key={i}
                className="flex gap-4 text-sm font-medium leading-relaxed text-muted-foreground"
              >
                <span className="text-muted-foreground/40 pt-1">•</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
