"use client";
import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Eye, Users, Clock, UserPlus, Share2,
  Heart, MessageCircle, TrendingUp, CalendarDays,
} from "lucide-react";
import {
  CLIPS, PLATFORM_COLORS, PLATFORM_LABELS, fmtNum, fmtSec, Platform,
} from "@/lib/marketing-mock";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";

const PLATFORMS: Platform[] = ["instagram", "tiktok", "facebook"];

const METRIC_DEFS = [
  { key: "views",           icon: Eye,            label: "Views" },
  { key: "reach",           icon: Users,          label: "Account Reached" },
  { key: "avgWatchTimeSec", icon: Clock,          label: "Avg. Watch Time",  fmt: fmtSec },
  { key: "newFollows",      icon: UserPlus,       label: "New Follows" },
  { key: "shares",          icon: Share2,         label: "Shares" },
  { key: "likes",           icon: Heart,          label: "Likes" },
  { key: "comments",        icon: MessageCircle,  label: "Comments" },
  { key: "engagementRate",  icon: TrendingUp,     label: "Engagement Rate", suffix: "%" },
] as const;

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const clip = CLIPS.find((c) => c.id === id);
  if (!clip) notFound();

  const [activeTab, setActiveTab] = useState<Platform>("instagram");
  const metrics = clip[activeTab];
  const colors = PLATFORM_COLORS[activeTab];

  const timelineMax = Math.max(...clip.viewsTimeline);

  return (
    <div className="p-5 md:p-8 space-y-5 max-w-5xl mx-auto">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/marketing/analysis"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          วิเคราะห์คลิป
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 truncate max-w-xs">{clip.title}</span>
      </div>

      {/* Clip header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl ${PLATFORM_COLORS[clip.primaryPlatform].bg} flex items-center justify-center text-white text-base font-bold shrink-0 shadow-sm`}>
            {clip.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-900 font-bold text-lg leading-snug">{clip.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{clip.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                ปล่อยวันที่ {clip.publishedAt}
              </div>
              <div className="flex items-center gap-1.5">
                <PlatformIcon
                  platform={clip.primaryPlatform}
                  className={`w-3.5 h-3.5 ${PLATFORM_COLORS[clip.primaryPlatform].icon}`}
                />
                <span className={`text-xs font-medium ${PLATFORM_COLORS[clip.primaryPlatform].text}`}>
                  {PLATFORM_LABELS[clip.primaryPlatform]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {fmtNum(clip.instagram.views + clip.tiktok.views + clip.facebook.views)} Total Views
              </div>
            </div>
          </div>
        </div>

        {/* Quick platform summary */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {PLATFORMS.map((p) => (
            <div
              key={p}
              className={`${PLATFORM_COLORS[p].light} border ${PLATFORM_COLORS[p].border} rounded-xl p-3 text-center`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <PlatformIcon platform={p} className={`w-3.5 h-3.5 ${PLATFORM_COLORS[p].icon}`} />
                <span className="text-gray-500 text-xs font-medium">{PLATFORM_LABELS[p]}</span>
              </div>
              <div className="text-gray-900 font-bold text-base">{fmtNum(clip[p].views)}</div>
              <div className={`text-xs font-semibold ${PLATFORM_COLORS[p].text}`}>{clip[p].engagementRate}% Eng</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Platform tabs + detailed metrics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-150 ${
                activeTab === p
                  ? `${PLATFORM_COLORS[p].light} ${PLATFORM_COLORS[p].text} border-b-2 ${PLATFORM_COLORS[p].border.replace("border-", "border-b-")}`
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlatformIcon platform={p} className={`w-4 h-4 ${activeTab === p ? PLATFORM_COLORS[p].icon : "text-gray-400"}`} />
              <span className="hidden sm:inline">{PLATFORM_LABELS[p]}</span>
            </button>
          ))}
        </div>

        {/* Metrics grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {METRIC_DEFS.map((m) => {
              const raw = metrics[m.key] as number;
              const display = "fmt" in m && m.fmt
                ? m.fmt(raw)
                : "suffix" in m && m.suffix
                  ? `${raw}${m.suffix}`
                  : fmtNum(raw);
              return (
                <div
                  key={m.key}
                  className={`${colors.light} border ${colors.border} rounded-xl p-4 hover:shadow-sm transition-shadow`}
                >
                  <m.icon className={`w-4 h-4 ${colors.text} mb-2.5`} />
                  <div className="text-gray-900 font-bold text-xl">{display}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{m.label}</div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Engagement timeline chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-gray-900 font-semibold text-base">Views ตามช่วงเวลา (48 ชั่วโมงแรก)</div>
            <div className="text-gray-400 text-xs mt-0.5">รวมทุก Platform</div>
          </div>
        </div>
        <div className="flex items-end gap-1 h-28">
          {clip.viewsTimeline.map((v, i) => {
            const pct = (v / (timelineMax || 1)) * 100;
            return (
              <div
                key={i}
                title={`${i * 1}h: ${v}K views`}
                className={`flex-1 rounded-t-sm transition-opacity hover:opacity-100 ${i < 6 ? "bg-brand-dark opacity-90" : "bg-brand-muted border border-brand-edge"}`}
                style={{ height: `${pct}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-gray-400 text-xs">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
          <span>36h</span>
          <span>48h</span>
        </div>
      </motion.div>

      {/* Time Log Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold text-sm">Time Log — Snapshot ตามช่วงเวลา</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs">ช่วงเวลา</th>
                {PLATFORMS.map((p) => (
                  <th key={p} colSpan={3} className={`text-center px-3 py-3 text-xs font-medium ${PLATFORM_COLORS[p].text}`}>
                    <div className="flex items-center justify-center gap-1.5">
                      <PlatformIcon platform={p} className={`w-3 h-3 ${PLATFORM_COLORS[p].icon}`} />
                      {PLATFORM_LABELS[p]}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2" />
                {PLATFORMS.map((p) => (
                  <>
                    <th key={`${p}-v`} className="px-3 py-2 text-center text-gray-400 text-xs font-medium">Views</th>
                    <th key={`${p}-r`} className="px-3 py-2 text-center text-gray-400 text-xs font-medium">Reach</th>
                    <th key={`${p}-e`} className="px-3 py-2 text-center text-gray-400 text-xs font-medium">Eng%</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clip.timeLog.map((snapshot) => (
                <tr key={snapshot.label} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 bg-brand-muted border border-brand-edge text-brand-dark text-xs font-bold rounded-lg">
                      {snapshot.label}
                    </span>
                  </td>
                  {PLATFORMS.map((p) => {
                    const s = snapshot[p];
                    return (
                      <>
                        <td key={`${p}-v`} className="px-3 py-3.5 text-center text-gray-700 text-xs font-mono">{fmtNum(s.views)}</td>
                        <td key={`${p}-r`} className="px-3 py-3.5 text-center text-gray-500 text-xs font-mono">{fmtNum(s.reach)}</td>
                        <td key={`${p}-e`} className="px-3 py-3.5 text-center">
                          <span className="text-emerald-600 text-xs font-bold">{s.engagementRate}%</span>
                        </td>
                      </>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
