"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, X, CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgendaFile } from "@/lib/types";

interface AgendaUploadProps {
  speakerId: string;
  speakerToken: string;
  deadline?: string;
  existingFiles?: AgendaFile[];
}

export function AgendaUpload({ speakerId, speakerToken, deadline }: AgendaUploadProps) {
  const [staged, setStaged] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<AgendaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/agenda-files?speakerId=${speakerId}`);
      const data = await res.json();
      if (data.files) setUploaded(data.files);
    } catch (err) {
      console.error("Failed to fetch agenda files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [speakerId]);

  const isDeadlinePassed = deadline ? new Date(deadline) < new Date() : false;
  const isDeadlineNear = deadline
    ? !isDeadlinePassed && new Date(deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    : false;

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setStaged((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeStaged = (i: number) => setStaged((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (staged.length === 0) return;
    setUploading(true);
    setErrors([]);
    const errs: string[] = [];

    for (const f of staged) {
      if (f.size > 5 * 1024 * 1024) {
        errs.push(`${f.name}: ไฟล์ขนาดเกิน 5MB`);
        continue;
      }
      try {
        const form = new FormData();
        form.append("file", f);
        form.append("speakerId", speakerId);
        if (deadline) form.append("deadline", deadline);

        const res = await fetch("/api/agenda-files/upload", {
          method: "POST",
          body: form,
        });

        const json = await res.json();
        if (!res.ok) {
          errs.push(`${f.name}: ${json.error ?? "อัปโหลดไม่สำเร็จ"}`);
        }
      } catch (e) {
        errs.push(`${f.name}: ${(e as Error).message}`);
      }
    }

    setErrors(errs);
    setStaged([]);
    await fetchFiles();
    setUploading(false);
  };

  const handleRemove = async (fileId: string) => {
    try {
      await fetch(`/api/agenda-files/${fileId}`, { method: "DELETE" });
      await fetchFiles();
    } catch (err) {
      console.error("Failed to remove file:", err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Deadline Notice */}
      {deadline && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          isDeadlinePassed
            ? "bg-red-50 border-red-200"
            : isDeadlineNear
            ? "bg-orange-50 border-orange-200"
            : "bg-blue-50 border-blue-200"
        }`}>
          {isDeadlinePassed ? (
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          ) : (
            <Clock className={`h-4 w-4 shrink-0 ${isDeadlineNear ? "text-orange-500" : "text-blue-500"}`} />
          )}
          <div>
            <p className={`text-sm font-medium ${isDeadlinePassed ? "text-red-700" : isDeadlineNear ? "text-orange-700" : "text-blue-700"}`}>
              {isDeadlinePassed ? "เกิน Deadline แล้ว" : isDeadlineNear ? "Deadline ใกล้มาถึง" : "Deadline การส่งไฟล์"}
            </p>
            <p className={`text-xs mt-0.5 ${isDeadlinePassed ? "text-red-600" : isDeadlineNear ? "text-orange-600" : "text-blue-600"}`}>
              {new Date(deadline).toLocaleDateString("th-TH", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-brand bg-brand-muted"
            : "border-gray-200 hover:border-brand-edge hover:bg-brand-muted/40"
        }`}
      >
        <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? "text-brand-dark" : "text-gray-400"}`} />
        <p className="text-sm font-medium text-gray-700">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</p>
        <p className="text-xs text-gray-500 mt-1">รองรับ PDF, PPT, PPTX, DOC, DOCX (สูงสุด 5MB ต่อไฟล์)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{err}</p>
            </div>
          ))}
        </div>
      )}

      {/* Staged Files */}
      {staged.length > 0 && (
        <div className="space-y-2">
          {staged.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-brand-muted rounded-xl border border-brand-edge">
              <FileText className="h-4 w-4 text-brand-dark shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-600">{formatSize(file.size)}</p>
              </div>
              <button onClick={() => removeStaged(i)} className="p-1 hover:bg-brand-edge rounded-lg transition-colors">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
          <Button onClick={handleUpload} loading={uploading} className="w-full">
            <Upload className="h-4 w-4" />
            อัปโหลด {staged.length} ไฟล์
          </Button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploaded.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">ไฟล์ที่อัปโหลดแล้ว</p>
          <div className="space-y-2">
            {uploaded.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.uploaded_at).toLocaleString("th-TH")}
                    {file.file_size ? ` · ${formatSize(file.file_size)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => window.open(`/api/agenda-files/${file.id}`, "_blank")}
                    className="flex items-center gap-1 text-xs text-brand-dark hover:underline"
                  >
                    <Download className="h-3 w-3" />
                    ดาวน์โหลด
                  </button>
                  <button
                    onClick={() => handleRemove(file.id)}
                    className="p-1 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
