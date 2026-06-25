"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Eye, TrendingUp, ChevronRight, Filter } from "lucide-react";
import { CLIPS, PLATFORM_COLORS, PLATFORM_LABELS, fmtNum, Platform } from "@/lib/marketing-mock";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";

const PLATFORMS: Array<Platform | "all"> = ["all", "instagram", "tiktok", "facebook"];
const PLATFORM_LABEL: Record<string, string> = { all: "ทั้งหมด", ...PLATFORM_LABELS };
const SORT_OPTIONS = [
  { value: "date", label: "วันที่ปล่อย" },
  { value: "views", label: "Views รวม" },
  { value: "engagement", label: "Engagement" },
] as const;
type SortKey = typeof SORT_OPTIONS[number]["value"];

export default function AnalysisPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [sort, setSort] = useState<SortKey>("date");

  const filtered = CLIPS
    .filter((c) => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
      const matchPlatform = platform === "all" || c.primaryPlatform === platform;
      return matchSearch && matchPlatform;
    })
    .sort((a, b) => {
      if (sort === "date") return b.publishedAt.localeCompare(a.publishedAt);
      if (sort === "views") {
        const ta = a.instagram.views + a.tiktok.views + a.facebook.views;
        const tb = b.instagram.views + b.tiktok.views + b.facebook.views;
        return tb - ta;
      }
      const ea = (a.instagram.engagementRate + a.tiktok.engagementRate + a.facebook.engagementRate) / 3;
      const eb = (b.instagram.engagementRate + b.tiktok.engagementRate + b.facebook.engagementRate) / 3;
      return eb - ea;
    });

  return (
    <div className="p-5 md:p-8 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">วิเคราะห์คลิป</h1>
        <p className="text-gray-400 text-sm mt-0.5">คลิกคลิปเพื่อดูรายละเอียดแยกตาม Platform</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคลิป..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark shadow-sm"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-dark shadow-sm appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Platform filter pills */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => {
          const active = platform === p;
          const colors = p !== "all" ? PLATFORM_COLORS[p] : null;
          return (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                active
                  ? "bg-brand-dark text-white border-brand-dark shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {colors && <PlatformIcon platform={p as Platform} className={`w-3 h-3 ${active ? "text-white" : colors.icon}`} />}
              {PLATFORM_LABEL[p]}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p className="text-gray-400 text-xs">แสดง {filtered.length} คลิป</p>

      {/* Clip list */}
      <div className="space-y-3">
        {filtered.map((clip, i) => {
          const totalViews = clip.instagram.views + clip.tiktok.views + clip.facebook.views;
          const avgEng = ((clip.instagram.engagementRate + clip.tiktok.engagementRate + clip.facebook.engagementRate) / 3).toFixed(1);
          const colors = PLATFORM_COLORS[clip.primaryPlatform];

          return (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/marketing/analysis/${clip.id}`}
                className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-edge hover:shadow-md transition-all duration-200"
              >
                {/* Initials */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                  {clip.title.slice(0, 2).toUpperCase()}
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 font-semibold text-sm truncate">{clip.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs">{clip.publishedAt}</span>
                    <span className="text-gray-300">·</span>
                    <div className="flex items-center gap-1">
                      <PlatformIcon platform={clip.primaryPlatform} className={`w-3 h-3 ${colors.icon}`} />
                      <span className={`text-xs font-medium ${colors.text}`}>{PLATFORM_LABELS[clip.primaryPlatform]}</span>
                    </div>
                  </div>
                </div>

                {/* Per-platform view pills */}
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                  {(["instagram", "tiktok", "facebook"] as Platform[]).map((p) => (
                    <div key={p} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${PLATFORM_COLORS[p].light} border ${PLATFORM_COLORS[p].border}`}>
                      <PlatformIcon platform={p} className={`w-3 h-3 ${PLATFORM_COLORS[p].icon}`} />
                      <span className="text-gray-700 text-xs font-medium">{fmtNum(clip[p].views)}</span>
                    </div>
                  ))}
                </div>

                {/* Summary stats */}
                <div className="hidden sm:flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-800 text-sm font-bold">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {fmtNum(totalViews)}
                    </div>
                    <div className="text-gray-400 text-xs">Total</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {avgEng}%
                    </div>
                    <div className="text-gray-400 text-xs">Avg Eng</div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-dark transition-colors shrink-0" />
              </Link>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">ไม่พบคลิปที่ตรงกับเงื่อนไข</div>
        )}
      </div>
    </div>
  );
}
