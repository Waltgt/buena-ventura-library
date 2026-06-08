import React from "react";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { ButtonColor } from "@/shared/types/button/ButtonTypes";

export const BUTTON_COLORS = {
  GREEN: "green",
  BLUE: "blue",
  RED: "red",
  GRAY: "gray",
  WHITE: "white",
} as const;

type ButtonVariant = "solid" | "soft" | "outline";

interface ColorConfig {
  solid: string;
  soft: string;
  outline: string;
}

interface ButtonProps {
  icon?: IconDefinition;
  label?: string;
  title?: string;

  color?: ButtonColor | "gray" | "white";
  variant?: ButtonVariant;

  onClick?: () => void;

  type?: "button" | "submit" | "reset";

  disabled?: boolean;
  loading?: boolean;

  fullWidth?: boolean;

  className?: string;
}

const colorMap: Record<string, ColorConfig> = {
  blue: {
    solid: `
      text-white
      bg-gradient-to-r
      from-blue-600
      to-indigo-600
      hover:from-blue-700
      hover:to-indigo-700
      border border-transparent
      shadow-md
      hover:shadow-lg
    `,

    soft: `
      bg-blue-50/80
      text-blue-700
      hover:bg-blue-100
      border border-blue-100
    `,

    outline: `
      bg-white
      text-blue-700
      border border-blue-200
      hover:bg-blue-50
    `,
  },

  green: {
    solid: `
      bg-emerald-500
      text-white
      hover:bg-emerald-600
      border border-emerald-500
      shadow-md
      hover:shadow-lg
    `,

    soft: `
      bg-emerald-50/80
      text-emerald-700
      hover:bg-emerald-100
      border border-emerald-100
    `,

    outline: `
      bg-white
      text-emerald-700
      border border-emerald-200
      hover:bg-emerald-50
    `,
  },

  red: {
    solid: `
      bg-rose-500
      text-white
      hover:bg-rose-600
      border border-rose-500
      shadow-md
      hover:shadow-lg
    `,

    soft: `
      bg-rose-50/80
      text-rose-700
      hover:bg-rose-100
      border border-rose-100
    `,

    outline: `
      bg-white
      text-rose-700
      border border-rose-200
      hover:bg-rose-50
    `,
  },

  gray: {
    solid: `
      bg-slate-600
      text-white
      hover:bg-slate-700
      border border-slate-600
      shadow-md
      hover:shadow-lg
    `,

    soft: `
      bg-slate-100
      text-slate-700
      hover:bg-slate-200
      border border-slate-200
    `,

    outline: `
      bg-white
      text-slate-700
      border border-slate-200
      hover:bg-slate-50
    `,
  },

  white: {
    solid: `
      bg-white
      text-gray-700
      border border-gray-200
      hover:bg-gray-50
    `,

    soft: `
      bg-white
      text-gray-700
      border border-gray-100
      hover:bg-gray-50
    `,

    outline: `
      bg-white
      text-gray-700
      border border-gray-200
      hover:bg-gray-50
    `,
  },
};

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  title,

  color = "blue",
  variant = "solid",

  onClick,

  type = "button",

  disabled = false,
  loading = false,

  fullWidth = false,

  className = "",
}) => {
  const styles = colorMap[color]?.[variant];

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2

        px-5 py-2.5
        min-h-[44px]

        rounded-xl

        text-sm font-semibold

        transition-all duration-200

        active:scale-[0.98]

        focus:outline-none
        focus:ring-4
        focus:ring-slate-100

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100

        ${fullWidth ? "w-full" : ""}

        ${styles}

        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="
              h-4 w-4
              animate-spin
              rounded-full
              border-2
              border-current/30
              border-t-current
            "
          />

          {label && <span>{label}</span>}
        </span>
      ) : (
        <>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className="text-sm"
            />
          )}

          {label && (
            <span className="whitespace-nowrap">
              {label}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;