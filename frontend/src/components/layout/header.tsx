"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export function Header({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur-sm px-6 md:px-8",
        className
      )}
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="md:hidden font-display text-lg font-bold">
            NociRent
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
            NR
          </div>
        </div>
      </div>
    </header>
  );
}
