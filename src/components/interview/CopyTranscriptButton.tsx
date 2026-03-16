"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyTranscriptButtonProps {
  messages: {
    role: string;
    content: string;
  }[];
}

export function CopyTranscriptButton({ messages }: CopyTranscriptButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const transcript = messages
        .filter((m, i) => !(i === 0 && m.role === "user")) // skip trigger
        .map((m) => {
          const role = m.role === "assistant" ? "Interviewer" : "Candidate";
          return `[${role}]: ${m.content}`;
        })
        .join("\n\n");

      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      toast.success("Transcript copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy transcript");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 rounded-xl border-border bg-background"
      onClick={copyToClipboard}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Copy Transcript</span>
        </>
      )}
    </Button>
  );
}
