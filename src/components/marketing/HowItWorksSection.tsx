"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, BarChart3, Download, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Link2,
    title: "เชื่อมต่อ Platform",
    desc: "เชื่อมต่อ Instagram, TikTok และ Facebook ผ่าน Official API ด้วยการ Authorize เพียงครั้งเดียว ระบบจดจำ Token โดยอัตโนมัติ",
    iconBg: "bg-brand-dark",
    details: ["OAuth 2.0 Secure Login", "Token Auto-refresh", "Multi-account Support"],
  },
  {
    step: "02",
    icon: BarChart3,
    title: "ระบบดึงข้อมูลอัตโนมัติ",
    desc: "PulseTrack Fetch ข้อมูล Engagement ทุก 1 ชั่วโมง และบันทึก Snapshot ที่ช่วงเวลาสำคัญ 1h, 5h, 24h, 48h หลังปล่อยคลิป",
    iconBg: "bg-blue-600",
    details: ["Auto-fetch ทุก 1h", "Time-based Snapshots", "Historical Data Storage"],
  },
  {
    step: "03",
    icon: Download,
    title: "วิเคราะห์และ Export",
    desc: "ดู Dashboard ภาพรวม เจาะ Analysis รายคลิป และ Export ข้อมูลไปยัง Google Sheets ได้ในคลิกเดียว",
    iconBg: "bg-emerald-600",
    details: ["Google Sheets Export", "Cross-platform Compare", "Custom Date Range"],
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-brand-dark text-xs font-semibold tracking-widest uppercase mb-3 block">
            วิธีการทำงาน
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            เริ่มต้นได้ใน
            <span className="text-emerald-600"> 3 ขั้นตอน</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            ไม่ต้องมีความรู้ด้านเทคนิค Setup ครั้งเดียว ระบบทำงานให้อัตโนมัติตลอด 24/7
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[33%] right-[33%] h-px bg-gray-200" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-sm`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <span className="text-gray-500 text-xs font-bold">{step.step}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex-1 hover:shadow-sm transition-shadow duration-300">
                <h3 className="text-gray-900 font-bold text-lg mb-2.5">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{step.desc}</p>

                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${step.iconBg}`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
