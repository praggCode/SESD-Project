"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication on mount and path changes
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [router, pathname]);

  // Prevent UI flickering before check completes
  if (isChecking) {
    return null;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Thin top bar with sidebar trigger */}
          <header className="flex h-12 shrink-0 items-center border-b bg-background/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-vertical:h-4 data-vertical:self-auto"
            />
          </header>
          {/* Page content */}
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
