"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    const autoId = useId();
    const inputId = props.id || autoId;
    const errorId = `${inputId}-err`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent",
              "disabled:bg-gray-50 disabled:text-gray-500",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-400 focus:ring-red-400",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const autoId = useId();
    const textareaId = props.id || autoId;
    const errorId = `${textareaId}-err`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent",
            "resize-none transition-all duration-200",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function Select({ label, error, options, value, onChange, placeholder, className, id }: SelectProps) {
  const autoId = useId();
  const selectId = id || autoId;
  const errorId = `${selectId}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
