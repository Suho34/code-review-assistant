"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signInError } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-12 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email-address"
                className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground ml-1"
              >
                Email Address
              </label>
              <Input
                id="email-address"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                {...form.register("email")}
                placeholder="name@example.com"
                className="h-11 bg-background/50 border-subtle focus:ring-primary/20"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-destructive font-medium ml-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="password"
                  className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground"
                >
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                {...form.register("password")}
                placeholder="••••••••"
                className="h-11 bg-background/50 border-subtle focus:ring-primary/20"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-destructive font-medium ml-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 font-bold text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-card px-4 text-muted-foreground/50">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              signIn.social({ provider: "google", callbackURL: "/dashboard" })
            }
            disabled={isLoading}
            className="w-full h-11 border-subtle hover:bg-secondary font-semibold"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
