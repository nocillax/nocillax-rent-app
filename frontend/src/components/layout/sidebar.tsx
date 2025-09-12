"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  Building,
  ChevronRight,
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
    icon: Building,
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

const sideVariants = {
  open: {
    width: "240px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  closed: {
    width: "64px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
  },
  closed: {
    opacity: 0,
    x: -15,
  },
};

export function Sidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        className="fixed right-4 top-4 z-50 rounded-full p-2.5 bg-white shadow-md text-navy-700 md:hidden"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      >
        {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <motion.aside
        initial={false}
        animate={isExpanded ? "open" : "closed"}
        variants={sideVariants}
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform shadow-md bg-navy-800 transition-all duration-200 md:translate-x-0 hidden md:block overflow-hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <motion.div
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <div className="bg-teal-500 rounded-md w-8 h-8 flex items-center justify-center text-white font-bold mr-2">
                NR
              </div>
              {isExpanded && (
                <span className="font-display text-lg font-bold text-white">
                  NociRent
                </span>
              )}
            </motion.div>
          </Link>

          <button
            className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-white/60 hover:text-white hover:bg-navy-700 transition-colors"
            onClick={toggleSidebar}
          >
            <ChevronRight
              size={16}
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        <nav className="px-2 py-8 h-full">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 transition-all relative",
                    isActive
                      ? "bg-teal-600/20 text-white"
                      : "text-white/60 hover:bg-navy-700 hover:text-white"
                  )}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-md"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-teal-400"
                        : "text-white/60 group-hover:text-white"
                    )}
                  />

                  {isExpanded && (
                    <motion.span
                      variants={itemVariants}
                      className="ml-3 text-sm font-medium"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.aside>

      {/* Mobile sidebar */}
      {isMobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-navy-800 shadow-xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-navy-700">
              <Link href="/" className="flex items-center">
                <div className="bg-teal-500 rounded-md w-8 h-8 flex items-center justify-center text-white font-bold mr-2">
                  NR
                </div>
                <span className="font-display text-lg font-bold text-white">
                  NociRent
                </span>
              </Link>

              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <nav className="px-2 py-6">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative",
                        isActive
                          ? "bg-teal-600/20 text-white"
                          : "text-white/60 hover:bg-navy-700 hover:text-white"
                      )}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-md" />
                      )}

                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive
                            ? "text-teal-400"
                            : "text-white/60 group-hover:text-white"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </>
  );
}
