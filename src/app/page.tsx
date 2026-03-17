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
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MockMind — Master Tech Interviews with AI",
  description:
    "Real-time, AI-driven behavioral and technical mock interviews with actionable feedback and detailed scoring.",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 pt-[180px] pb-32">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[800px]">
              <h1 className="text-7xl font-extrabold tracking-[-0.04em] text-foreground sm:text-8xl leading-[0.9]">
                MockMind. <br />
                <span className="text-muted-foreground">The AI interview <br />partner for engineers.</span>
              </h1>

              <p className="mt-12 max-w-[500px] text-lg leading-relaxed text-muted-foreground">
                High-fidelity behavioral and technical interview practice.
                Actionable feedback, STAR method training, and data-driven scoring.
              </p>

              <div className="mt-12 flex items-center gap-4">
                <Button asChild size="lg" className="h-12 rounded-lg px-8 font-medium">
                  <Link href={session ? "/dashboard" : "/register"}>
                    {session ? "Enter App" : "Start Practicing"}
                  </Link>
                </Button>
                <Link
                  href="#features"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2 group"
                >
                  Learn how it works
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="mt-24 flex items-center gap-12 grayscale">
              <span className="font-mono text-[11px]">Used by devs at</span>
              <div className="flex flex-wrap gap-8 opacity-40">
                <div className="font-bold tracking-tighter">ENROLY</div>
                <div className="font-bold tracking-tighter">REFERA</div>
                <div className="font-bold tracking-tighter">HIGHPOINT</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-32 border-t border-subtle">
          <div className="mx-auto max-w-[1100px]">
            <div className="grid gap-16 md:grid-cols-3">
              {[
                {
                  title: "DSA PERFORMANCE",
                  description: "Real-time complexity analysis with intelligent hints. No generic answers.",
                },
                {
                  title: "BEHAVIORAL MASTERY",
                  description: "STAR method training with AI that understands context and asks deep follow-ups.",
                },
                {
                  title: "DATA-DRIVEN SCORING",
                  description: "Professional rubrics used by high-performance engineering teams.",
                },
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="font-mono">{f.title}</div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground">{f.description}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="px-6 py-32 border-t border-subtle bg-surface">
          <div className="mx-auto max-w-[1100px]">
            <div className="grid gap-24 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Built for the <br /> modern engineer.
                </h2>
                <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
                  MockMind isn't a chatbot. It's a high-fidelity simulator that recreates the technical and social pressures of a real interview.
                </p>
              </div>
              <div className="grid gap-12">
                {[
                  "Choose behavioral or technical tracks",
                  "AI detects technical depth and clarity",
                  "Receive scoring on specific STAR metrics"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-bold group-hover:border-primary transition-colors">
                      {i + 1}
                    </div>
                    <span className="text-lg font-medium tracking-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-32 border-t border-subtle">
          <div className="mx-auto max-w-[1100px] text-center">
            <h2 className="text-5xl font-bold tracking-tight">Nail the offer.</h2>
            <p className="mt-8 mx-auto max-w-[500px] text-lg text-muted-foreground">
              Master your story and your craft. Join MockMind today.
            </p>
            <div className="mt-12">
              <Button asChild size="lg" className="h-14 rounded-lg px-12 text-base font-bold">
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-subtle">
        <div className="mx-auto max-w-[1100px] flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="font-mono font-bold text-foreground">MockMind</div>
          <div className="flex gap-8">
            <Link href="#" className="font-mono hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="font-mono hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="font-mono hover:text-foreground transition-colors">Privacy</Link>
          </div>
          <div className="font-mono opacity-40">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}
