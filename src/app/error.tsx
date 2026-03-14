"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/10">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
        We encountered an unexpected error. Don&apos;t worry, your data is safe.
        Try refreshing the page or head back to the dashboard.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={reset}
          variant="default"
          className="h-12 rounded-xl px-8 font-bold"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-xl px-8 font-bold"
        >
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
