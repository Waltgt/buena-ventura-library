import type { ToastType } from "@/shared/types/toast/ToastType";

export const TOAST_CONFIG: Record<
  ToastType,
  {
    color: string;
    icon: string;
    label: string;
    duration?: number;
  }
> = {
  loading: {
    color: "bg-blue-600 shadow-blue-500/20",
    icon: "⏳",
    label: "Procesando",
  },
  error: {
    color: "bg-red-600",
    icon: "❌",
    label: "Error",
    duration: 5000,
  },
  success: {
    color: "bg-emerald-600",
    icon: "✅",
    label: "Éxito",
    duration: 2000,
  },
};