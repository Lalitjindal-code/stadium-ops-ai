"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Sparkles, Info } from "lucide-react";

type ToastType = "success" | "error" | "ai" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-[var(--risk-safe-bg)] border-[var(--risk-safe-border)] text-[var(--risk-safe-text)]";
      case "error":
        return "bg-[var(--risk-critical-bg)] border-[var(--risk-critical-border)] text-[var(--risk-critical-text)]";
      case "ai":
        return "bg-[var(--accent-glow)] border-[var(--accent-500)] text-[var(--accent-300)]";
      case "info":
      default:
        return "bg-[var(--info-bg)] border-[var(--info-border)] text-[var(--info-text)]";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={16} />;
      case "error":
        return <AlertTriangle size={16} />;
      case "ai":
        return <Sparkles size={16} />;
      case "info":
      default:
        return <Info size={16} />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 min-w-[280px] max-w-sm rounded-lg border shadow-lg animate-fade-in-up ${getStyles()}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium pr-4">{toast.message}</div>
      <button onClick={onRemove} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}
