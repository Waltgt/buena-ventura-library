import React, { useEffect } from "react";

interface ModalProps {
  abierto: boolean;
  onClose: () => void;
  titulo?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
}

const sizes: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

const Modal: React.FC<ModalProps> = ({
  abierto,
  onClose,
  titulo = "",
  children,
  size = "md",
  gradient = false,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (abierto) document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`
          relative w-full ${sizes[size]}
          bg-white rounded-2xl shadow-2xl
          border border-slate-100
          overflow-hidden
          animate-in fade-in zoom-in-95 duration-150
        `}
      >
        {gradient && (
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
        )}

        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
            {titulo}
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-white max-h-[75vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;