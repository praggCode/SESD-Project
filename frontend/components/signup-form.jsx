"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "ADMIN"; 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
      toast.success("Registration successful", {
        description: "Redirecting you to login…",
        duration: 3000,
      });
      setTimeout(() => router.push("/login"), 900);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-xl shadow-black/[0.06] p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 md:px-10">
            <div className="flex items-center gap-2.5 mb-10">
              <ShieldIcon className="size-6 text-foreground" />
              <span className="text-base font-semibold tracking-tight">Sentinel</span>
            </div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign up to access Sentinel dashboard
              </p>
            </div>
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3.5 py-3 text-sm text-destructive">
                <AlertIcon className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-lg border-border/70 bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/40 transition-shadow"
                />
              </div>
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
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg border-border/70 bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/40 transition-shadow"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value="ADMIN"
                  readOnly
                  className="h-10 rounded-lg border-border/70 bg-muted text-sm text-muted-foreground cursor-not-allowed select-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-10 w-full rounded-lg font-medium text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <SpinnerIcon className="size-4 animate-spin" />
                    Signing up…
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <p className="mt-8 text-center text-xs text-muted-foreground/80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
          <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden rounded-r-2xl bg-[#0f1117] px-10 py-14">
            <div className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full bg-indigo-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-violet-500/15 blur-[80px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center gap-7 text-center">
              <div className="flex items-center justify-center size-[72px] rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.12] backdrop-blur-sm shadow-2xl">
                <UserShieldIcon className="size-9 text-white/90" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  Join Sentinel
                </h2>
                <p className="text-sm text-white/50 max-w-[200px] leading-relaxed">
                  Get instant access to real-time security monitoring.
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 w-full max-w-[210px] text-left">
                {[
                  "Unified threat dashboard",
                  "Role-based access control",
                  "Automated alert workflows",
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
function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function UserShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M9 16c0-1.657 1.343-3 3-3s3 1.343 3 3" />
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
function AlertIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
