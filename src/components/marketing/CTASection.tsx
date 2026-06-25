"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Activity } from "lucide-react";

const PERKS = [
  "ฟรีตลอดช่วง Beta",
  "Setup ภายใน 5 นาที",
  "ไม่ต้องมีความรู้ด้านเทคนิค",
  "ข้อมูล Real-time ทันที",
];

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center shadow-sm">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            หยุดเสียเวลา
            <br />
            <span className="text-brand-dark">Manual Track</span>
            <br />
            ได้แล้ววันนี้
          </h2>

          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            ให้ระบบดึงข้อมูล Engagement แบบอัตโนมัติ
            ทีมมีเวลาไปทำงานที่สำคัญกว่าการนับยอดทีละโพสต์
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href="#"
              className="flex items-center gap-2 bg-brand-dark hover:bg-brand-deeper text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-sm text-base"
            >
              เริ่มใช้งานฟรี
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#preview"
              className="text-gray-500 hover:text-gray-800 font-semibold px-8 py-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors text-base"
            >
              ดู Demo ก่อน
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-gray-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
