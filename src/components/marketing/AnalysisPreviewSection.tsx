"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Eye, Users, Clock, UserPlus, Share2, Heart, MessageCircle, TrendingUp, ChevronRight } from "lucide-react";

const CLIPS = [
  {
    title: "Morning Routine — วิถีชีวิตประจำวัน",
    initials: "MR",
    platform: "Instagram",
    date: "20 พ.ค. 2026",
    views: "201K",
    eng: "12.1%",
    iconBg: "bg-pink-500",
  },
  {
    title: "Product Review — รีวิวสินค้า EP.3",
    initials: "PR",
    platform: "TikTok",
    date: "18 พ.ค. 2026",
    views: "84.2K",
    eng: "7.3%",
    iconBg: "bg-slate-700",
  },
  {
    title: "Behind the scenes — งานถ่ายทำ",
    initials: "BH",
    platform: "Facebook",
    date: "15 พ.ค. 2026",
    views: "32.5K",
    eng: "4.9%",
    iconBg: "bg-blue-600",
  },
];

const TABS = [
  {
    label: "Instagram",
    metrics: [
      { icon: Eye, label: "Views", value: "201,432" },
      { icon: Users, label: "Account Reached", value: "183,290" },
      { icon: Clock, label: "Avg. Watch Time", value: "38.4s" },
      { icon: UserPlus, label: "New Follows", value: "1,842" },
      { icon: Share2, label: "Shares", value: "4,210" },
      { icon: Heart, label: "Likes", value: "14,920" },
      { icon: MessageCircle, label: "Comments", value: "892" },
      { icon: TrendingUp, label: "Engagement Rate", value: "12.1%" },
    ],
  },
  {
    label: "TikTok",
    metrics: [
      { icon: Eye, label: "Views", value: "84,208" },
      { icon: Users, label: "Account Reached", value: "71,044" },
      { icon: Clock, label: "Avg. Watch Time", value: "22.8s" },
      { icon: UserPlus, label: "New Follows", value: "730" },
      { icon: Share2, label: "Shares", value: "3,120" },
      { icon: Heart, label: "Likes", value: "6,148" },
      { icon: MessageCircle, label: "Comments", value: "312" },
      { icon: TrendingUp, label: "Engagement Rate", value: "7.3%" },
    ],
  },
  {
    label: "Facebook",
    metrics: [
      { icon: Eye, label: "Video Views", value: "32,540" },
      { icon: Users, label: "People Reached", value: "29,100" },
      { icon: Clock, label: "Avg. Watch Time", value: "1m 48s" },
      { icon: UserPlus, label: "New Follows", value: "210" },
      { icon: Share2, label: "Shares", value: "584" },
      { icon: Heart, label: "Reactions", value: "1,594" },
      { icon: MessageCircle, label: "Comments", value: "148" },
      { icon: TrendingUp, label: "Engagement Rate", value: "4.9%" },
    ],
  },
];

export function AnalysisPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClip, setSelectedClip] = useState(0);

  return (
    <section ref={ref} id="preview" className="py-24 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-3 block">
            Analysis Card
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            เจาะลึกทุกคลิป
            <br />
            <span className="text-brand-dark">แบ่งตาม Platform</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            กดเข้าคลิปแต่ละอัน เห็นทุก Metric แยกตาม Platform ในรูปแบบที่อ่านง่ายและเปรียบเทียบได้ทันที
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5"
        >
          {/* Clip stack */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 px-1">
              คลิปทั้งหมด
            </div>
            {CLIPS.map((clip, i) => (
              <button
                key={i}
                onClick={() => { setSelectedClip(i); setActiveTab(0); }}
                className={`w-full text-left flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                  selectedClip === i
                    ? "bg-white border-brand-edge shadow-md"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${clip.iconBg} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                  {clip.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm font-semibold truncate">{clip.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 text-xs">{clip.date}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500 text-xs">{clip.platform}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye className="w-3 h-3" />
                      {clip.views}
                    </span>
                    <span className="text-emerald-600 text-xs font-semibold">
                      Eng {clip.eng}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${selectedClip === i ? "text-brand-dark" : "text-gray-300"}`} />
              </button>
            ))}
            <div className="text-center py-3 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
              + คลิปอีก 24 รายการ
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Clip header */}
              <div className="flex items-center gap-4 p-5 border-b border-gray-100 bg-gray-50">
                <div className={`w-11 h-11 rounded-xl ${CLIPS[selectedClip].iconBg} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                  {CLIPS[selectedClip].initials}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{CLIPS[selectedClip].title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{CLIPS[selectedClip].date} · {CLIPS[selectedClip].platform}</div>
                </div>
              </div>

              {/* Platform tabs */}
              <div className="flex border-b border-gray-100">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                      activeTab === i
                        ? "text-brand-dark border-b-2 border-brand-dark bg-brand-muted"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Metrics */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {TABS[activeTab].metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors"
                    >
                      <metric.icon className="w-4 h-4 text-gray-400 mb-2" />
                      <div className="text-gray-900 font-bold text-base">{metric.value}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Chart */}
              <div className="px-5 pb-5">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 text-sm font-semibold">Views ตามช่วงเวลา</span>
                    <span className="text-gray-400 text-xs">48 ชั่วโมงแรก</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-16">
                    {[8,22,45,82,95,88,76,68,72,65,58,52,60,55,48,45,42,40,38,35,33,30,28,26].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-sm ${i < 5 ? "bg-brand-dark" : "bg-brand-muted border border-brand-edge"}`}
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-gray-400 text-xs">
                    <span>0h</span>
                    <span>5h</span>
                    <span>12h</span>
                    <span>24h</span>
                    <span>48h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
