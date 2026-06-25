"use client";
import { motion } from "framer-motion";
import { Calendar, Mail, Clock, MapPin } from "lucide-react";
import { Speaker } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import {
  getStatusLabel,
  getStatusColor,
  getStatusDot,
  formatThaiDate,
  getInitials,
  isDeadlineNear,
  isDeadlinePassed,
} from "@/lib/utils";
import { mockTeamMembers } from "@/lib/mock-data";

interface SpeakerCardProps {
  speaker: Speaker;
  onClick: () => void;
}

export function SpeakerCard({ speaker, onClick }: SpeakerCardProps) {
  const assignee = mockTeamMembers.find((m) => m.id === speaker.assigned_to);
  const deadlineNear = isDeadlineNear(speaker.agenda_deadline);
  const deadlinePassed = isDeadlinePassed(speaker.agenda_deadline);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {speaker.avatar_url ? (
              <img
                src={speaker.avatar_url}
                alt={speaker.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-brand-dark flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                {getInitials(speaker.name)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                {speaker.name}
              </h3>
              {speaker.title && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{speaker.title}</p>
              )}
              {speaker.organization && (
                <p className="text-xs text-brand-dark truncate mt-0.5 font-medium">{speaker.organization}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <Badge className={getStatusColor(speaker.status)}>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(speaker.status)}`} />
            {getStatusLabel(speaker.status)}
          </Badge>
        </div>

        {/* Info rows */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{formatThaiDate(speaker.seminar_date)} · {speaker.seminar_time}{speaker.seminar_end_time ? ` – ${speaker.seminar_end_time}` : ""} น.</span>
          </div>

          {speaker.seminar_location && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{speaker.seminar_location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <Clock
              className={`h-3.5 w-3.5 shrink-0 ${
                deadlinePassed ? "text-red-400" : deadlineNear ? "text-orange-400" : "text-gray-400"
              }`}
            />
            <span
              className={
                deadlinePassed
                  ? "text-red-600 font-medium"
                  : deadlineNear
                  ? "text-orange-600 font-medium"
                  : "text-gray-600"
              }
            >
              กำหนดส่ง: {formatThaiDate(speaker.agenda_deadline)}
              {deadlinePassed && " (เกินกำหนด)"}
              {!deadlinePassed && deadlineNear && " (ใกล้ถึง)"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{speaker.email}</span>
          </div>
        </div>

        {/* Footer */}
        {assignee && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-muted flex items-center justify-center text-brand-dark text-xs font-semibold">
              {getInitials(assignee.name)}
            </div>
            <span className="text-xs text-gray-500">รับผิดชอบโดย {assignee.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
