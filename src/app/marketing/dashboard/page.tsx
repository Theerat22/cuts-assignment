"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, Users, Heart, BarChart3, Eye, ChevronRight } from "lucide-react";
import {
  CLIPS, PLATFORM_STATS, MONTHLY_VIEWS, PLATFORM_COLORS, PLATFORM_LABELS,
  fmtNum, Platform,
} from "@/lib/marketing-mock";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";

const PLATFORMS: Platform[] = ["instagram", "tiktok", "facebook"];
const DATE_RANGES = ["7 วัน", "30 วัน", "90 วัน"] as const;
type DateRange = typeof DATE_RANGES[number];

const SLICE: Record<DateRange, number> = { "7 วัน": 7, "30 วัน": 30, "90 วัน": 30 };

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange>("30 วัน");

  const combinedViews = MONTHLY_VIEWS.instagram.map((v, i) =>
    v + MONTHLY_VIEWS.tiktok[i] + MONTHLY_VIEWS.facebook[i]
  ).slice(-SLICE[range]);

  const maxView = Math.max(...combinedViews);

  const recentClips = CLIPS.slice(0, 5);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ภาพรวมช่องทั้งหมด</h1>
          <p className="text-gray-400 text-sm mt-0.5">อัปเดตล่าสุด: 5 นาทีที่แล้ว — Mock Data</p>
        </div>
        <div className="flex gap-1.5">
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all ${
                range === r
                  ? "bg-brand-dark text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLATFORMS.map((p, i) => {
          const stats = PLATFORM_STATS[p];
          const colors = PLATFORM_COLORS[p];
          return (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center shadow-sm`}>
                    <PlatformIcon platform={p} className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{PLATFORM_LABELS[p]}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${stats.followerGrowth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {stats.followerGrowth >= 0
                    ? <TrendingUp className="w-3.5 h-3.5" />
                    : <TrendingDown className="w-3.5 h-3.5" />}
                  {stats.followerGrowth > 0 ? "+" : ""}{stats.followerGrowth}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <Users className="w-3 h-3" />
                    Followers
                  </div>
                  <div className="text-gray-900 font-bold text-lg">{fmtNum(stats.followers)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <Heart className="w-3 h-3" />
                    Total Likes
                  </div>
                  <div className="text-gray-900 font-bold text-lg">{fmtNum(stats.totalLikes)}</div>
                </div>
              </div>

              <div className={`mt-3 flex items-center justify-between px-3 py-2 ${colors.light} rounded-xl`}>
                <span className="text-gray-500 text-xs">Avg. Engagement</span>
                <span className={`font-bold text-sm ${colors.text}`}>{stats.avgEngagement}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Combined views chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-gray-900 font-semibold text-base">Views รวมทุก Platform</div>
            <div className="text-gray-400 text-xs mt-0.5">{range}ที่ผ่านมา</div>
          </div>
          <div className="flex items-center gap-3">
            {PLATFORMS.map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${PLATFORM_COLORS[p].bg}`} />
                <span className="text-gray-500 text-xs">{PLATFORM_LABELS[p]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked bar chart */}
        <div className="flex items-end gap-0.5 h-32">
          {MONTHLY_VIEWS.instagram.slice(-SLICE[range]).map((ig, i) => {
            const tt = MONTHLY_VIEWS.tiktok.slice(-SLICE[range])[i];
            const fb = MONTHLY_VIEWS.facebook.slice(-SLICE[range])[i];
            const total = ig + tt + fb;
            const pct = (total / (maxView || 1)) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
                <div className="flex flex-col gap-px" style={{ height: `${pct}%` }}>
                  <div className="bg-blue-500 opacity-80 rounded-t-sm" style={{ flex: fb }} />
                  <div className="bg-slate-700 opacity-80" style={{ flex: tt }} />
                  <div className="bg-pink-500 opacity-80" style={{ flex: ig }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-gray-400 text-xs">
          <span>
            {range === "7 วัน" ? "6 วันก่อน" : range === "30 วัน" ? "30 วันก่อน" : "90 วันก่อน"}
          </span>
          <span>วันนี้</span>
        </div>
      </motion.div>

      {/* Recent clips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold text-sm">คลิปล่าสุด</span>
          </div>
          <Link
            href="/marketing/analysis"
            className="text-brand-dark text-xs font-semibold hover:text-brand-deeper flex items-center gap-1 transition-colors"
          >
            ดูทั้งหมด
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recentClips.map((clip, i) => {
            const igViews = clip.instagram.views;
            const ttViews = clip.tiktok.views;
            const fbViews = clip.facebook.views;
            const totalViews = igViews + ttViews + fbViews;
            const avgEng = ((clip.instagram.engagementRate + clip.tiktok.engagementRate + clip.facebook.engagementRate) / 3).toFixed(1);
            const colors = PLATFORM_COLORS[clip.primaryPlatform];

            return (
              <Link
                key={clip.id}
                href={`/marketing/analysis/${clip.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                  {clip.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm font-medium truncate">{clip.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{clip.publishedAt}</div>
                </div>
                <div className="hidden sm:flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-700 text-sm font-semibold">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {fmtNum(totalViews)}
                    </div>
                    <div className="text-gray-400 text-xs">Total Views</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 text-sm font-bold">{avgEng}%</div>
                    <div className="text-gray-400 text-xs">Avg Eng</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
