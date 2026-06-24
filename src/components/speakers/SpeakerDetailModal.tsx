"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Calendar, Globe, FileText, MessageSquare,
  Edit2, ChevronRight, Copy, Check, User, Building,
  Clock, AlarmClock, MapPin, X, Save, Briefcase, AlertTriangle,
  TicketCheck
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { EmailDraft } from "./EmailDraft";
import { CalendarEvent } from "./CalendarEvent";
import { TicketsPanel } from "./TicketsPanel";
import { AgendaPanel } from "./AgendaPanel";
import { Speaker, TeamMember } from "@/lib/types";
import {
  getStatusLabel, getStatusColor, getStatusDot,
  formatThaiDate, getInitials
} from "@/lib/utils";

type Tab = "overview" | "email" | "calendar" | "portal" | "tickets" | "agenda";

interface SpeakerDetailModalProps {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: Speaker["status"]) => void;
  onUpdate?: (speaker: Speaker) => void;
  teamMembers: TeamMember[];
}

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview",  label: "ภาพรวม",    icon: User },
  { id: "email",     label: "ร่างอีเมล",  icon: Mail },
  { id: "calendar",  label: "ปฏิทิน",    icon: Calendar },
  { id: "portal",    label: "Portal",     icon: Globe },
  { id: "tickets",   label: "Ticket",     icon: TicketCheck },
  { id: "agenda",    label: "Agenda",     icon: FileText },
];

type EditForm = {
  name: string;
  email: string;
  title: string;
  organization: string;
  seminar_date: string;
  seminar_time: string;
  seminar_end_time: string;
  seminar_location: string;
  agenda_deadline: string;
  assigned_to: string;
  notes: string;
};

const FORWARD_STATUSES: Speaker["status"][] = [
  "pending", "contacted", "confirmed", "agenda_submitted", "completed",
];

