import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50">
        <Search className="h-10 w-10 text-slate-400" />
      </div>
      <h1 className="mb-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
        The page you are looking for might have been moved, deleted, or never
        existed.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          variant="default"
          className="h-12 rounded-xl px-8 font-bold"
        >
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Back to Safety
          </Link>
        </Button>
      </div>
    </div>
  );
}
