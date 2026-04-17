"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheckIcon,
  ActivityIcon,
  UsersIcon,
  GitBranchIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ZapIcon,
  LayersIcon
} from "lucide-react";
export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      setMounted(true);
    }
  }, [router]);
  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-white/20 w-full flex flex-col justify-between overflow-x-hidden relative">
      <div className="absolute top-0 inset-x-0 h-[600px] w-full opacity-30 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#050505] to-[#050505]" />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-6 py-5 md:px-12 max-w-7xl mx-auto w-full z-10">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-white/10 flex items-center justify-center">
              <ShieldCheckIcon className="size-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white font-mono text-sm">sentinel</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-white hover:bg-neutral-200 text-black rounded px-4 py-1.5 text-sm font-medium transition-colors"
            >
              Start for free
            </button>
          </div>
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-start text-left">
            <h1 className="text-[2.5rem] md:text-5xl lg:text-[4rem] font-semibold tracking-tight text-white mb-4 leading-[1.05]">
              Know about incidents before users do.
            </h1>
            <p className="text-lg text-white/80 max-w-lg mb-8 leading-snug">
              Sentinel routes alerts to the right team, tracks every incident, and ensures nothing critical is missed.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push("/signup")}
                className="h-10 w-full sm:w-auto rounded-md px-6 text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push(localStorage.getItem('token') ? '/dashboard' : '/login')}
                className="h-10 w-full sm:w-auto rounded-md px-6 text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] group perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 blur-[80px] -z-10 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 transition-all duration-700 opacity-60" />
            <div
              className="absolute inset-0 flex flex-col rounded-xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-2 lg:group-hover:translate-x-2 group-hover:shadow-[0_20px_40px_-20px_rgba(56,189,248,0.15)] ring-1 ring-white/5"
              style={{ maskImage: "linear-gradient(to right, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 70%, transparent 100%)" }}
            >
              <div className="h-10 border-b border-white/5 bg-[#050505]/50 flex items-center px-5 gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-white/20" />
                  <div className="size-2.5 rounded-full bg-white/10" />
                  <div className="size-2.5 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="font-semibold tracking-tight text-sm text-white flex items-center gap-2">
                    <ActivityIcon className="size-4 text-white/50" />
                    Incoming Signals
                  </div>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#000000]/50 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.08] text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                    <div className="col-span-6">Alert Trace</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-3">Severity</div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] text-sm items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-6 font-mono text-[13px] text-white/90 truncate pr-4">payment-gateway-timeout</div>
                    <div className="col-span-3 flex"><span className="px-2.5 py-1 rounded-sm text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RESOLVED</span></div>
                    <div className="col-span-3 flex items-center gap-1.5 text-[13px] font-medium text-rose-400"><AlertCircleIcon className="size-3.5" /> Critical</div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/[0.04] text-sm items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-6 font-mono text-[13px] text-white/90 truncate pr-4">auth-service-500</div>
                    <div className="col-span-3 flex"><span className="px-2.5 py-1 rounded-sm text-[10px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">ACKNOWLEDGED</span></div>
                    <div className="col-span-3 flex items-center gap-1.5 text-[13px] font-medium text-amber-400"><ActivityIcon className="size-3.5" /> High</div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-6 font-mono text-[13px] text-white/90 truncate pr-4">redis-memory-warning</div>
                    <div className="col-span-3 flex"><span className="px-2.5 py-1 rounded-sm text-[10px] font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">TRIGGERED</span></div>
                    <div className="col-span-3 flex items-center gap-1.5 text-[13px] font-medium text-white/50"><ActivityIcon className="size-3.5" /> Low</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <section className="border-y border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <h3 className="text-white/40 text-[13px] font-medium uppercase tracking-widest">Built for modern engineering teams</h3>
            <div className="flex items-center gap-10 text-[13px] font-medium text-white/70">
              <div className="flex items-center gap-2"><ZapIcon className="size-4 text-white/30" /> Fast</div>
              <div className="flex items-center gap-2"><CheckCircle2Icon className="size-4 text-white/30" /> Reliable</div>
              <div className="flex items-center gap-2"><LayersIcon className="size-4 text-white/30" /> Simple</div>
            </div>
          </div>
        </section>
        <section className="px-6 py-16 md:py-24 w-full max-w-5xl mx-auto z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="flex flex-col items-start text-left">
              <div className="mb-3">
                <ActivityIcon className="size-4 text-white/60" />
              </div>
              <h3 className="text-white font-medium text-[15px] mb-1">Real-time Alerts</h3>
              <p className="text-white/40 text-sm">Detect and respond instantly.</p>
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="mb-3">
                <UsersIcon className="size-4 text-white/60" />
              </div>
              <h3 className="text-white font-medium text-[15px] mb-1">Team Routing</h3>
              <p className="text-white/40 text-sm">Send incidents to the right people automatically.</p>
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="mb-3">
                <GitBranchIcon className="size-4 text-white/60" />
              </div>
              <h3 className="text-white font-medium text-[15px] mb-1">Escalation Policies</h3>
              <p className="text-white/40 text-sm">Never miss critical alerts.</p>
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="mb-3">
                <ClockIcon className="size-4 text-white/60" />
              </div>
              <h3 className="text-white font-medium text-[15px] mb-1">Incident Timeline</h3>
              <p className="text-white/40 text-sm">Track every action.</p>
            </div>
          </div>
        </section>
        <section className="relative px-6 py-20 flex flex-col items-center text-center overflow-hidden border-t border-white/[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-white/[0.02] border border-white/5 font-mono text-[10px] text-white/30 uppercase tracking-widest backdrop-blur-sm">
              [sys] listening for traces
            </div>
            <h2 className="text-[1.75rem] md:text-3xl font-semibold text-white tracking-tight mb-8">
              Stop reacting late. Start responding in real time.
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => router.push("/signup")}
                className="bg-white hover:bg-neutral-200 text-black rounded px-6 h-10 text-sm font-medium transition-colors w-full sm:w-auto"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/login")}
                className="bg-transparent border border-white/20 hover:bg-white/5 text-white rounded px-6 h-10 text-sm font-medium transition-colors w-full sm:w-auto"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </div>
      <footer className="border-t border-white/[0.03] px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/30 max-w-7xl mx-auto w-full z-10">
        <p className="flex items-center gap-1.5">
          <ShieldCheckIcon className="size-5" /> sentinel
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0 font-medium">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
