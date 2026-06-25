"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  label?: string;
  value: string; // stored as "HH:MM" 24h
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

// Parse "HH:MM" (24h) → { hour12, minute, period }
function parse24h(value: string): { hour: number; minute: number; period: "AM" | "PM" } {
  const [hStr, mStr] = value.split(":");
  const h24 = parseInt(hStr ?? "0", 10);
  const minute = parseInt(mStr ?? "0", 10);
  const period: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour, minute, period };
}

// { hour12, minute, period } → "HH:MM" (24h)
function to24h(hour: number, minute: number, period: "AM" | "PM"): string {
  let h24 = hour % 12;
  if (period === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10,...,55

export function TimePicker({ label, value, onChange, onBlur, error, className }: TimePickerProps) {
  const id = useId();
  const { hour, minute, period } = value ? parse24h(value) : { hour: 8, minute: 0, period: "AM" as const };

  const update = (h: number, m: number, p: "AM" | "PM") => onChange(to24h(h, m, p));

  const selectBase = cn(
    "rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900",
    "focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent",
    "transition-all duration-200 appearance-none text-center cursor-pointer",
    error && "border-red-400 focus:ring-red-400"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1.5" id={id} onBlur={onBlur}>
        {/* Hour */}
        <select
          aria-label="ชั่วโมง"
          value={hour}
          onChange={(e) => update(parseInt(e.target.value), minute, period)}
          className={cn(selectBase, "w-16")}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
          ))}
        </select>

        <span className="text-gray-400 font-semibold text-sm select-none">:</span>

        {/* Minute */}
        <select
          aria-label="นาที"
          value={minute}
          onChange={(e) => update(hour, parseInt(e.target.value), period)}
          className={cn(selectBase, "w-16")}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
          ))}
        </select>

        {/* AM/PM toggle */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm font-semibold">
          {(["AM", "PM"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => update(hour, minute, p)}
              className={cn(
                "px-3 py-2 transition-colors",
                period === p
                  ? "bg-brand-dark text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
