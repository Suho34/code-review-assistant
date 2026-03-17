import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FeedbackPanel } from "@/components/interview/FeedbackPanel";
import { INTERVIEW_TYPE_LABELS } from "@/lib/constants";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Loader2 as Spinner } from "lucide-react";
import { CopyTranscriptButton } from "@/components/interview/CopyTranscriptButton";

export default async function SessionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) {
    redirect("/login");
  }

  const { id } = await params;

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      feedback: true,
    },
  });

  if (!interviewSession || interviewSession.userId !== sessionData.user.id) {
    notFound();
  }

  const label =
    (INTERVIEW_TYPE_LABELS as any)[interviewSession.type] ||
    interviewSession.type;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-6">
        <div className="mx-auto max-w-[1100px] space-y-16">
          {/* Header */}
          <div>
            <Link
              href="/dashboard"
              className="group mb-4 inline-flex items-center font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              BACK TO DASHBOARD
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
                  {label} Results
                </h1>
                <p className="mt-1 text-muted-foreground font-medium">
                  •{" "}
                  {interviewSession.completedAt?.toLocaleDateString() ||
                    interviewSession.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Button asChild className="h-10 px-6 font-medium">
                <Link href="/dashboard">
                  <Plus className="mr-2 h-4 w-4" />
                  New Interview
                </Link>
              </Button>
            </div>
          </div>

          {/* Feedback Section */}
          <section className="space-y-6">
            <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
              ANALYSIS & FEEDBACK
            </div>
            {interviewSession.feedback ? (
              <FeedbackPanel feedback={interviewSession.feedback as any} />
            ) : (
              <div className="border border-border bg-surface rounded-xl p-16 text-center">
                <Spinner className="h-6 w-6 mx-auto text-muted-foreground mb-4" />
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  GENERATING REPORT...
                </p>
              </div>
            )}
          </section>

          {/* Transcript Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                INTERVIEW TRANSCRIPT
              </div>
              <CopyTranscriptButton
                messages={interviewSession.messages.map((m) => ({
                  role: m.role,
                  content: m.content,
                }))}
              />
            </div>
            <div className="border border-border bg-surface rounded-xl overflow-hidden divide-y divide-subtle">
              {interviewSession.messages.map((message, idx) => {
                if (idx === 0 && message.role === "user") return null;
                const isAssistant = message.role === "assistant";

                return (
                  <div key={message.id} className="p-8 flex gap-8">
                    <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground w-20 shrink-0 pt-1">
                      {isAssistant ? "AI" : "YOU"}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-base leading-[1.6] ${isAssistant ? "text-foreground" : "text-muted-foreground"} font-medium max-w-[800px]`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="pt-8 flex justify-center border-t border-subtle">
            <Button
              asChild
              variant="outline"
              className="h-10 px-8 border-subtle"
            >
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-subtle py-12 px-6">
        <div className="mx-auto max-w-[1100px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
            © {new Date().getFullYear()} MOCKMIND
          </div>
          <div className="flex gap-8">
            <Link
              href="#"
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
