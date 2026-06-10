import { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/shared/components/forms/Input";
import type { DataListOption } from "@/shared/types/datalist/DataListOption";

type Props<T = unknown> = {
  options?: DataListOption<T>[];
  value: DataListOption<T> | null;
  onChange: (value: DataListOption<T> | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function DataList<T>({
  options = [],
  value,
  onChange,
  placeholder,
  disabled,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      setSearch(value?.label ?? "");
    }
  }, [value, editing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);

        if (!value) {
          setEditing(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [value]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return options.filter((option) =>
      `${option.label} ${option.id} ${option.subtitle ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [options, search]);

  const select = (option: DataListOption<T>) => {
    onChange(option);
    setSearch(option.label);
    setOpen(false);
    setEditing(false);
  };

  const startEditing = () => {
    setEditing(true);
    setOpen(true);
    setSearch("");
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {value && !editing ? (
        <div className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {value.label}
            </p>

            {value.subtitle && (
              <p className="text-xs text-slate-500 truncate">
                {value.subtitle}
              </p>
            )}
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={startEditing}
              className="text-xs text-blue-600 hover:underline"
            >
              Cambiar
            </button>
          )}
        </div>
      ) : (
        <>
          <Input
            value={search}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => {
              setOpen(true);
              setEditing(true);
            }}
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);
              setOpen(true);
              setEditing(true);

              if (value === "") {
                onChange(null);
              }
            }}
          />

          {open && !disabled && (
            <div className="absolute z-50 mt-2 w-full overflow-auto max-h-56 rounded-2xl border border-slate-200 bg-white shadow-lg">
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <button
                    key={String(option.id)}
                    type="button"
                    onMouseDown={(e) =>
                      e.preventDefault()
                    }
                    onClick={() => select(option)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="text-sm font-medium text-slate-700">
                      {option.label}
                    </div>

                    {option.subtitle && (
                      <div className="text-xs text-slate-500">
                        {option.subtitle}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-400">
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}