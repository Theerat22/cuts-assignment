import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SpeakerStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusLabel(status: SpeakerStatus): string {
  const labels: Record<SpeakerStatus, string> = {
    pending: "รอดำเนินการ",
    contacted: "ติดต่อแล้ว",
    confirmed: "ยืนยันแล้ว",
    agenda_submitted: "ส่ง Agenda แล้ว",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
  };
  return labels[status];
}

export function getStatusColor(status: SpeakerStatus): string {
  const colors: Record<SpeakerStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-blue-100 text-blue-800 border-blue-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    agenda_submitted: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status];
}

export function getStatusDot(status: SpeakerStatus): string {
  const colors: Record<SpeakerStatus, string> = {
    pending: "bg-yellow-400",
    contacted: "bg-blue-400",
    confirmed: "bg-green-400",
    agenda_submitted: "bg-purple-400",
    completed: "bg-gray-400",
    cancelled: "bg-red-400",
  };
  return colors[status];
}

export function formatThaiDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatThaiDateTime(dateStr: string, timeStr: string): string {
  const formattedDate = formatThaiDate(dateStr);
  return `${formattedDate} เวลา ${timeStr} น.`;
}

export function isDeadlineNear(deadline: string, daysThreshold = 3): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays >= 0 && diffDays <= daysThreshold;
}

export function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function generatePortalToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getStatusCardBorder(status: SpeakerStatus): string {
  const borders: Record<SpeakerStatus, string> = {
    pending: "border-amber-200",
    contacted: "border-sky-200",
    confirmed: "border-emerald-200",
    agenda_submitted: "border-violet-200",
    completed: "border-gray-200",
    cancelled: "border-rose-200",
  };
  return borders[status];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
