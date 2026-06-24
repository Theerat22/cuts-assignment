import { AgendaFile } from "./types";

const KEY = "spk_agenda_v1";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB practical limit for localStorage

export function getAgendaFiles(speakerId?: string): AgendaFile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const all: AgendaFile[] = raw ? JSON.parse(raw) : [];
    return speakerId ? all.filter((f) => f.speaker_id === speakerId) : all;
  } catch {
    return [];
  }
}

export function saveAgendaFile(file: AgendaFile): void {
  if (typeof window === "undefined") return;
  const all = getAgendaFiles();
  try {
    localStorage.setItem(KEY, JSON.stringify([...all, file]));
  } catch {
    throw new Error("ไฟล์มีขนาดใหญ่เกินพื้นที่จัดเก็บของเบราว์เซอร์ กรุณาใช้ไฟล์ขนาดไม่เกิน 5MB");
  }
}

export function removeAgendaFile(fileId: string): void {
  if (typeof window === "undefined") return;
  const all = getAgendaFiles();
  localStorage.setItem(KEY, JSON.stringify(all.filter((f) => f.id !== fileId)));
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error(`"${file.name}" มีขนาด ${(file.size / 1024 / 1024).toFixed(1)}MB ใหญ่เกินขีดจำกัด 5MB สำหรับโหมด Demo`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`อ่านไฟล์ "${file.name}" ไม่สำเร็จ`));
    reader.readAsDataURL(file);
  });
}
