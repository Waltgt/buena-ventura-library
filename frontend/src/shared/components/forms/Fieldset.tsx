import React from "react";

interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Fieldset: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">

      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm font-semibold text-slate-700">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}

      {children}

    </div>
  );
};

export default Fieldset;