import React from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

const Select: React.FC<Props> = ({
  label,
  error,
  options,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="text-xs text-slate-500">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`
          w-full h-11 px-4 rounded-2xl border text-sm
          bg-slate-50 border-slate-200 text-slate-700

          transition-all duration-200

          hover:border-slate-300

          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          focus:border-blue-400

          ${error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : ""}

          ${className}
        `}
      >
        {options
          ? options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;