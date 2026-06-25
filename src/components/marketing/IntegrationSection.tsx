"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, RefreshCw, Table2, CheckCircle2 } from "lucide-react";

const SHEET_ROWS = [
  { date: "20 พ.ค.", clip: "Morning Routine", platform: "Instagram", views: "201,432", eng: "12.1%", reach: "183,290" },
  { date: "20 พ.ค.", clip: "Morning Routine", platform: "TikTok", views: "84,208", eng: "7.3%", reach: "71,044" },
  { date: "18 พ.ค.", clip: "Product Review", platform: "Facebook", views: "54,120", eng: "6.8%", reach: "49,200" },
  { date: "15 พ.ค.", clip: "Behind the scenes", platform: "Facebook", views: "32,540", eng: "4.9%", reach: "29,100" },
];

const platformColor: Record<string, string> = {
  Instagram: "text-pink-600",
  TikTok: "text-slate-700",
  Facebook: "text-blue-600",
};

export function IntegrationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="integrations" className="py-24 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-4 block">
              Google Sheets Integration
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
              ส่งข้อมูลไป
              <br />
              <span className="text-emerald-600">Google Sheets</span>
              <br />
              ได้ในคลิกเดียว
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              ทีมที่คุ้นเคยกับ Spreadsheet ยังสามารถทำงานในแบบที่ถนัดได้
              PulseTrack Sync ข้อมูล Engagement ไป Google Sheets
              โดยอัตโนมัติ หรือกด Export ได้ตลอดเวลา
            </p>

            <ul className="space-y-3.5 mb-8">
              {[
                { icon: RefreshCw, text: "Auto-sync ตามกำหนดเวลา — รายวันหรือรายสัปดาห์" },
                { icon: Table2, text: "รูปแบบตารางพร้อมใช้ ไม่ต้องจัด Format เอง" },
                { icon: Download, text: "Manual Export เป็น CSV หรือ Google Sheets" },
                { icon: CheckCircle2, text: "แบ่ง Sheet ตาม Platform หรือรวมทั้งหมดได้" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-base">{item.text}</span>
                </li>
              ))}
            </ul>

            <button className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.318 12.545H7.91v-1.909h3.408v1.91zM16.09 0H3.273C2.218 0 1.364.854 1.364 1.91v20.18C1.364 23.146 2.218 24 3.273 24h17.454c1.055 0 1.91-.854 1.91-1.909V5.727L16.09 0zm2.863 20.727H5.045V10.09h13.91v10.636zm0-12.545H5.045V3.818h9.682v4.364h4.226zM7.91 14.727h3.408v-1.909H7.91v1.91zm4.772 0H16.09v-1.909h-3.408v1.91zm-4.772 2.546h3.408V15.364H7.91v1.91zm4.772 0H16.09v-1.909h-3.408v1.91z" />
              </svg>
              เชื่อมต่อ Google Sheets
            </button>
          </motion.div>

          {/* Right: sheet mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">
              {/* Sheet header */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#1a4731] border-b border-white/10">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.318 12.545H7.91v-1.909h3.408v1.91zM16.09 0H3.273C2.218 0 1.364.854 1.364 1.91v20.18C1.364 23.146 2.218 24 3.273 24h17.454c1.055 0 1.91-.854 1.91-1.909V5.727L16.09 0zm2.863 20.727H5.045V10.09h13.91v10.636zm0-12.545H5.045V3.818h9.682v4.364h4.226z" />
                </svg>
                <span className="text-white text-sm font-semibold">PulseTrack — Engagement Report</span>
                <div className="ml-auto flex items-center gap-1.5 text-emerald-300 text-xs">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Synced 2 นาทีที่แล้ว
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-6 gap-0 border-b border-gray-100 bg-gray-50">
                {["วันที่", "คลิป", "Platform", "Views", "Eng%", "Reach"].map((h) => (
                  <div key={h} className="px-3 py-2 text-gray-500 text-xs font-semibold border-r border-gray-100 last:border-0">
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {SHEET_ROWS.map((row, i) => (
                <div key={i} className="grid grid-cols-6 gap-0 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="px-3 py-2 text-gray-400 text-xs border-r border-gray-50">{row.date}</div>
                  <div className="px-3 py-2 text-gray-700 text-xs truncate border-r border-gray-50">{row.clip}</div>
                  <div className={`px-3 py-2 text-xs border-r border-gray-50 font-medium ${platformColor[row.platform] ?? "text-gray-600"}`}>{row.platform}</div>
                  <div className="px-3 py-2 text-gray-700 text-xs font-mono border-r border-gray-50">{row.views}</div>
                  <div className="px-3 py-2 text-emerald-600 text-xs font-bold border-r border-gray-50">{row.eng}</div>
                  <div className="px-3 py-2 text-gray-600 text-xs font-mono">{row.reach}</div>
                </div>
              ))}

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-400 text-xs">แสดง 4 จาก 128 แถว</span>
                <button className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold hover:text-emerald-700 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export ทั้งหมด
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
