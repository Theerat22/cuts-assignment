"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PLATFORMS = [
  {
    name: "Instagram",
    description: "ดึงข้อมูล Reels, Stories และ Posts",
    iconBg: "bg-pink-500",
    accent: "border-pink-100 bg-pink-50",
    dot: "bg-pink-500",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    metrics: ["Views", "Reach", "Saves", "Story Views"],
  },
  {
    name: "TikTok",
    description: "ติดตาม TikTok Videos และ Live",
    iconBg: "bg-slate-800",
    accent: "border-slate-200 bg-slate-50",
    dot: "bg-slate-700",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.53V6.79a4.85 4.85 0 0 1-1.04-.1z" />
      </svg>
    ),
    metrics: ["Play Count", "Watch Time", "Shares", "Duets"],
  },
  {
    name: "Facebook",
    description: "วิเคราะห์ Facebook Videos และ Reels",
    iconBg: "bg-blue-600",
    accent: "border-blue-100 bg-blue-50",
    dot: "bg-blue-600",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    metrics: ["Video Views", "Reach", "Reactions", "Shares"],
  },
];

export function PlatformsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-3 block">
            Platforms
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            เชื่อมต่อทุก Platform
            <span className="text-gray-400"> ที่ทีมใช้งาน</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            ใช้ Official API โดยตรง ข้อมูลแม่นยำ Real-time ไม่ต้องพึ่ง Third-party
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLATFORMS.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`border ${platform.accent} rounded-2xl p-7 hover:shadow-md transition-shadow duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${platform.iconBg} flex items-center justify-center mb-5 shadow-sm`}>
                {platform.icon}
              </div>

              <h3 className="text-gray-900 text-lg font-semibold mb-1.5">{platform.name}</h3>
              <p className="text-gray-500 text-sm mb-5">{platform.description}</p>

              <div className="grid grid-cols-2 gap-2">
                {platform.metrics.map((metric) => (
                  <div key={metric} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <div className={`w-1.5 h-1.5 rounded-full ${platform.dot}`} />
                    <span className="text-gray-600 text-xs font-medium">{metric}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Official API Connected
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
