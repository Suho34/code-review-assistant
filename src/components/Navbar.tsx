"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-275 items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-foreground">
            MockMind
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 sm:flex">
          {isPending ? (
            <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
          ) : session ? (
            <>
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  History
                </Link>
              </div>
              <div className="h-4 w-px bg-border" />
              <button
                onClick={handleSignOut}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Button
                asChild
                size="sm"
                className="h-8 rounded-md px-4 font-medium"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-muted-foreground transition-colors hover:text-foreground sm:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-subtle bg-background px-6 py-6 sm:hidden">
          <div className="flex flex-col gap-6">
            {isPending ? (
              <div className="h-10 animate-pulse rounded bg-secondary" />
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  History
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-left text-sm font-medium text-red-500/80"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  Log in
                </Link>
                <Button asChild className="w-full">
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