export function SpeakerDetailModal({
  speaker,
  isOpen,
  onClose,
  onStatusChange,
  onUpdate,
  teamMembers,
}: SpeakerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successStatus, setSuccessStatus] = useState<Speaker["status"] | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "", email: "", title: "", organization: "",
    seminar_date: "", seminar_time: "", seminar_end_time: "", seminar_location: "",
    agenda_deadline: "", assigned_to: "", notes: "",
  });
  const [errors, setErrors] = useState<Partial<EditForm>>({});

  useEffect(() => {
    if (speaker) {
      setEditForm({
        name: speaker.name,
        email: speaker.email,
        title: speaker.title || "",
        organization: speaker.organization || "",
        seminar_date: speaker.seminar_date,
        seminar_time: speaker.seminar_time,
        seminar_end_time: speaker.seminar_end_time || "",
        seminar_location: speaker.seminar_location || "",
        agenda_deadline: speaker.agenda_deadline,
        assigned_to: speaker.assigned_to || "",
        notes: speaker.notes || "",
      });
    }
    setIsEditing(false);
    setErrors({});
    setConfirmCancel(false);
  }, [speaker]);

  if (!speaker) return null;

  const assignee = teamMembers.find((m) => m.id === speaker.assigned_to);
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal/${speaker.portal_token}`;

  const copyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (status: Speaker["status"]) => {
    onStatusChange?.(speaker.id, status);
    setSuccessStatus(status);
    setTimeout(() => setSuccessStatus(null), 1800);
    setConfirmCancel(false);
  };

  const f = (field: keyof EditForm, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Partial<EditForm> = {};
    if (!editForm.name.trim()) e.name = "กรุณากรอกชื่อวิทยากร";
    if (!editForm.email.trim()) e.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(editForm.email)) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!editForm.seminar_date) e.seminar_date = "กรุณาเลือกวันสัมมนา";
    if (!editForm.seminar_time) e.seminar_time = "กรุณาระบุเวลา";
    if (!editForm.agenda_deadline) e.agenda_deadline = "กรุณาเลือก Deadline";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const updated: Speaker = {
      ...speaker,
      ...editForm,
      updated_at: new Date().toISOString(),
    };
    onUpdate?.(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: speaker.name,
      email: speaker.email,
      title: speaker.title || "",
      organization: speaker.organization || "",
      seminar_date: speaker.seminar_date,
      seminar_time: speaker.seminar_time,
      seminar_end_time: speaker.seminar_end_time || "",
      seminar_location: speaker.seminar_location || "",
      agenda_deadline: speaker.agenda_deadline,
      assigned_to: speaker.assigned_to || "",
      notes: speaker.notes || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      {/* Header */}
      <div className="px-6 py-5 bg-brand-dark">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
              {getInitials(isEditing ? editForm.name || speaker.name : speaker.name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight">
                {isEditing ? editForm.name || speaker.name : speaker.name}
              </h2>
              {(isEditing ? editForm.title : speaker.title) && (
                <p className="text-white/70 text-sm truncate">
                  {isEditing ? editForm.title : speaker.title}
                </p>
              )}
              {(isEditing ? editForm.organization : speaker.organization) && (
                <p className="text-white/60 text-xs mt-0.5 truncate">
                  {isEditing ? editForm.organization : speaker.organization}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!isEditing && (
              <button
                onClick={() => { setActiveTab("overview"); setIsEditing(true); }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                title="แก้ไขข้อมูล"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {/* X is exclusively for closing the modal */}
            {!isEditing && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                aria-label="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Selector — forward flow only */}
        {!isEditing && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white/60 text-xs">สถานะ:</span>
              {FORWARD_STATUSES.map((s) => {
                const isActive = speaker.status === s;
                const justChanged = successStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    aria-pressed={isActive}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isActive
                        ? "bg-white text-brand-dark border-white shadow-sm"
                        : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {justChanged && isActive ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> {getStatusLabel(s)}
                      </span>
                    ) : (
                      getStatusLabel(s)
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cancellation zone — separated from forward flow */}
            {speaker.status !== "cancelled" && (
              <div className="flex items-center gap-2">
                {!confirmCancel ? (
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="text-xs text-white/40 hover:text-rose-300 transition-colors"
                  >
                    ยกเลิกการเชิญ...
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-900/40 rounded-lg px-3 py-1.5 border border-rose-500/30">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-300 shrink-0" />
                    <span className="text-xs text-rose-200">ยืนยันยกเลิก {speaker.name}?</span>
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      className="text-xs font-semibold text-rose-200 border border-rose-400/50 rounded px-2 py-0.5 hover:bg-rose-500/30 transition-colors"
                    >
                      ยืนยัน
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="text-xs text-white/50 hover:text-white transition-colors"
                    >
                      ไม่
                    </button>
                  </div>
                )}
              </div>
            )}

            {speaker.status === "cancelled" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">ยกเลิกการเชิญแล้ว</span>
                <button
                  onClick={() => handleStatusChange("pending")}
                  className="text-xs text-white/50 hover:text-white underline transition-colors"
                >
                  เปลี่ยนกลับ
                </button>
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <p className="mt-3 text-white/60 text-xs">กำลังแก้ไขข้อมูล — กด บันทึก เมื่อเสร็จสิ้น</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !isEditing && setActiveTab(tab.id)}
            disabled={isEditing && tab.id !== "overview"}
            aria-selected={activeTab === tab.id}
            className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-brand-dark text-brand-dark bg-white"
                : isEditing && tab.id !== "overview"
                ? "border-transparent text-gray-300 cursor-not-allowed"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === "tickets" && openTicketCount > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {openTicketCount}
              </span>
            )}
            {tab.id === "agenda" && agendaCount > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {agendaCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* ── Overview: READ ── */}
        {activeTab === "overview" && !isEditing && (
          <motion.div key="read" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Mail,       label: "อีเมล",           value: speaker.email },
                { icon: Building,   label: "องค์กร",          value: speaker.organization || "-" },
                { icon: Calendar,   label: "วันสัมมนา",       value: formatThaiDate(speaker.seminar_date) },
                { icon: Clock,      label: "เวลา",            value: speaker.seminar_end_time ? `${speaker.seminar_time} – ${speaker.seminar_end_time} น.` : `${speaker.seminar_time} น.` },
                { icon: MapPin,     label: "สถานที่",         value: speaker.seminar_location || "-" },
                { icon: AlarmClock, label: "กำหนดส่ง Agenda", value: formatThaiDate(speaker.agenda_deadline) },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <item.icon className="h-4 w-4 text-brand-dark shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {speaker.notes && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-xs font-medium text-yellow-700 mb-1">หมายเหตุ</p>
                <p className="text-sm text-yellow-800">{speaker.notes}</p>
              </div>
            )}

            {assignee && (
              <div className="flex items-center gap-3 p-3 bg-brand-muted rounded-xl border border-brand-edge">
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(assignee.name)}
                </div>
                <div>
                  <p className="text-xs text-brand-dark/70">รับผิดชอบโดย</p>
                  <p className="text-sm font-medium text-brand-dark">{assignee.name}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-brand-muted rounded-xl border border-brand-edge">
              <p className="text-xs font-medium text-brand-dark mb-2 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Portal ส่วนตัวของวิทยากร
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-brand-dark/80 font-mono truncate flex-1 bg-white px-3 py-2 rounded-lg border border-brand-edge">
                  {portalUrl}
                </p>
                <button
                  onClick={copyPortalLink}
                  className="shrink-0 p-2 rounded-lg bg-brand-edge hover:bg-brand text-brand-dark transition-colors"
                  aria-label={copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <a
                href={`/portal/${speaker.portal_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs text-brand-dark hover:underline flex items-center gap-1"
              >
                เปิดหน้า Portal <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        )}

        {/* ── Overview: EDIT ── */}
        {activeTab === "overview" && isEditing && (
          <motion.div key="edit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-brand-muted flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-brand-dark" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">ข้อมูลวิทยากร</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="ชื่อ-นามสกุล *"
                  name="name"
                  value={editForm.name}
                  onChange={(e) => f("name", e.target.value)}
                  error={errors.name}
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="อีเมล *"
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={(e) => f("email", e.target.value)}
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="ตำแหน่ง"
                  name="title"
                  value={editForm.title}
                  onChange={(e) => f("title", e.target.value)}
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <Input
                  label="องค์กร / หน่วยงาน"
                  name="organization"
                  value={editForm.organization}
                  onChange={(e) => f("organization", e.target.value)}
                  icon={<Building className="h-4 w-4" />}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-brand-muted flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-brand-dark" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">ข้อมูลงานสัมมนา</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="วันสัมมนา *"
                  type="date"
                  name="seminar_date"
                  value={editForm.seminar_date}
                  onChange={(e) => f("seminar_date", e.target.value)}
                  error={errors.seminar_date}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <Input
                  label="เวลาเริ่ม *"
                  type="time"
                  name="seminar_time"
                  value={editForm.seminar_time}
                  onChange={(e) => f("seminar_time", e.target.value)}
                  error={errors.seminar_time}
                  icon={<Clock className="h-4 w-4" />}
                />
                <Input
                  label="เวลาเสร็จ"
                  type="time"
                  name="seminar_end_time"
                  value={editForm.seminar_end_time}
                  onChange={(e) => f("seminar_end_time", e.target.value)}
                  icon={<Clock className="h-4 w-4" />}
                />
                <Input
                  label="สถานที่"
                  name="seminar_location"
                  value={editForm.seminar_location}
                  onChange={(e) => f("seminar_location", e.target.value)}
                  icon={<MapPin className="h-4 w-4" />}
                  className="sm:col-span-2"
                />
                <Input
                  label="กำหนดส่ง Agenda *"
                  type="date"
                  name="agenda_deadline"
                  value={editForm.agenda_deadline}
                  onChange={(e) => f("agenda_deadline", e.target.value)}
                  error={errors.agenda_deadline}
                  icon={<AlarmClock className="h-4 w-4" />}
                />
                <Select
                  label="มอบหมายให้"
                  options={teamMembers.map((m) => ({ value: m.id, label: m.name }))}
                  value={editForm.assigned_to}
                  onChange={(v) => f("assigned_to", v)}
                  placeholder="เลือกผู้รับผิดชอบ"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">หมายเหตุ</h3>
              </div>
              <Textarea
                placeholder="หัวข้อการบรรยาย, ข้อมูลเพิ่มเติม..."
                value={editForm.notes}
                onChange={(e) => f("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4" />
                บันทึก
              </Button>
              <Button variant="secondary" onClick={handleCancelEdit}>
                ยกเลิก
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === "email" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <EmailDraft speaker={speaker} />
          </motion.div>
        )}

        {activeTab === "calendar" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <CalendarEvent speaker={speaker} />
          </motion.div>
        )}

        {activeTab === "tickets" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <TicketsPanel
              speakerId={speaker.id}
              assignedTo={speaker.assigned_to}
              onCountChange={setOpenTicketCount}
              teamMembers={teamMembers}
            />
          </motion.div>
        )}

        {activeTab === "agenda" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <AgendaPanel
              speakerId={speaker.id}
              onCountChange={setAgendaCount}
            />
          </motion.div>
        )}

        {activeTab === "portal" && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="p-4 bg-brand-muted rounded-xl border border-brand-edge">
              <p className="text-xs font-medium text-brand-dark mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Portal ส่วนตัวของวิทยากร
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-brand-dark/80 font-mono truncate flex-1 bg-white px-3 py-2 rounded-lg border border-brand-edge">
                  {portalUrl}
                </p>
                <button
                  onClick={copyPortalLink}
                  className="shrink-0 p-2 rounded-lg bg-brand-edge hover:bg-brand text-brand-dark transition-colors"
                  aria-label={copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Calendar,      label: "วันสัมมนา",       value: formatThaiDate(speaker.seminar_date) },
                { icon: AlarmClock,    label: "กำหนดส่ง Agenda", value: formatThaiDate(speaker.agenda_deadline) },
                { icon: MapPin,        label: "สถานที่",         value: speaker.seminar_location || "ยังไม่ระบุ" },
                { icon: MessageSquare, label: "Ticket ที่ส่ง",   value: "—" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <item.icon className="h-5 w-5 text-brand-dark shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href={`/portal/${speaker.portal_token}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full mt-2">
                <Globe className="h-4 w-4" />
                เปิดหน้า Portal วิทยากร
              </Button>
            </a>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
