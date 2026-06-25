"use client";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Heart, Eye } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

const HERO_STATS = [
  { icon: Eye, label: "ยอดวิวรวม", value: "12.4M" },
  { icon: TrendingUp, label: "Growth", value: "+24%" },
  { icon: Users, label: "Followers", value: "284K" },
  { icon: Heart, label: "Engagement", value: "6.8%" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 bg-[#f8fafc]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,oklch(0.95_0.04_354/0.5)_0%,transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-brand-muted border border-brand-edge text-brand-dark text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-brand-dark rounded-full" />
            ระบบติดตาม Engagement สำหรับทีมภายใน
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-center mb-5"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            วัด Engagement
            <br />
            <span className="text-brand-dark">ทุก Platform</span>
            <br />
            ในที่เดียว
          </h1>
        </motion.div>

        {/* Sub headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-9 leading-relaxed"
        >
          เชื่อมต่อ Instagram, TikTok และ Facebook API โดยตรง
          ดูยอด Views, Engagement และ Audience Growth ได้ Real-time
          โดยไม่ต้องบันทึกยอดทีละโพสต์อีกต่อไป
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <a
            href="#"
            className="flex items-center gap-2 bg-brand-dark hover:bg-brand-deeper text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            เริ่มใช้งาน
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#preview"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold px-7 py-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors text-sm shadow-sm"
          >
            ดูตัวอย่าง Dashboard
          </a>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm"
            >
              <stat.icon className="w-4 h-4 text-brand-dark" />
              <span className="text-gray-900 font-bold text-sm">{stat.value}</span>
              <span className="text-gray-400 text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
