"use client";
import { useState, useEffect, useCallback } from "react";
import { FileText, Download, Trash2, RefreshCw, FolderOpen } from "lucide-react";
import { AgendaFile } from "@/lib/types";

interface AgendaPanelProps {
  speakerId: string;
  onCountChange?: (count: number) => void;
}

const EXT_COLOR: Record<string, string> = {
  pdf:  "bg-red-100 text-red-700",
  pptx: "bg-orange-100 text-orange-700",
  ppt:  "bg-orange-100 text-orange-700",
  docx: "bg-sky-100 text-sky-700",
  doc:  "bg-sky-100 text-sky-700",
};

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AgendaPanel({ speakerId, onCountChange }: AgendaPanelProps) {
  const [files, setFiles] = useState<AgendaFile[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/agenda-files?speakerId=${speakerId}`);
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        onCountChange?.(data.files.length);
      }
    } catch (err) {
      console.error("Failed to fetch agenda files:", err);
    }
  }, [speakerId, onCountChange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRemove = async (fileId: string) => {
    try {
      await fetch(`/api/agenda-files/${fileId}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      console.error("Failed to remove file:", err);
    }
  };

  const handleDownload = (file: AgendaFile) => {
    window.open(`/api/agenda-files/${file.id}`, "_blank");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {files.length === 0 ? "ยังไม่มีไฟล์" : `${files.length} ไฟล์`}
        </p>
        <button
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-dark transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          รีเฟรช
        </button>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FolderOpen className="h-8 w-8 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">ยังไม่มีไฟล์ Agenda</p>
          <p className="text-xs text-gray-400 mt-1">เมื่อวิทยากรอัปโหลดไฟล์ผ่าน Portal จะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const ext = getExt(file.file_name);
            const extColor = EXT_COLOR[ext] ?? "bg-gray-100 text-gray-600";
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${extColor}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(file.uploaded_at).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    {file.file_size ? ` · ${formatSize(file.file_size)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleDownload(file)}
                    title="ดาวน์โหลด"
                    className="p-2 rounded-lg hover:bg-brand-muted text-brand-dark transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(file.id)}
                    title="ลบไฟล์"
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
