"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatInterface from "@/components/interview/ChatInterface";
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { INTERVIEW_TYPES, INTERVIEW_TYPE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function DynamicInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as any;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const hasAttempted = useRef(false);

  const createSession = async () => {
    setError(null);
    setIsInitializing(true);
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create interview session");
      }

      const data = await response.json();
      setSessionId(data.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (hasAttempted.current) return;

    if (!INTERVIEW_TYPES.includes(type)) {
      setError(
        `Invalid interview type "${type}". Please select a valid track.`,
      );
      return;
    }

    hasAttempted.current = true;
    createSession();
  }, [type]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full border border-border bg-surface p-12 rounded-xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border text-foreground">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Session failed
          </h2>
          <p className="text-muted-foreground mb-10 font-medium">{error}</p>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => createSession()}
              className="w-full h-11 font-medium"
              disabled={isInitializing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isInitializing ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="w-full h-11 border-subtle"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    const label = (INTERVIEW_TYPE_LABELS as any)[type] || type;
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-8 bg-background">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-lg border border-subtle bg-surface" />
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            PREPARING {label.toUpperCase()} SESSION
          </h2>
          <p className="text-sm text-foreground/40 animate-pulse font-medium">
            Initializing AI interviewer...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden">
      <ChatInterface sessionId={sessionId} interviewType={type} />
    </div>
  );
}
