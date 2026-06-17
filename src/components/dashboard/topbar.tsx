"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  History,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Search,
  History,
};

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analyze": "Analyze Content",
  "/history": "Analysis History",
};

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "Dashboard";

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 glass border-b border-border h-16 flex items-center px-4 sm:px-6">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="mr-2" />
              }
            >
              <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#0D1117] border-r border-border p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-6">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
                <span className="text-lg font-bold text-white">
                  JobShield AI
                </span>
              </Link>

              <nav className="space-y-1">
                {DASHBOARD_NAV.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-white border border-indigo-500/20"
                          : "text-muted-foreground hover:text-white hover:bg-secondary"
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-indigo-400" : ""
                          )}
                        />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
