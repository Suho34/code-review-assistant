"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 text-center antialiased">
        <h1 className="mb-4 text-4xl font-black text-slate-900">Critical Error</h1>
        <p className="mb-8 text-slate-500">
          The application has encountered a critical failure.
        </p>
        <Button
          onClick={() => reset()}
          size="lg"
          className="h-14 rounded-2xl px-10 font-bold shadow-xl shadow-primary/20"
        >
          Restart Application
        </Button>
      </body>
    </html>
  );
}
