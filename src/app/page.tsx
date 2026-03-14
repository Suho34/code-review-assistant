import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  Code2,
  BrainCircuit,
  Zap,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MockMind — Master Tech Interviews with AI",
  description:
    "Real-time, AI-driven behavioral and technical mock interviews with actionable feedback and detailed scoring.",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              MockMind
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href={session ? "/dashboard" : "/register"}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
              {session ? "Enter App" : "Get Started"}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
              Pragmatic AI <br />
              <span className="text-primary">interview prep</span> for devs
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              No stress. No generic feedback. Just a dedicated AI interviewer
              ready to challenge your technical and behavioral skills today.
              Master your craft and rapidly iterate your way to a dream job.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary px-10 text-base font-bold text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                {session ? "Enter Dashboard" : "Book Your First Session"}
              </Link>
              <Link
                href="#how-it-works"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-10 text-base font-bold text-foreground transition-all hover:bg-muted/50 sm:w-auto"
              >
                Learn How it Works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50 sm:gap-12 lg:mt-24">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Trusted by devs at</span>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {/* Placeholder logos for aesthetic matches */}
                <div className="font-black text-lg tracking-tighter">ENROLY</div>
                <div className="font-black text-lg tracking-tighter">RICOCHET</div>
                <div className="font-black text-lg tracking-tighter">REFERA</div>
                <div className="font-black text-lg tracking-tighter">HIGHPOINT</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Content */}
        <section id="features" className="border-t border-border/40 bg-muted/20 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  title: "DSA Performance",
                  description:
                    "Deep analysis of your time and space complexity with hints that don't spoil the solution.",
                  icon: Code2,
                },
                {
                  title: "Behavioral Mastery",
                  description:
                    "STAR method training with an AI that asks critical follow-ups based on your specific stories.",
                  icon: Zap,
                },
                {
                  title: "Verifiable Scoring",
                  description:
                    "Professional-grade rubrics used by top tier tech firms, giving you a clear path to improvement.",
                  icon: ShieldCheck,
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Minimalist Timeline */}
        <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three steps to interview mastery
            </h2>
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Pick Your Track",
                  description:
                    "Select behavioral, system design, or coding. Choose your difficulty level.",
                },
                {
                  step: "02",
                  title: "Practice in Real-time",
                  description:
                    "Engage in a live, interactive session with our AI interviewer.",
                },
                {
                  step: "03",
                  title: "Review & Improve",
                  description:
                    "Read your detailed transcript analysis and actionable scoring.",
                },
              ].map((item, idx) => (
                <div key={idx} className="group relative">
                  <div className="mb-6 text-4xl font-black text-muted/50 transition-colors group-hover:text-primary/20">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl rounded-3xl bg-foreground px-6 py-16 text-center text-background sm:px-12 sm:py-20">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to nail your next offer?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Join the developers using MockMind to iterate faster and interview with confidence.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-base font-bold text-white hover:bg-primary/90 transition-all"
              >
                {session ? "Enter Dashboard" : "Start Practicing Now"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-foreground">
                MockMind
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MockMind. Crafted for interview mastery.
            </p>
            <div className="flex gap-8">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="https://github.com"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
