"use client";
import { motion } from "framer-motion";
import { Speaker, SpeakerStatus } from "@/lib/types";

interface StatsBarProps {
  speakers: Speaker[];
}

const STAGES: {
  status: SpeakerStatus;
  label: string;
  dot: string;
  text: string;
}[] = [
  { status: "pending",          label: "รอดำเนินการ", dot: "bg-amber-400",   text: "text-amber-700"   },
  { status: "contacted",        label: "ติดต่อแล้ว",  dot: "bg-sky-400",     text: "text-sky-700"     },
  { status: "confirmed",        label: "ยืนยันแล้ว",  dot: "bg-emerald-400", text: "text-emerald-700" },
  { status: "agenda_submitted", label: "ส่ง Agenda",  dot: "bg-violet-400",  text: "text-violet-700"  },
  { status: "completed",        label: "เสร็จสิ้น",   dot: "bg-gray-400",    text: "text-gray-600"    },
];

export function StatsBar({ speakers }: StatsBarProps) {
  const total = speakers.length;
  const cancelled = speakers.filter((s) => s.status === "cancelled").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      aria-label="สรุปสถานะวิทยากร"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Pipeline stages */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {STAGES.map((stage, i) => {
            const count = speakers.filter((s) => s.status === stage.status).length;
            return (
              <div key={stage.status} className="flex items-center">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${stage.dot}`} />
                  <span className={`text-xs ${stage.text}`}>{stage.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${stage.text}`}>{count}</span>
                </div>
                {i < STAGES.length - 1 && (
                  <span className="text-gray-200 text-sm select-none mx-0.5" aria-hidden>›</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          {cancelled > 0 && (
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              ยกเลิก {cancelled}
            </span>
          )}
          <span className="text-gray-400">
            รวม <span className="font-semibold text-gray-600 tabular-nums">{total}</span> คน
          </span>
        </div>
      </div>
    </motion.div>
  );
}
