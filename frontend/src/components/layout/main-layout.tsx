"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // This prevents hydration errors with sidebar animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {isMounted && <Sidebar />}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "md:pl-[240px]" : "md:pl-[64px]"
        )}
      >
        <Header />
        <main className="flex-1 px-4 py-6 md:px-8 mx-auto max-w-7xl w-full">
          {children}
        </main>
        <footer className="py-6 px-8 border-t border-slate-200 bg-white/50 text-center">
          <p className="text-xs text-navy-500">
            © {new Date().getFullYear()} NociRent. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
