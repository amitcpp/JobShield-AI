import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0E1A]">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left orb */}
        <div
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 70%)",
            animationDuration: "4s",
          }}
        />
        {/* Bottom-right orb */}
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
        {/* Center-top orb */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <Logo size="lg" />
        <div>{children}</div>
        <p className="text-sm text-slate-500">
          AI-powered protection from job scams
        </p>
      </div>
    </div>
  );
}
