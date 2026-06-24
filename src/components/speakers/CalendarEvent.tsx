"use client";
import { useState } from "react";
import { Calendar, MapPin, Clock, Users, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Speaker } from "@/lib/types";
import { formatThaiDateTime } from "@/lib/utils";

interface CalendarEventProps {
  speaker: Speaker;
}

export function CalendarEvent({ speaker }: CalendarEventProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);

  const handleCreateEvent = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `วิทยากร: ${speaker.name}`,
          description: `วิทยากรในงานสัมมนา\nชื่อ: ${speaker.name}\nอีเมล: ${speaker.email}\nองค์กร: ${speaker.organization || "-"}`,
          date: speaker.seminar_date,
          time: speaker.seminar_time,
          location: speaker.seminar_location || "",
          attendees: [speaker.email],
        }),
      });
      const data = await response.json();
      setCreated(true);
      setCalendarUrl(data.htmlLink || null);
    } catch (error) {
      console.error("Calendar error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Generate Google Calendar URL for manual add
  const generateGoogleCalUrl = () => {
    const startDate = new Date(`${speaker.seminar_date}T${speaker.seminar_time}:00`);
    const endDate = speaker.seminar_end_time
      ? new Date(`${speaker.seminar_date}T${speaker.seminar_end_time}:00`)
      : new Date(startDate.getTime() + 60 * 60 * 1000);
    const format = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `วิทยากร: ${speaker.name}`,
      dates: `${format(startDate)}/${format(endDate)}`,
      details: `วิทยากรในงานสัมมนา\nอีเมล: ${speaker.email}`,
      location: speaker.seminar_location || "",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <div className="p-5 bg-brand-muted rounded-2xl border border-brand-edge">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">กำหนดการวิทยากร</p>
            <p className="text-xs text-gray-500">จะเพิ่มลงใน Google Calendar</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 text-brand-dark shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{speaker.name}</p>
              {speaker.organization && (
                <p className="text-xs text-gray-500">{speaker.organization}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-brand-dark shrink-0" />
            <p className="text-gray-700">
              {formatThaiDateTime(speaker.seminar_date, speaker.seminar_time)}
              {speaker.seminar_end_time && (
                <span className="text-gray-500"> – {speaker.seminar_end_time} น.</span>
              )}
            </p>
          </div>

          {speaker.seminar_location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-brand-dark shrink-0" />
              <p className="text-gray-700">{speaker.seminar_location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Deadline Event */}
      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
        <p className="text-sm font-medium text-orange-800 mb-1">Agenda Deadline</p>
        <p className="text-xs text-orange-600">
          {new Date(speaker.agenda_deadline).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Action Buttons */}
      {created ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700 font-medium">เพิ่มลง Calendar เรียบร้อยแล้ว!</p>
          </div>
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-edge rounded-xl text-sm text-brand-dark hover:bg-brand-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              ดูใน Google Calendar
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <a
            href={generateGoogleCalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            เปิดบน Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}
