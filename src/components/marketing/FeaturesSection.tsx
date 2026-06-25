"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutDashboard, BarChart3, Clock, Users, Eye, Heart,
  Share2, TrendingUp, Activity, Target, Layers, Bell
} from "lucide-react";

const FEATURES = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard Overview",
    subtitle: "ภาพรวมทุก Platform ในหน้าเดียว",
    iconBg: "bg-brand-dark",
    accentText: "text-brand-dark",
    accentBg: "bg-brand-muted",
    accentBorder: "border-brand-edge",
    metrics: [
      { icon: Users, label: "ยอดผู้ติดตาม", desc: "พร้อม % เพิ่ม/ลด" },
      { icon: Heart, label: "ยอดไลค์ทั้งหมด", desc: "สะสมตลอดช่วงเวลา" },
      { icon: Eye, label: "Engagement ล่าสุด", desc: "คลิปที่ปล่อยล่าสุด" },
      { icon: TrendingUp, label: "Growth Rate", desc: "เทรนด์การเติบโต" },
    ],
    preview: (
      <div className="space-y-2">
        {[
          { platform: "Instagram", followers: "128.4K", change: "+3.2%", up: true },
          { platform: "TikTok", followers: "94.8K", change: "+8.7%", up: true },
          { platform: "Facebook", followers: "61.2K", change: "-0.4%", up: false },
        ].map((p) => (
          <div key={p.platform} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-2.5">
            <span className="text-gray-600 text-xs font-medium">{p.platform}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 text-xs font-bold">{p.followers}</span>
              <span className={`text-xs font-semibold ${p.up ? "text-emerald-600" : "text-red-500"}`}>
                {p.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "analysis",
    icon: BarChart3,
    title: "Analysis Card",
    subtitle: "เจาะลึกทุก Metric ของแต่ละคลิป",
    iconBg: "bg-blue-600",
    accentText: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    metrics: [
      { icon: Eye, label: "Views และ Reach", desc: "Account ที่เข้าถึง" },
      { icon: Activity, label: "Watch Time", desc: "เวลาดูเฉลี่ย" },
      { icon: Share2, label: "Share Rate", desc: "อัตราการแชร์" },
      { icon: Target, label: "Interactions", desc: "ทุก Action ที่เกิด" },
    ],
    preview: (
      <div className="space-y-2.5">
        {[
          { metric: "Views", value: "201K", pct: 85 },
          { metric: "Account Reached", value: "183K", pct: 75 },
          { metric: "Avg. Watch Time", value: "42s", pct: 60 },
          { metric: "Share Rate", value: "4.2%", pct: 45 },
        ].map((m) => (
          <div key={m.metric}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-xs">{m.metric}</span>
              <span className="text-gray-900 text-xs font-bold">{m.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${m.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "timelog",
    icon: Clock,
    title: "Time-based Log",
    subtitle: "Track Viral Curve ตั้งแต่ชั่วโมงแรก",
    iconBg: "bg-emerald-600",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    metrics: [
      { icon: Clock, label: "1h Snapshot", desc: "ยอดช่วง Golden Hour" },
      { icon: Bell, label: "5h Snapshot", desc: "ยอดหลังอัลกอฯ Push" },
      { icon: Layers, label: "24h / 48h Log", desc: "ยอดระยะยาว" },
      { icon: TrendingUp, label: "Viral Curve", desc: "กราฟ Engagement ตามเวลา" },
    ],
    preview: (
      <div className="space-y-1.5">
        {[
          { time: "1h", views: "12.4K", w: 25 },
          { time: "5h", views: "38.2K", w: 50 },
          { time: "24h", views: "84.2K", w: 75 },
          { time: "48h", views: "112K", w: 100 },
        ].map((t) => (
          <div key={t.time} className="flex items-center gap-2.5">
            <div className="w-8 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-700 text-xs font-bold">{t.time}</span>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg h-5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-lg"
                style={{ width: `${t.w}%` }}
              />
            </div>
            <span className="text-gray-700 text-xs font-semibold w-14 text-right shrink-0">{t.views}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="features" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ทุก Metric ที่ทีมต้องการ
            <br />
            <span className="text-gray-400">ครบในที่เดียว</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            ไม่ว่าจะเป็นภาพรวมช่องหรือเจาะลึกรายคลิป PulseTrack มีทุกอย่างพร้อม
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6 pb-0">
                <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm mb-5">{feature.subtitle}</p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {feature.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-start gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                      <metric.icon className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-gray-800 text-xs font-medium leading-tight">{metric.label}</div>
                        <div className="text-gray-400 text-xs">{metric.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`mx-5 mb-5 ${feature.accentBg} border ${feature.accentBorder} rounded-xl p-4 flex-1`}>
                <div className={`text-xs mb-3 flex items-center gap-1.5 font-medium ${feature.accentText}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${feature.iconBg}`} />
                  Live Preview
                </div>
                {feature.preview}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
