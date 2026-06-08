import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const base =
  "w-full h-12 px-4 rounded-2xl text-sm border transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4";

const normalStyles =
  "bg-slate-50 border-slate-200 text-slate-700 focus:ring-blue-100";

const disabledStyles =
  "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed";

const invalidStyles =
  "border-red-300 focus:ring-red-100";

const Input: React.FC<InputProps> = ({
  invalid,
  disabled,
  type = "text",
  placeholder,
  className = "",
  ...props
}) => {

  const isDate = type === "date";

  return (
    <input
      {...props}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      className={[
        base,
        isDate ? "h-12 pr-2" : "",

        disabled ? disabledStyles : normalStyles,
        invalid ? invalidStyles : "",
        className
      ].join(" ")}
    />
  );
};

export default Input;