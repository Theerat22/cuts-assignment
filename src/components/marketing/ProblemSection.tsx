"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, AlertTriangle, BarChart3, CheckCircle2, Zap, TrendingUp } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: Clock,
    title: "เสียเวลา Manual Track",
    desc: "ต้องเข้าดูทีละแอป บันทึกยอดลง Excel ทุกวัน ใช้เวลา 2-4 ชั่วโมงต่อสัปดาห์",
  },
  {
    icon: AlertTriangle,
    title: "ข้อมูลไม่ครบถ้วน",
    desc: "ลืม Capture ยอดช่วง Golden Hour ทำให้ขาดข้อมูลสำคัญในการวิเคราะห์",
  },
  {
    icon: BarChart3,
    title: "เปรียบเทียบข้าม Platform ยาก",
    desc: "ข้อมูลกระจายอยู่ใน 3 แอป ไม่มีภาพรวมที่ชัดเจนสำหรับทีม",
  },
];

const SOLUTIONS = [
  {
    icon: Zap,
    title: "Auto-fetch ทุก 1 ชั่วโมง",
    desc: "ดึงข้อมูลอัตโนมัติตามช่วงเวลาสำคัญ ไม่ต้องเข้าแอปเอง",
  },
  {
    icon: CheckCircle2,
    title: "Time-based Logging",
    desc: "บันทึก Snapshot อัตโนมัติที่ 1h, 5h, 24h, 48h หลังปล่อยคลิป",
  },
  {
    icon: TrendingUp,
    title: "Cross-Platform Dashboard",
    desc: "เปรียบเทียบทุก Platform ในหน้าเดียว ทีมเห็นภาพรวมได้ทันที",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-3 block">
            ปัญหาที่ทีมเจออยู่
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            เวลาที่เสียไปกับ
            <span className="text-brand-dark"> Manual Track</span>
            <br />
            ทำให้ทีมเสียโฟกัส
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            ทีม Content ส่วนใหญ่ใช้เวลาหลายชั่วโมงต่อสัปดาห์แค่คัดลอกตัวเลข Engagement ลงสเปรดชีต
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-7"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold">✕</span>
              </div>
              <h3 className="text-gray-700 font-semibold text-base">ก่อนใช้ PulseTrack</h3>
            </div>
            <div className="space-y-3">
              {PAIN_POINTS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex gap-3.5 p-4 bg-red-50 border border-red-100 rounded-xl"
                >
                  <p.icon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-800 font-semibold text-sm mb-0.5">{p.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Spreadsheet mockup */}
            <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-gray-400 text-xs mb-2.5 font-mono">engagement_tracker.xlsx</div>
              <div className="space-y-1.5">
                {["โพสต์ 1", "โพสต์ 2", "โพสต์ 3"].map((row, i) => (
                  <div key={row} className="flex gap-2">
                    <div className="bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-500 text-xs w-20">{row}</div>
                    {i === 1 ? (
                      <>
                        <div className="bg-white border border-red-200 rounded px-2.5 py-1 text-red-400 text-xs w-16">???</div>
                        <div className="bg-white border border-red-200 rounded px-2.5 py-1 text-red-400 text-xs w-14">ลืม</div>
                        <div className="bg-white border border-red-200 rounded px-2.5 py-1 text-red-400 text-xs w-14">ลืม</div>
                      </>
                    ) : (
                      <>
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-600 text-xs w-16">84.2K</div>
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-600 text-xs w-14">7.3%</div>
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-600 text-xs w-14">2.1K</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white border border-gray-200 rounded-2xl p-7"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 text-xs font-bold">✓</span>
              </div>
              <h3 className="text-gray-700 font-semibold text-base">หลังใช้ PulseTrack</h3>
            </div>
            <div className="space-y-3">
              {SOLUTIONS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl"
                >
                  <s.icon className="w-4 h-4 text-brand-dark shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-800 font-semibold text-sm mb-0.5">{s.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-emerald-700 text-xs font-semibold">Live Data — อัปเดตอัตโนมัติ</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "1h หลังปล่อย", val: "12.4K views" },
                  { label: "5h หลังปล่อย", val: "38.2K views" },
                  { label: "24h หลังปล่อย", val: "84.2K views" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{row.label}</span>
                    <span className="text-gray-800 text-xs font-semibold">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "4+", label: "ชั่วโมงที่ประหยัดต่อสัปดาห์" },
            { value: "100%", label: "ข้อมูลครบทุกช่วงเวลา" },
            { value: "3x", label: "แพลตฟอร์มในที่เดียว" },
            { value: "Real-time", label: "อัปเดตทุก 1 ชั่วโมง" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="text-2xl font-black mb-2 text-brand-dark">{stat.value}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
