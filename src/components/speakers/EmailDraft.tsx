"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Send, Copy, Check, Loader2, Link } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Speaker } from "@/lib/types";
import { formatThaiDateTime } from "@/lib/utils";

interface EmailDraftProps {
  speaker: Speaker;
  onSend?: (subject: string, body: string) => Promise<void>;
}

function generateDefaultEmail(speaker: Speaker): { subject: string; body: string } {
  const subject = `เรียนเชิญเป็นวิทยากรในงานสัมมนา - ${speaker.name}`;
  const body = `เรียน ${speaker.name}

สวัสดีครับ/ค่ะ ในนามของทีมฝ่าย Activity ขอเรียนเชิญท่านเป็นวิทยากรในงานสัมมนาของเรา

รายละเอียดงาน:
- วันและเวลา: ${formatThaiDateTime(speaker.seminar_date, speaker.seminar_time)}
${speaker.seminar_location ? `- สถานที่: ${speaker.seminar_location}` : ""}
- Deadline ส่ง Agenda: ${new Date(speaker.agenda_deadline).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}

ทางเราได้จัดเตรียม Portal สำหรับท่านโดยเฉพาะ ซึ่งท่านสามารถ:
- ดูรายละเอียดงานและตารางเวลา
- อัปโหลดไฟล์ Agenda และ Slide
- ส่งคำถามหรือ Ticket ถึงทีมงาน
- เพิ่มนัดหมายเข้า Calendar ของท่าน

กรุณาตอบรับภายใน 3 วัน เพื่อให้ทีมงานสามารถดำเนินการต่อได้

หากมีข้อสงสัยประการใด กรุณาติดต่อทีมงานผ่าน Portal หรือตอบกลับอีเมลนี้ได้เลยครับ/ค่ะ

ขอแสดงความนับถือ
ทีมฝ่าย Activity`;
  return { subject, body };
}

export function EmailDraft({ speaker, onSend }: EmailDraftProps) {
  const defaultEmail = generateDefaultEmail(speaker);
  const [subject, setSubject] = useState(defaultEmail.subject);
  const [body, setBody] = useState(defaultEmail.body);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAiImprove = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          currentEmail: body,
          speakerName: speaker.name,
        }),
      });
      const data = await response.json();
      if (data.improved) {
        setBody(data.improved);
        setAiPrompt("");
        setShowAiPanel(false);
      }
    } catch (error) {
      console.error("AI improve error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: speaker.email,
          subject,
          body,
          speakerId: speaker.id,
          portalToken: speaker.portal_token,
        }),
      });
      setSent(true);
      onSend?.(subject, body);
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* To field */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
        <Mail className="h-4 w-4 text-brand-dark shrink-0" />
        <div>
          <span className="text-xs text-gray-500">ถึง:</span>
          <span className="ml-2 text-sm font-medium text-gray-800">{speaker.name}</span>
          <span className="ml-2 text-xs text-gray-400">{"<"}{speaker.email}{">"}</span>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1.5">หัวเรื่อง</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white"
        />
      </div>

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-gray-600">เนื้อหาอีเมล</label>
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-dark text-white text-xs font-medium hover:bg-brand-deeper transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ปรับด้วย AI
          </button>
        </div>

        {/* AI Panel */}
        {showAiPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-4 bg-brand-muted rounded-xl border border-brand-edge"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-brand-dark" />
              <p className="text-sm font-medium text-brand-dark">Gemini AI ช่วยปรับอีเมล</p>
            </div>
            <p className="text-xs text-brand-dark/70 mb-3">บอกให้ AI ช่วยปรับแต่งอีเมล เช่น &quot;ทำให้เป็นทางการมากขึ้น&quot; หรือ &quot;เพิ่มความอบอุ่น&quot;</p>
            <div className="flex gap-2">
              <input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="เช่น: ทำให้สั้นกระชับขึ้น, เพิ่มความเป็นมิตร..."
                className="flex-1 rounded-lg border border-brand-edge px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
                onKeyDown={(e) => e.key === "Enter" && handleAiImprove()}
              />
              <Button
                onClick={handleAiImprove}
                loading={isAiLoading}
                size="sm"
                className="bg-brand-dark hover:bg-brand-deeper text-white"
              >
                ปรับ
              </Button>
            </div>
          </motion.div>
        )}

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none bg-white leading-relaxed"
        />
      </div>

      {/* Portal link notice */}
      <div className="p-3 bg-brand-muted rounded-xl border border-brand-edge">
        <p className="text-xs text-brand-dark">
          <Link className="h-3 w-3 shrink-0 inline-block mr-1.5 align-[-1px]" />ระบบจะแนบลิงก์ Portal ส่วนตัวของวิทยากรไปพร้อมกับอีเมลโดยอัตโนมัติ
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSend}
          loading={isSending}
          disabled={sent}
          className={sent ? "bg-green-600 hover:bg-green-600" : ""}
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" /> ส่งแล้ว
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> ส่งอีเมล
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" /> คัดลอกแล้ว
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> คัดลอก
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={() => { setBody(defaultEmail.body); setSubject(defaultEmail.subject); setSent(false); }}>
          รีเซ็ต
        </Button>
      </div>
    </div>
  );
}
