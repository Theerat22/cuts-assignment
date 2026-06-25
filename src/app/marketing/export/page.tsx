"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle2, FileSpreadsheet, RefreshCw, Table2 } from "lucide-react";
import { CLIPS, PLATFORM_LABELS, fmtNum, Platform } from "@/lib/marketing-mock";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";

const PLATFORMS: Platform[] = ["instagram", "tiktok", "facebook"];

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setDone(false);
    setTimeout(() => {
      setExporting(false);
      setDone(true);
    }, 1800);
  };

  // Build preview rows
  const rows = CLIPS.flatMap((clip) =>
    PLATFORMS.map((p) => ({
      date: clip.publishedAt,
      title: clip.title,
      platform: PLATFORM_LABELS[p],
      views: fmtNum(clip[p].views),
      reach: fmtNum(clip[p].reach),
      engagement: `${clip[p].engagementRate}%`,
      likes: fmtNum(clip[p].likes),
      shares: fmtNum(clip[p].shares),
      comments: fmtNum(clip[p].comments),
    }))
  );

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Export ข้อมูล</h1>
        <p className="text-gray-400 text-sm mt-0.5">ส่งออกข้อมูล Engagement ไปยัง Google Sheets หรือ CSV</p>
      </div>

      {/* Export options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Google Sheets */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-[#1a4731] flex items-center justify-center mb-4 shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-1.5">Google Sheets</h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            ส่งข้อมูลทั้งหมดไปยัง Google Sheets แบ่งตาม Platform อัตโนมัติ
          </p>
          <ul className="space-y-2 mb-6">
            {[
              { icon: RefreshCw, text: "Auto-sync รายวัน" },
              { icon: Table2, text: "แบ่ง Sheet ตาม Platform" },
              { icon: CheckCircle2, text: "รูปแบบพร้อมใช้งาน" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-gray-500 text-sm">
                <item.icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm"
          >
            {exporting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> กำลังส่ง...</>
            ) : done ? (
              <><CheckCircle2 className="w-4 h-4" /> ส่งสำเร็จแล้ว</>
            ) : (
              <><FileSpreadsheet className="w-4 h-4" /> ส่งไป Google Sheets</>
            )}
          </button>
        </motion.div>

        {/* CSV */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-dark flex items-center justify-center mb-4 shadow-sm">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-1.5">ดาวน์โหลด CSV</h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            Export เป็นไฟล์ CSV เพื่อเปิดด้วย Excel หรือ Google Sheets ได้ทันที
          </p>
          <ul className="space-y-2 mb-6">
            {[
              { icon: Download, text: "ดาวน์โหลดได้ทันที" },
              { icon: Table2, text: "รวมทุก Platform ในไฟล์เดียว" },
              { icon: CheckCircle2, text: "เลือก Date Range ได้" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-gray-500 text-sm">
                <item.icon className="w-3.5 h-3.5 text-brand-dark shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
          <button className="w-full flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand-deeper text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm">
            <Download className="w-4 h-4" />
            ดาวน์โหลด CSV
          </button>
        </motion.div>
      </div>

      {/* Preview table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-gray-900 font-semibold text-sm">ตัวอย่างข้อมูลที่จะ Export</span>
          <span className="text-gray-400 text-xs">{rows.length} แถว</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["วันที่", "ชื่อคลิป", "Platform", "Views", "Reach", "Eng%", "Likes", "Shares", "Comments"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.slice(0, 9).map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 text-gray-700 max-w-[160px] truncate">{row.title}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <PlatformIcon
                        platform={row.platform.toLowerCase() as Platform}
                        className="w-3 h-3 text-gray-500"
                      />
                      <span className="text-gray-600">{row.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-700 font-mono">{row.views}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono">{row.reach}</td>
                  <td className="px-4 py-2.5 text-emerald-600 font-bold">{row.engagement}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono">{row.likes}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono">{row.shares}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono">{row.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-gray-400 text-xs">
            แสดง 9 จาก {rows.length} แถว
          </div>
        </div>
      </motion.div>
    </div>
  );
}
