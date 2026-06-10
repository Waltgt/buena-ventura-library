// shared/ui/Radio.tsx
import React from "react";

interface Props {
  checked: boolean;
  label: string;
  onChange: () => void;
}

const RadioButton: React.FC<Props> = ({ checked, label, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">

      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="accent-blue-600"
      />

      <span className="text-sm text-slate-700">{label}</span>

    </label>
  );
};

export default RadioButton;