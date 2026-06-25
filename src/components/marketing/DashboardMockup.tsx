"use client";
import { TrendingUp, TrendingDown, Users, Heart, Eye, Play } from "lucide-react";

const PLATFORM_CARDS = [
  {
    name: "Instagram",
    bg: "bg-pink-50",
    border: "border-pink-100",
    iconBg: "bg-pink-500",
    textAccent: "text-pink-600",
    followers: "128.4K",
    growth: "+3.2%",
    up: true,
    likes: "2.1M",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    latestClip: { title: "Daily Routine — วิถีชีวิตประจำวัน", views: "84.2K", eng: "7.3%" },
  },
  {
    name: "TikTok",
    bg: "bg-slate-50",
    border: "border-slate-200",
    iconBg: "bg-slate-800",
    textAccent: "text-slate-700",
    followers: "94.8K",
    growth: "+8.7%",
    up: true,
    likes: "3.4M",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.53V6.79a4.85 4.85 0 0 1-1.04-.1z" />
      </svg>
    ),
    latestClip: { title: "Behind the scenes — งานถ่ายทำ", views: "201K", eng: "12.1%" },
  },
  {
    name: "Facebook",
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-600",
    textAccent: "text-blue-600",
    followers: "61.2K",
    growth: "-0.4%",
    up: false,
    likes: "892K",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    latestClip: { title: "Product Review — รีวิวสินค้าใหม่", views: "32.5K", eng: "4.9%" },
  },
];

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-gray-200 rounded-lg px-6 py-1 text-gray-400 text-xs font-mono shadow-sm">
              app.pulsetrack.io/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-5 space-y-4 bg-[#f8fafc]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 font-semibold text-base">ภาพรวมช่องทั้งหมด</h2>
              <p className="text-gray-400 text-xs mt-0.5">อัปเดตล่าสุด 5 นาทีที่แล้ว</p>
            </div>
            <div className="flex gap-1.5">
              {["7 วัน", "30 วัน", "90 วัน"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    i === 1
                      ? "bg-brand-dark text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORM_CARDS.map((p) => (
              <div
                key={p.name}
                className={`${p.bg} border ${p.border} rounded-xl p-4 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${p.iconBg} flex items-center justify-center shadow-sm`}>
                      {p.icon}
                    </div>
                    <span className="text-gray-800 font-semibold text-sm">{p.name}</span>
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${p.up ? "text-emerald-600" : "text-red-500"}`}>
                    {p.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {p.growth}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
                      <Users className="w-3 h-3" />
                      Followers
                    </div>
                    <div className="text-gray-900 font-bold text-base">{p.followers}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
                      <Heart className="w-3 h-3" />
                      Total Likes
                    </div>
                    <div className="text-gray-900 font-bold text-base">{p.likes}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2.5 border border-white">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1.5">
                    <Play className="w-3 h-3" />
                    คลิปล่าสุด
                  </div>
                  <div className="text-gray-700 text-xs font-medium truncate">{p.latestClip.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye className="w-3 h-3" />
                      {p.latestClip.views}
                    </span>
                    <span className="text-emerald-600 text-xs font-semibold">
                      Eng {p.latestClip.eng}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-800 text-sm font-semibold">Total Views (30 วัน)</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18.4% vs เดือนก่อน
              </span>
            </div>
            <div className="flex items-end gap-0.5 h-14">
              {[35,45,28,55,42,68,52,78,60,85,72,90,65,88,74,95,80,70,88,75,92,85,78,96,88,82,95,90,85,100].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-brand-dark opacity-70"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
            <div className="flex justify-between mt-2 text-gray-400 text-xs">
              <span>1 พ.ค.</span>
              <span>15 พ.ค.</span>
              <span>30 พ.ค.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
