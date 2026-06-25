import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface CalendarData {
  title: string;
  date: string;          // "YYYY-MM-DD"
  startTime: string;     // "HH:MM" 24h
  endTime?: string;      // "HH:MM" 24h, optional
  location?: string;
}

function toIcsDateTime(date: string, time: string): string {
  // "2026-06-25" + "09:00" → "20260625T090000"
  return date.replace(/-/g, "") + "T" + time.replace(":", "") + "00";
}

function buildIcs(data: CalendarData, description: string, uid: string): string {
  const dtStart = toIcsDateTime(data.date, data.startTime);

  let endTime = data.endTime;
  if (!endTime) {
    // Default: 1 hour after start
    const [h, m] = data.startTime.split(":").map(Number);
    const endH = (h + 1) % 24;
    endTime = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const dtEnd = toIcsDateTime(data.date, endTime);

  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Speaker Management//Activity Team//TH",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}Z`,
    `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
    `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
    `SUMMARY:งานสัมมนา — ${data.title}`,
    data.location ? `LOCATION:${data.location}` : "",
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, speakerId, portalToken, calendarData } =
      await req.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalUrl = `${appUrl}/portal/${portalToken}`;

    const plainBody = `${body}\n\n---\nPortal ส่วนตัวของท่าน: ${portalUrl}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions: Parameters<typeof transporter.sendMail>[0] = {
      from: `"ทีมฝ่าย Activity" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text: plainBody,
    };

    if (calendarData) {
      const uid = `${speakerId ?? "spk"}-${Date.now()}@speaker-management`;
      const icsContent = buildIcs(calendarData, plainBody, uid);
      mailOptions.attachments = [
        {
          filename: "seminar-invite.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
