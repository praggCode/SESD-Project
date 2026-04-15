"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:7069/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Welcome back!", {
        description: "Redirecting you to your dashboard…",
        duration: 3000,
      });
      setTimeout(() => router.push("/"), 900);
    } catch (err) {
      toast.error("Login failed", {
        description: err.message || "Something went wrong. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-xl shadow-black/[0.06] p-0">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* ── Left column: form ─────────────────────────────── */}
          <div className="flex flex-col justify-center px-8 py-12 md:px-10">

            {/* Wordmark */}
            <div className="flex items-center gap-2.5 mb-10">
              <ShieldIcon className="size-6 text-foreground" />
              <span className="text-base font-semibold tracking-tight">Sentinel</span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Login to your Sentinel dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-lg border-border/70 bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/40 transition-shadow"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <a
                    href="#"
                    tabIndex={-1}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg border-border/70 bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/40 transition-shadow"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-10 w-full rounded-lg font-medium text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <SpinnerIcon className="size-4 animate-spin" />
                    Logging in…
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>

            {/* Footer note */}
            <p className="mt-8 text-center text-xs text-muted-foreground/80">
              By continuing, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* ── Right column: decorative panel ───────────────── */}
          <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden rounded-r-2xl bg-[#0f1117] px-10 py-14">
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full bg-indigo-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-violet-500/15 blur-[80px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-7 text-center">
              {/* Shield badge */}
              <div className="flex items-center justify-center size-[72px] rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.12] backdrop-blur-sm shadow-2xl">
                <ShieldCheckIcon className="size-9 text-white/90" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  Secure by design
                </h2>
                <p className="text-sm text-white/50 max-w-[200px] leading-relaxed">
                  Monitor, detect and respond to threats — all from one place.
                </p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5 w-full max-w-[210px] text-left">
                {[
                  "Real-time threat monitoring",
                  "Automated incident response",
                  "End-to-end encryption",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg bg-white/[0.05] ring-1 ring-white/[0.08] px-3.5 py-2.5 text-xs text-white/70"
                  >
                    <CheckIcon className="size-3 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

/* ── Inline SVG icons (no extra dep) ──────────────────────── */

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinnerIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
