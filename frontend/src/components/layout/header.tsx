"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { Bell, Search, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center bg-white/80 backdrop-blur-sm px-6 md:px-8 shadow-sm",
        className
      )}
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2 md:hidden">
          <div className="bg-teal-500 rounded-md w-7 h-7 flex items-center justify-center text-white font-bold mr-1">
            NR
          </div>
          <span className="font-display text-lg font-semibold text-navy-800">
            NociRent
          </span>
        </div>

        <div className="hidden md:flex md:flex-1 max-w-md relative">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-slate-200 bg-white/50 pl-9 text-sm text-navy-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-navy-600 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
          </button>

          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-navy-600 hover:bg-slate-100">
            <Settings className="h-5 w-5" />
          </button>

          <ModeToggle />

          <div className="flex items-center gap-2 ml-1 md:ml-3">
            <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="h-4 w-4 text-teal-700" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-navy-800">
                Admin User
              </div>
              <div className="text-xs text-navy-500">Administrator</div>
            </div>
            <ChevronDown className="h-4 w-4 text-navy-400 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
