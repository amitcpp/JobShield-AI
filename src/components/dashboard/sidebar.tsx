"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, History, BarChart3 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { DASHBOARD_NAV } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  LayoutDashboard,
  Search,
  History,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  // Show Admin link if role is admin OR in development/testing mode
  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.emailAddresses.some(e => e.emailAddress.endsWith("@jobshield.ai") || e.emailAddress === "admin@example.com") ||
    process.env.NODE_ENV === "development";

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-white/10 bg-[#0d1117]">
      {/* Logo */}
      <div className="flex items-center px-6 py-5">
        <Link href="/dashboard">
          <Logo size="md" />
        </Link>
      </div>

      <Separator className="bg-white/5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {DASHBOARD_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white shadow-sm border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-500"
                  )}
                />
              )}
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Operations Link */}
      {isAdmin && (
        <div className="px-3 py-4 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-3 mb-2">
            Operations
          </span>
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith("/dashboard/admin")
                ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/20 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <BarChart3
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                pathname.startsWith("/dashboard/admin") ? "text-indigo-400" : "text-slate-500"
              )}
            />
            <span>Admin Analytics</span>
            {pathname.startsWith("/dashboard/admin") && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
            )}
          </Link>
        </div>
      )}

      <Separator className="bg-white/5" />

      {/* Bottom section */}
      <div className="px-4 py-4">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Protected by AI-powered scam detection
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Mobile sidebar nav content — reused inside the Sheet in Topbar */
export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  // Show Admin link if role is admin OR in development/testing mode
  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.emailAddresses.some(e => e.emailAddress.endsWith("@jobshield.ai") || e.emailAddress === "admin@example.com") ||
    process.env.NODE_ENV === "development";

  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {DASHBOARD_NAV.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-indigo-400" : "text-slate-500"
                )}
              />
            )}
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Operations Link */}
      {isAdmin && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-3 mb-2">
            Operations
          </span>
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith("/dashboard/admin")
                ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <BarChart3
              className={cn(
                "h-5 w-5 shrink-0",
                pathname.startsWith("/dashboard/admin") ? "text-indigo-400" : "text-slate-500"
              )}
            />
            <span>Admin Analytics</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
