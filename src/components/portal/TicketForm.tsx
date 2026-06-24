"use client";
import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, CheckCircle, ChevronDown, ChevronUp, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Ticket } from "@/lib/types";

interface TicketFormProps {
  speakerId: string;
  speakerToken: string;
}

const STATUS_LABEL: Record<Ticket["status"], string> = {
  open:    "รอตอบ",
  replied: "ทีมตอบแล้ว",
  closed:  "ปิดแล้ว",
};

const STATUS_COLOR: Record<Ticket["status"], string> = {
  open:    "bg-amber-100 text-amber-700",
  replied: "bg-emerald-100 text-emerald-700",
  closed:  "bg-gray-100 text-gray-500",
};

export function TicketForm({ speakerId, speakerToken }: TicketFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets?speakerId=${speakerId}&token=${speakerToken}`);
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  }, [speakerId, speakerToken]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speakerId, speakerToken, subject, message }),
      });
      if (res.ok) {
        setSubject("");
        setMessage("");
        setSubmitted(true);
        setShowForm(false);
        await refresh();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">ส่ง Ticket เรียบร้อยแล้ว!</p>
            <p className="text-xs text-green-600 mt-0.5">ทีมงานจะตอบกลับเร็วๆ นี้</p>
          </div>
        </div>
      )}

      {/* Previous tickets */}
      {tickets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">คำถามของฉัน ({tickets.length})</p>
            <button
              onClick={refresh}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-dark transition-colors"
              title="ระบบตรวจสอบคำตอบใหม่ทุก 30 วินาทีโดยอัตโนมัติ"
            >
              <RefreshCw className="h-3 w-3" />
              {lastUpdated
                ? `อัปเดต ${lastUpdated.toLocaleTimeString("th-TH", { timeStyle: "short" })}`
                : "รีเฟรช"}
            </button>
          </div>

          {tickets.map((ticket) => {
            const isOpen = openId === ticket.id;
            const hasNewReply = ticket.status === "replied";
            return (
              <div
                key={ticket.id}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  hasNewReply ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100 bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : ticket.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/5 transition-colors"
                >
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[ticket.status]}`}>
                    {STATUS_LABEL[ticket.status]}
                  </span>
                  <p className="flex-1 text-sm font-medium text-gray-800 truncate">{ticket.subject}</p>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  }
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    {/* Speaker's original message */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-semibold text-gray-500">ฉ</div>
                      <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(ticket.created_at).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed">{ticket.message}</p>
                      </div>
                    </div>

                    {/* Team replies */}
                    {ticket.replies.map((reply) => {
                      const isTeam = reply.from === "team";
                      return (
                        <div key={reply.id} className={`flex gap-3 ${isTeam ? "flex-row-reverse" : ""}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            isTeam ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            {isTeam ? reply.author_name[0] : "ฉ"}
                          </div>
                          <div className={`flex-1 rounded-xl px-4 py-3 ${
                            isTeam ? "bg-brand-muted rounded-tr-sm" : "bg-gray-50 rounded-tl-sm"
                          }`}>
                            <p className="text-xs text-gray-500 mb-1">
                              {isTeam ? `ทีมงาน (${reply.author_name})` : "คุณ"} ·{" "}
                              {new Date(reply.created_at).toLocaleString("th-TH", { timeStyle: "short" })}
                            </p>
                            <p className="text-sm text-gray-800 leading-relaxed">{reply.message}</p>
                          </div>
                        </div>
                      );
                    })}

                    {ticket.replies.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">ทีมงานยังไม่ได้ตอบกลับ</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New ticket form */}
      {showForm ? (
        <div className="space-y-3">
          {tickets.length > 0 && (
            <p className="text-sm font-semibold text-gray-800">ส่งคำถามใหม่</p>
          )}
          <Input
            label="หัวเรื่อง"
            placeholder="เช่น สอบถามเรื่องการเดินทาง, ขอข้อมูลเพิ่มเติม"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            icon={<Tag className="h-4 w-4" />}
          />
          <Textarea
            label="รายละเอียด"
            placeholder="อธิบายคำถามหรือข้อสงสัยของท่าน..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!subject.trim() || !message.trim()}
              className="flex-1"
            >
              <Send className="h-4 w-4" />
              ส่ง Ticket
            </Button>
            {tickets.length > 0 && (
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                ยกเลิก
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setShowForm(true)} className="w-full">
          <MessageSquare className="h-4 w-4" />
          ส่งคำถามใหม่
        </Button>
      )}
    </div>
  );
}
