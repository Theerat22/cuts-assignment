"use client";
import { useState } from "react";
import { UserPlus, Calendar, Mail, Building, MapPin, Clock, AlarmClock, User, FileText, Briefcase } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Speaker, TeamMember } from "@/lib/types";
import { generatePortalToken } from "@/lib/utils";

interface AddSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (speaker: Record<string, unknown>) => void;
  teamMembers: TeamMember[];
}

export function AddSpeakerModal({ isOpen, onClose, onAdd, teamMembers }: AddSpeakerModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    title: "",
    seminar_date: "",
    seminar_time: "",
    seminar_end_time: "",
    seminar_location: "",
    agenda_deadline: "",
    assigned_to: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    const e: Record<string, string> = { ...errors };
    if (field === "name") {
      if (!value.trim()) e.name = "กรุณากรอกชื่อวิทยากร"; else delete e.name;
    }
    if (field === "email") {
      if (!value.trim()) e.email = "กรุณากรอกอีเมล";
      else if (!/\S+@\S+\.\S+/.test(value)) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
      else delete e.email;
    }
    if (field === "seminar_date") {
      if (!value) e.seminar_date = "กรุณาเลือกวันสัมมนา"; else delete e.seminar_date;
    }
    if (field === "seminar_time") {
      if (!value) e.seminar_time = "กรุณาระบุเวลาสัมมนา"; else delete e.seminar_time;
    }
    if (field === "agenda_deadline") {
      if (!value) e.agenda_deadline = "กรุณาเลือก Deadline"; else delete e.agenda_deadline;
    }
    setErrors(e);
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อวิทยากร";
    if (!form.email.trim()) e.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!form.seminar_date) e.seminar_date = "กรุณาเลือกวันสัมมนา";
    if (!form.seminar_time) e.seminar_time = "กรุณาระบุเวลาสัมมนา";
    if (!form.agenda_deadline) e.agenda_deadline = "กรุณาเลือก Deadline";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
          el?.focus();
        }
      }, 0);
      return;
    }
    setIsLoading(true);
    try {
      const newSpeakerData = {
        ...form,
        status: "pending",
        portal_token: generatePortalToken(),
      };
      await onAdd(newSpeakerData);
      setForm({
        name: "", email: "", organization: "", title: "",
        seminar_date: "", seminar_time: "", seminar_end_time: "", seminar_location: "",
        agenda_deadline: "", assigned_to: "", notes: "",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const f = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มวิทยากรใหม่" size="xl">
      <div className="p-6 space-y-5">
        {/* Personal Info */}
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
              placeholder="เช่น ดร.สมชาย ใจดี"
              value={form.name}
              onChange={(e) => f("name", e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              error={errors.name}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              label="อีเมล *"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => f("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="ตำแหน่ง"
              placeholder="เช่น CEO, ผู้อำนวยการ"
              value={form.title}
              onChange={(e) => f("title", e.target.value)}
              icon={<Briefcase className="h-4 w-4" />}
            />
            <Input
              label="องค์กร / หน่วยงาน"
              placeholder="เช่น มหาวิทยาลัย ABC"
              value={form.organization}
              onChange={(e) => f("organization", e.target.value)}
              icon={<Building className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Seminar Info */}
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
              value={form.seminar_date}
              onChange={(e) => f("seminar_date", e.target.value)}
              onBlur={(e) => handleBlur("seminar_date", e.target.value)}
              error={errors.seminar_date}
              icon={<Calendar className="h-4 w-4" />}
            />
            <Input
              label="เวลาเริ่ม *"
              type="time"
              name="seminar_time"
              value={form.seminar_time}
              onChange={(e) => f("seminar_time", e.target.value)}
              onBlur={(e) => handleBlur("seminar_time", e.target.value)}
              error={errors.seminar_time}
              icon={<Clock className="h-4 w-4" />}
            />
            <Input
              label="เวลาเสร็จ"
              type="time"
              name="seminar_end_time"
              value={form.seminar_end_time}
              onChange={(e) => f("seminar_end_time", e.target.value)}
              icon={<Clock className="h-4 w-4" />}
            />
            <Input
              label="สถานที่"
              placeholder="เช่น ห้อง Auditorium A ชั้น 3"
              value={form.seminar_location}
              onChange={(e) => f("seminar_location", e.target.value)}
              icon={<MapPin className="h-4 w-4" />}
              className="sm:col-span-2"
            />
            <Input
              label="กำหนดส่ง Agenda *"
              type="date"
              name="agenda_deadline"
              value={form.agenda_deadline}
              onChange={(e) => f("agenda_deadline", e.target.value)}
              onBlur={(e) => handleBlur("agenda_deadline", e.target.value)}
              error={errors.agenda_deadline}
              icon={<AlarmClock className="h-4 w-4" />}
            />
            <Select
              label="มอบหมายให้"
              options={teamMembers.map((m) => ({ value: m.id, label: m.name }))}
              value={form.assigned_to}
              onChange={(v) => f("assigned_to", v)}
              placeholder="เลือกผู้รับผิดชอบ"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">หมายเหตุ</h3>
          </div>
          <Textarea
            placeholder="หัวข้อการบรรยาย, ข้อมูลเพิ่มเติม..."
            value={form.notes}
            onChange={(e) => f("notes", e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <Button onClick={handleSubmit} loading={isLoading} className="flex-1">
            <UserPlus className="h-4 w-4" />
            เพิ่มวิทยากร
          </Button>
          <Button variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
        </div>
      </div>
    </Modal>
  );
}
