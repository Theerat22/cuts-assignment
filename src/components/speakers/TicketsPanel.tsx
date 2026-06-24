"use client";
import { useState, useEffect, useCallback } from "react";
import { MessageSquare, ChevronDown, Send, CheckCircle, RefreshCw } from "lucide-react";
import { Ticket, TeamMember } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface TicketsPanelProps {
  speakerId: string;
  assignedTo?: string;
  onCountChange?: (count: number) => void;
  teamMembers: TeamMember[];
}

const STATUS_LABEL: Record<Ticket["status"], string> = {
  open:    "รอตอบ",
  replied: "ตอบแล้ว",
  closed:  "ปิดแล้ว",
};

const STATUS_COLOR: Record<Ticket["status"], string> = {
  open:    "bg-amber-100 text-amber-700",
  replied: "bg-sky-100 text-sky-700",
  closed:  "bg-gray-100 text-gray-500",
};

export function TicketsPanel({ speakerId, assignedTo, onCountChange, teamMembers }: TicketsPanelProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});

  const replierName = assignedTo
    ? (teamMembers.find((m) => m.id === assignedTo)?.name ?? "ทีมงาน")
    : "ทีมงาน";

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets?speakerId=${speakerId}`);
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
        onCountChange?.(data.tickets.filter((t: Ticket) => t.status === "open").length);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  }, [speakerId, onCountChange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleReply = async (ticketId: string) => {
    const message = replyText[ticketId]?.trim();
    if (!message) return;
    setSending((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await fetch(`/api/tickets/${ticketId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, from_role: "team", author_name: replierName }),
      });
      setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
      await refresh();
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleClose = async (ticketId: string) => {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      await refresh();
    } catch (err) {
      console.error("Failed to close ticket:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {tickets.length === 0
            ? "ยังไม่มี Ticket"
            : `${tickets.length} Ticket · ${tickets.filter((t) => t.status === "open").length} รอตอบ`}
        </p>
        <button
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-dark transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          รีเฟรช
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <MessageSquare className="h-8 w-8 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">ยังไม่มี Ticket จากวิทยากร</p>
          <p className="text-xs text-gray-400 mt-1">เมื่อวิทยากรส่งคำถาม จะปรากฏที่นี่</p>
        </div>
      ) : (
        tickets.map((ticket) => {
          const isOpen = openId === ticket.id;
          return (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Row header */}
              <button
                onClick={() => setOpenId(isOpen ? null : ticket.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/80 transition-colors text-left"
              >
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[ticket.status]}`}
                >
                  {STATUS_LABEL[ticket.status]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ticket.created_at).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    {ticket.replies.length > 0 &&
                      ` · ${ticket.replies.length} ข้อความ`}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Thread */}
              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                  {/* Speaker's original message */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-semibold text-gray-500">
                      V
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">วิทยากร</p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {ticket.message}
                      </p>
                    </div>
                  </div>

                  {/* Reply thread */}
                  {ticket.replies.map((reply) => {
                    const isTeam = reply.from === "team";
                    return (
                      <div
                        key={reply.id}
                        className={`flex gap-3 ${isTeam ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            isTeam ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isTeam ? reply.author_name[0] : "V"}
                        </div>
                        <div
                          className={`flex-1 rounded-xl px-4 py-3 ${
                            isTeam
                              ? "bg-brand-muted rounded-tr-sm"
                              : "bg-gray-50 rounded-tl-sm"
                          }`}
                        >
                          <p className="text-xs font-medium text-gray-500 mb-1.5">
                            {isTeam ? reply.author_name : "วิทยากร"} ·{" "}
                            {new Date(reply.created_at).toLocaleString("th-TH", {
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {reply.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Reply input */}
                  {ticket.status !== "closed" && (
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <Textarea
                        placeholder={`ตอบกลับในนาม ${replierName}… (Ctrl+Enter เพื่อส่ง)`}
                        value={replyText[ticket.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [ticket.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            handleReply(ticket.id);
                          }
                        }}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleReply(ticket.id)}
                          loading={sending[ticket.id]}
                          disabled={!replyText[ticket.id]?.trim()}
                          size="sm"
                          className="flex-1"
                        >
                          <Send className="h-3.5 w-3.5" />
                          ส่งคำตอบ
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleClose(ticket.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          ปิด Ticket
                        </Button>
                      </div>
                    </div>
                  )}

                  {ticket.status === "closed" && (
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-gray-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <p className="text-xs">Ticket ปิดแล้ว</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
