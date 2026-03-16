"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ChatInterface({
  sessionId,
  interviewType,
}: {
  sessionId: string;
  interviewType: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isEnding, setIsEnding] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [initError, setInitError] = useState(false);
  const hasStarted = useRef(false);

  const { messages, sendMessage, status } = useChat({
    api: `/api/chat`,
    body: { sessionId, interviewType },
    onError: (err: any) => {
      console.error("Chat error:", err);
      if (messages.length <= 1) setInitError(true);
      toast.error("Failed to send message. Please try again.");
    },
  } as any);
  const isLoading = status === "streaming" || status === "submitted";
  const messageLimitReached = messages.length >= 20;
  const showLimitWarning = messages.length >= 18 && !messageLimitReached;

  // Memoized message parsing
  const processedMessages = useMemo(() => {
    return messages.map((m: any) => ({
      ...m,
      textContent:
        m.parts
          ?.filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("") ?? "",
    }));
  }, [messages]);

  // Auto-start
  const startInterview = async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    setInitError(false);
    try {
      await sendMessage(
        {
          text: `Hi, I am ready to start my ${interviewType} interview. Please ask the first question.`,
        },
        { body: { sessionId, interviewType } },
      );
    } catch (err) {
      hasStarted.current = false; // Reset if it failed
      setInitError(true);
      toast.error("Could not start interview session.");
    }
  };

  useEffect(() => {
    if (!hasStarted.current && messages.length === 0) {
      startInterview();
    }
  }, []);

  // Manual send
  const handleEndInterview = async () => {
    setIsEnding(true);
    setShowEndDialog(false);
    try {
      // 1. Mark session as completed
      const patchRes = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!patchRes.ok) throw new Error("Failed to complete session");

      // 2. Trigger AI analysis
      const feedbackRes = await fetch(`/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (feedbackRes.ok) {
        router.push(`/session/${sessionId}`);
      } else {
        const errorData = await feedbackRes.json().catch(() => ({}));
        console.error(
          "Feedback generation failed:",
          errorData.error || "Unknown error",
          errorData.details || "",
        );
        router.push(`/session/${sessionId}`);
      }
    } catch (err) {
      console.error("End interview error:", err);
      toast.error("Failed to end interview nicely. Please try again.");
      setIsEnding(false);
    }
  };

  if (isEnding) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 animate-glow-pulse rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-surface shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in-up">
            Analyzing Performance
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed animate-fade-in-up animation-delay-2000">
            Our AI is reviewing your responses to generate a detailed feedback
            report. This will only take a moment.
          </p>
        </div>
        <div className="mt-12 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Conversation className="bg-background">
        <ConversationContent
          className="pb-[280px] pt-12 max-w-[1000px] mx-auto px-6"
          aria-live="polite"
        >
          {initError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-foreground">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-2">
                  Connection failed
                </h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                  We couldn&apos;t establish a secure connection to the
                  interviewer.
                </p>
              </div>
              <Button
                onClick={() => startInterview()}
                variant="outline"
                className="border-subtle h-10 px-6"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Retry Connection
              </Button>
            </div>
          ) : processedMessages.length <= 1 &&
            (status === "streaming" || status === "submitted") ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute inset-0 animate-pulse rounded-lg border border-subtle bg-surface" />
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
              <div className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground animate-pulse">
                PREPARING FEEDBACK LOOP
              </div>
            </div>
          ) : (
            processedMessages.map((message: any, index: number) => {
              if (index === 0 && message.role === "user") return null;

              const isAssistant = message.role === "assistant";

              return (
                <Message key={message.id} from={message.role} className="mb-12">
                  <MessageContent className="p-0 bg-transparent border-none shadow-none max-w-none">
                    <div className="flex flex-col gap-3">
                      <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                        {isAssistant ? "MOCKMIND AI" : "CANDIDATE"}
                      </div>
                      {isAssistant ? (
                        <div className="text-lg font-medium leading-[1.6] text-foreground tracking-tight max-w-[650px]">
                          {message.textContent}
                        </div>
                      ) : (
                        <div className="text-lg font-medium leading-[1.6] text-muted-foreground tracking-tight max-w-[650px]">
                          {message.textContent}
                        </div>
                      )}
                    </div>
                  </MessageContent>
                </Message>
              );
            })
          )}
        </ConversationContent>
      </Conversation>

      <div className="fixed bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-subtle p-6 z-50">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
          <PromptInput
            onSubmit={(message: any, event: any) => {
              event?.preventDefault();
              if (message.text && !isLoading && !messageLimitReached) {
                sendMessage(
                  { text: message.text },
                  { body: { sessionId, interviewType } },
                );
                setInput("");
              }
            }}
            inputGroupClassName="!border-white !border-2 !text-white !h-auto"
            className="flex flex-col gap-4"
          >
            <div className="flex items-end gap-4 w-full">
              <div className="flex-1 relative group">
                <PromptInputTextarea
                  value={input}
                  onChange={(e: any) => setInput(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      if (input.trim() && !isLoading && !messageLimitReached) {
                        sendMessage(
                          { text: input },
                          { body: { sessionId, interviewType } },
                        );
                        setInput("");
                      }
                    }
                  }}
                  placeholder={
                    messageLimitReached
                      ? "LIMIT REACHED"
                      : "Type your response..."
                  }
                  disabled={isEnding || messageLimitReached}
                  rows={4}
                  style={{ color: "#ffffff", colorScheme: "dark" }}
                  className="w-full !bg-[#0a0a0a] !border-none !text-[#ffffff] transition-colors rounded-xl p-4 text-lg font-medium !placeholder-white/50 resize-none min-h-[120px] outline-none caret-white"
                />
              </div>
              <div className="flex flex-col items-center gap-4 pb-4">
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest hidden sm:block whitespace-nowrap">
                  CMD + ENTER
                </div>
                <PromptInputSubmit
                  disabled={
                    isLoading ||
                    isEnding ||
                    !input.trim() ||
                    messageLimitReached
                  }
                  className="rounded-lg h-12 w-12 bg-foreground text-background transition-transform active:scale-95 disabled:bg-muted disabled:text-muted-foreground shadow-lg shadow-white/10"
                />
              </div>
            </div>
          </PromptInput>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full text-center">
              {showLimitWarning && (
                <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-amber-500 animate-pulse uppercase tracking-widest">
                  SESSION ENDING SOON ({messages.length}/20)
                </div>
              )}
              {messageLimitReached && (
                <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-red-500 uppercase tracking-widest">
                  MESSAGE LIMIT REACHED
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowEndDialog(true)}
              disabled={isEnding || messages.length <= 1}
              className="h-10 bg-red-100 hover:bg-red-200 border-red-300 text-red-700 font-medium text-xs px-6 rounded-lg"
            >
              End Interview session
            </Button>
          </div>
        </div>

        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <DialogContent className="max-w-md border-border !bg-black p-10 rounded-xl">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                End session?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium pt-2">
                This will finalize the interview and generate your performance
                report. You cannot undo this.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowEndDialog(false)}
                disabled={isEnding}
                className="h-11 font-medium"
              >
                Continue practice
              </Button>
              <Button
                onClick={handleEndInterview}
                disabled={isEnding}
                className="h-11 font-bold px-8"
              >
                {isEnding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Finalize Interview"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
