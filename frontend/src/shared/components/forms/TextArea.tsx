import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextArea: React.FC<Props> = ({ error, className = "", ...props }) => {
  return (
    <textarea
      {...props}
      className={`
        w-full min-h-[110px] px-4 py-3 rounded-2xl border text-sm
        bg-slate-50 border-slate-200 text-slate-700
        placeholder:text-slate-400

        transition-all duration-200

        hover:border-slate-300

        focus:outline-none
        focus:ring-4
        focus:ring-blue-100
        focus:border-blue-400

        resize-none

        ${error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : ""}
        ${className}
      `}
    />
  );
};

export default TextArea;