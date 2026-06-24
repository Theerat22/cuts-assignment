"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Search, Users, LayoutGrid, List, Mic2, ArrowUpDown
} from "lucide-react";
import { SpeakerCard } from "@/components/dashboard/SpeakerCard";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { SpeakerDetailModal } from "@/components/speakers/SpeakerDetailModal";
import { AddSpeakerModal } from "@/components/speakers/AddSpeakerModal";
import { Button } from "@/components/ui/Button";
import { Speaker, SpeakerStatus, TeamMember } from "@/lib/types";
import {
  getStatusLabel, getStatusColor, getStatusDot,
  formatThaiDate, getInitials
} from "@/lib/utils";

const STATUS_FILTERS: { value: SpeakerStatus | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอดำเนินการ" },
  { value: "contacted", label: "ติดต่อแล้ว" },
  { value: "confirmed", label: "ยืนยันแล้ว" },
  { value: "agenda_submitted", label: "ส่ง Agenda แล้ว" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "cancelled", label: "ยกเลิก" },
];

export default function DashboardPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SpeakerStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "deadline" | "name">("date");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [speakersRes, teamRes] = await Promise.all([
          fetch("/api/speakers"),
          fetch("/api/team-members"),
        ]);
        const speakersData = await speakersRes.json();
        const teamData = await teamRes.json();
        if (speakersData.speakers) setSpeakers(speakersData.speakers);
        if (teamData.teamMembers) setTeamMembers(teamData.teamMembers);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const list = speakers.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.organization || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "th");
      if (sortBy === "deadline") return a.agenda_deadline.localeCompare(b.agenda_deadline);
      return a.seminar_date.localeCompare(b.seminar_date);
    });
  }, [speakers, searchQuery, statusFilter, sortBy]);

  const handleAddSpeaker = async (speakerData: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(speakerData),
      });
      const data = await res.json();
      if (data.speaker) {
        setSpeakers((prev) => [data.speaker, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add speaker:", err);
    }
  };

  const handleStatusChange = async (id: string, status: SpeakerStatus) => {
    try {
      const res = await fetch(`/api/speakers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.speaker) {
        setSpeakers((prev) =>
          prev.map((s) => (s.id === id ? data.speaker : s))
        );
        if (selectedSpeaker?.id === id) {
          setSelectedSpeaker(data.speaker);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optimistic fallback
      setSpeakers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status, updated_at: new Date().toISOString() } : s))
      );
      if (selectedSpeaker?.id === id) {
        setSelectedSpeaker((prev) => prev ? { ...prev, status } : null);
      }
    }
  };

  const handleUpdateSpeaker = async (updated: Speaker) => {
    try {
      const res = await fetch(`/api/speakers/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.speaker) {
        setSpeakers((prev) => prev.map((s) => (s.id === data.speaker.id ? data.speaker : s)));
        setSelectedSpeaker(data.speaker);
      } else {
        setSpeakers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setSelectedSpeaker(updated);
      }
    } catch (err) {
      console.error("Failed to update speaker:", err);
      setSpeakers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setSelectedSpeaker(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center shadow-sm">
                <Mic2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-base leading-tight">Speaker CRM</h1>
                <p className="text-xs text-gray-400">ทีมฝ่าย Activity</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button
                onClick={() => setShowAddModal(true)}
                size="sm"
                className="hidden sm:flex"
              >
                <UserPlus className="h-4 w-4" />
                เพิ่มวิทยากร
              </Button>
              <button
                onClick={() => setShowAddModal(true)}
                className="sm:hidden p-2 rounded-xl bg-brand-dark text-white hover:bg-brand-deeper transition-colors"
              >
                <UserPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <StatsBar speakers={speakers} />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาวิทยากร ชื่อ, อีเมล, องค์กร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-dark shadow-sm"
            />
          </div>

          {/* View Mode & Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="มุมมองกริด"
                aria-pressed={viewMode === "grid"}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-brand-dark text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="มุมมองรายการ"
                aria-pressed={viewMode === "list"}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-brand-dark text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="เรียงลำดับ"
                className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-dark shadow-sm appearance-none cursor-pointer"
              >
                <option value="date">วันสัมมนา</option>
                <option value="deadline">กำหนดส่ง</option>
                <option value="name">ชื่อ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Pills — always visible */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              aria-pressed={statusFilter === f.value}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                statusFilter === f.value
                  ? "bg-brand-dark text-white border-brand-dark shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-edge hover:text-brand-dark"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === f.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {f.value === "all"
                  ? speakers.length
                  : speakers.filter((s) => s.status === f.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            แสดง <span className="font-semibold text-gray-900">{filtered.length}</span> วิทยากร
            {searchQuery && ` สำหรับ "${searchQuery}"`}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="text-xs text-brand-dark hover:text-brand-deeper font-medium"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">ไม่พบวิทยากร</p>
            <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="mt-4 text-xs text-brand-dark hover:text-brand-deeper font-medium border border-brand-edge rounded-lg px-4 py-2 hover:bg-brand-muted transition-colors"
              >
                ล้างตัวกรอง
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((speaker, i) => (
                <motion.div
                  key={speaker.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  {viewMode === "grid" ? (
                    <SpeakerCard
                      speaker={speaker}
                      onClick={() => setSelectedSpeaker(speaker)}
                    />
                  ) : (
                    <SpeakerListItem
                      speaker={speaker}
                      onClick={() => setSelectedSpeaker(speaker)}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <SpeakerDetailModal
        speaker={selectedSpeaker}
        isOpen={!!selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        onStatusChange={handleStatusChange}
        onUpdate={handleUpdateSpeaker}
        teamMembers={teamMembers}
      />
      <AddSpeakerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSpeaker}
        teamMembers={teamMembers}
      />
    </div>
  );
}

// List view item component
function SpeakerListItem({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-edge cursor-pointer transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
        {getInitials(speaker.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{speaker.name}</p>
        <p className="text-xs text-gray-500 truncate">{speaker.organization || speaker.email}</p>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 shrink-0">
        <span>{formatThaiDate(speaker.seminar_date)}</span>
        <span>•</span>
        <span>{speaker.seminar_time}{speaker.seminar_end_time ? ` – ${speaker.seminar_end_time}` : ""} น.</span>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border shrink-0 ${getStatusColor(speaker.status)}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(speaker.status)}`} />
        {getStatusLabel(speaker.status)}
      </span>
    </motion.div>
  );
}
