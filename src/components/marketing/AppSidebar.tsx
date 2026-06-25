"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, LayoutDashboard, BarChart3, Download,
  Menu, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/marketing/dashboard", icon: LayoutDashboard, label: "ภาพรวม" },
  { href: "/marketing/analysis",  icon: BarChart3,       label: "วิเคราะห์คลิป" },
  { href: "/marketing/export",    icon: Download,        label: "Export ข้อมูล" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/marketing/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center shadow-sm shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-bold text-gray-900 text-base leading-tight">
            Pulse<span className="text-brand-dark">Track</span>
          </div>
          <div className="text-gray-400 text-xs">Social Analytics</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-brand-muted text-brand-dark"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-brand-dark" : "text-gray-400 group-hover:text-gray-600"}`} />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-dark opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="text-gray-400 text-xs">Mock Data — Dev Mode</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="เมนู"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-dark flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">
            Pulse<span className="text-brand-dark">Track</span>
          </span>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-56 bg-white z-50 flex flex-col shadow-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
