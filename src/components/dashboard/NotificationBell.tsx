"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Mail, FileText, Ticket, Clock, CheckCircle, X } from "lucide-react";
import { Notification } from "@/lib/types";
import { formatThaiDate } from "@/lib/utils";

const notifIcons = {
  email_sent: Mail,
  ticket_opened: Ticket,
  agenda_uploaded: FileText,
  status_changed: CheckCircle,
  deadline_approaching: Clock,
};

const notifColors = {
  email_sent: "text-blue-500 bg-blue-50",
  ticket_opened: "text-orange-500 bg-orange-50",
  agenda_uploaded: "text-purple-500 bg-purple-50",
  status_changed: "text-green-500 bg-green-50",
  deadline_approaching: "text-red-500 bg-red-50",
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hours / 24)} วันที่แล้ว`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-brand-dark" />
                  <h3 className="font-semibold text-gray-900 text-sm">การแจ้งเตือน</h3>
                  {unread > 0 && (
                    <span className="px-2 py-0.5 bg-brand-muted text-brand-dark rounded-full text-xs font-medium">
                      {unread} ใหม่
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-brand-dark hover:text-brand-deeper font-medium"
                  >
                    อ่านทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    ไม่มีการแจ้งเตือน
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notifIcons[notif.type];
                    const colorClass = notifColors[notif.type];
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!notif.read ? "bg-brand-muted/40" : ""}`}
                      >
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                        </div>
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="shrink-0 p-1 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
