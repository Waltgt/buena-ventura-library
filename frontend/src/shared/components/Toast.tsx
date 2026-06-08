import { useEffect } from "react";
import { TOAST_TYPES, type ToastType } from "@/shared/types/toast/ToastType";
import { TOAST_CONFIG } from "@/shared/types/toast/ToastConfig";

type Props = {
  show: boolean;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
};

const Toast = ({
  show,
  type,
  message,
  duration = 4000,
  onClose,
}: Props) => {
  const config = TOAST_CONFIG[type];

  useEffect(() => {
    if (!show) return;

    if (type === TOAST_TYPES.LOADING) return;

    const timer = setTimeout(() => {
      onClose();
    }, config.duration ?? duration);

    return () => clearTimeout(timer);
  }, [show, type, duration, onClose, config]);

  if (!show) return null;

  return (
    <div
      className={`
        fixed z-[100] flex items-center gap-3 
        p-4 min-w-[320px] max-w-md 
        rounded-2xl shadow-2xl border border-white/10
        text-white transition-all duration-300 transform
        top-6 right-6
        ${config.color}
        animate-in fade-in slide-in-from-top-2
      `}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">

          {type === TOAST_TYPES.LOADING ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-lg">{config.icon}</span>
          )}

          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">
              {config.label}
            </p>

            <p className="text-sm font-bold leading-tight">
              {message}
            </p>
          </div>

        </div>
      </div>

      {type !== TOAST_TYPES.LOADING && (
        <button
          onClick={onClose}
          className="hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xl"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Toast;