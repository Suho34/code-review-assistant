import { Code2, User, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";

const TRACKS = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master logic and efficiency with complex coding challenges.",
    icon: Code2,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "behavioral",
    title: "Behavioral",
    description: "Perfect your storytelling using the STAR method.",
    icon: User,
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn to build scalable, reliable distributed systems.",
    icon: Layout,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function QuickStart() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {TRACKS.map((track) => (
        <Link
          key={track.id}
          href={`/interview/${track.id}`}
          className="group relative flex flex-col bg-surface p-8 transition-all hover:bg-elevated"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:border-foreground group-hover:text-foreground mb-6">
            <track.icon className="h-6 w-6" />
          </div>

          <h3 className="mb-2 text-lg font-medium text-foreground">
            {track.title}
          </h3>

          <p className="mb-8 text-sm leading-relaxed text-muted-foreground font-medium">
            {track.description}
          </p>

          <div className="mt-auto flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
            START SESSION
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
