"use client";
import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, Upload, MessageSquare,
  CheckCircle, ChevronDown, FileText, User, ExternalLink
} from "lucide-react";
import { AgendaUpload } from "@/components/portal/AgendaUpload";
import { TicketForm } from "@/components/portal/TicketForm";
import { formatThaiDate } from "@/lib/utils";
import { Speaker } from "@/lib/types";

interface PortalPageProps {
  params: Promise<{ token: string }>;
}

export default function PortalPage({ params }: PortalPageProps) {
  const { token } = use(params);
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeSection, setActiveSection] = useState<string | null>("info");
  const [calendarAdded, setCalendarAdded] = useState(false);

  useEffect(() => {
    const fetchSpeaker = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/portal/${token}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (data.speaker) {
          setSpeaker(data.speaker);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeaker();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !speaker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="h-7 w-7 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-gray-500 text-sm">ลิงก์นี้ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาติดต่อทีมงาน</p>
        </div>
      </div>
    );
  }

  const initials = speaker.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const generateGoogleCalUrl = () => {
    const startDate = new Date(`${speaker.seminar_date}T${speaker.seminar_time}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: `งานสัมมนา - บรรยายโดย ${speaker.name}`,
      dates: `${fmt(startDate)}/${fmt(endDate)}`,
      details: `งานสัมมนา\nวิทยากร: ${speaker.name}${speaker.organization ? `\nองค์กร: ${speaker.organization}` : ""}`,
      location: speaker.seminar_location || "",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  const sections = [
    { id: "info",   label: "ข้อมูลงาน",        icon: Calendar },
    { id: "agenda", label: "ส่ง Agenda / Slide", icon: Upload },
    { id: "ticket", label: "ถามคำถามทีมงาน",   icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-brand-dark">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
          <p className="text-white/50 text-xs font-medium mb-6 tracking-wide">
            ทีมฝ่าย Activity · Speaker Portal
          </p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl shrink-0 select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight" style={{ textWrap: "balance" }}>
                {speaker.name}
              </h1>
              {speaker.title && (
                <p className="text-white/70 text-sm mt-0.5 truncate">{speaker.title}</p>
              )}
              {speaker.organization && (
                <p className="text-white/55 text-xs mt-0.5 truncate">{speaker.organization}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Event summary bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3.5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-brand-dark shrink-0" />
              {formatThaiDate(speaker.seminar_date)} · {speaker.seminar_time}{speaker.seminar_end_time ? ` – ${speaker.seminar_end_time}` : ""} น.
            </span>
            {speaker.seminar_location && (
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-brand-dark shrink-0" />
                {speaker.seminar_location}
              </span>
            )}
            <div className="sm:ml-auto">
              {calendarAdded ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  เพิ่มใน Calendar แล้ว
                </span>
              ) : (
                <a
                  href={generateGoogleCalUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalendarAdded(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-dark hover:text-brand-deeper transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  เพิ่มใน Google Calendar
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-2.5">
        {sections.map((section, i) => {
          const isOpen = activeSection === section.id;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveSection(isOpen ? null : section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/80 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isOpen ? "bg-brand-dark" : "bg-brand-muted"}`}>
                    <section.icon className={`h-4 w-4 ${isOpen ? "text-white" : "text-brand-dark"}`} />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{section.label}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      {section.id === "info" && (
                        <div className="space-y-2">
                          {[
                            { icon: Calendar, label: "วันที่",              value: formatThaiDate(speaker.seminar_date) },
                            { icon: Clock,    label: "เวลา",                value: speaker.seminar_end_time ? `${speaker.seminar_time} – ${speaker.seminar_end_time} น.` : `${speaker.seminar_time} น.` },
                            { icon: MapPin,   label: "สถานที่",             value: speaker.seminar_location || "จะแจ้งให้ทราบภายหลัง" },
                            { icon: FileText, label: "Deadline ส่ง Agenda", value: formatThaiDate(speaker.agenda_deadline) },
                          ].map((item) => (
                            <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                              <item.icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                              <div className="flex-1 flex items-baseline justify-between gap-4 min-w-0">
                                <span className="text-xs text-gray-500 shrink-0">{item.label}</span>
                                <span className="text-sm font-medium text-gray-900 text-right">{item.value}</span>
                              </div>
                            </div>
                          ))}
                          {speaker.notes && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                              <p className="text-xs font-medium text-amber-700 mb-1">หมายเหตุจากทีมงาน</p>
                              <p className="text-sm text-amber-800" style={{ textWrap: "pretty" }}>{speaker.notes}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "agenda" && (
                        <AgendaUpload
                          speakerId={speaker.id}
                          speakerToken={token}
                          deadline={speaker.agenda_deadline}
                        />
                      )}

                      {section.id === "ticket" && (
                        <TicketForm speakerId={speaker.id} speakerToken={token} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-gray-400 text-xs py-8 px-4"
      >
        Speaker Management System · ทีมฝ่าย Activity
      </motion.p>
    </div>
  );
}
