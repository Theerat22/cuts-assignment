"use client";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-dark flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">
              Pulse<span className="text-brand-dark">Track</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {["ฟีเจอร์", "วิธีการทำงาน", "ตัวอย่าง", "การเชื่อมต่อ"].map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-gray-700 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-gray-400 text-xs">รองรับ</span>
            {[
              { label: "IG", bg: "bg-pink-500" },
              { label: "TT", bg: "bg-slate-800" },
              { label: "FB", bg: "bg-blue-600" },
            ].map((p) => (
              <div
                key={p.label}
                className={`w-6 h-6 rounded-lg ${p.bg} flex items-center justify-center text-white text-xs font-bold`}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-xs">
            2026 PulseTrack. สงวนลิขสิทธิ์ทั้งหมด
          </p>
          <p className="text-gray-300 text-xs">
            ข้อมูลทั้งหมดในหน้านี้เป็น Mock Data — Dev Mode
          </p>
        </div>
      </div>
    </footer>
  );
}
