"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Users,
  FileText,
  CreditCard,
  BarChart4,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Apartments",
    href: "/apartments",
    icon: Home,
  },
  {
    title: "Tenants",
    href: "/tenants",
    icon: Users,
  },
  {
    title: "Bills",
    href: "/bills",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart4,
  },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <button
        className="fixed right-4 top-4 z-50 rounded-full p-2 bg-primary text-primary-foreground md:hidden"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      >
        {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 md:translate-x-0",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center">
            <span className="font-display text-lg font-bold">NociRent</span>
          </Link>
        </div>
        <nav className="px-3 py-6">
          <div className="space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  pathname === item.href ||
                    pathname?.startsWith(`${item.href}/`)
                    ? "bg-secondary text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`)
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
    </>
  );
}
