import { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/shared/components/forms/Input";

type Option = {
    id: string;
    label: string;
    subtitle?: string;
};

type Props = {
    options: Option[];
    value: Option | null;
    onChange: (value: Option | null) => void;
    placeholder?: string;
    disabled?: boolean;
};

export default function DataList({
    options,
    value,
    onChange,
    placeholder,
    disabled
}: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editing) {
            if (value) setSearch(value.label);
            else setSearch("");
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

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [value]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return options.filter((o) =>
            `${o.label} ${o.id} ${o.subtitle ?? ""}`
                .toLowerCase()
                .includes(q)
        );
    }, [options, search]);

    const select = (option: Option) => {
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
                        onBlur={() => {
                            setTimeout(() => {
                                setOpen(false);

                                if (!value) {
                                    setEditing(false);
                                }
                            }, 150);
                        }}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                            setEditing(true);

                            if (
                                value &&
                                value.label !== e.target.value
                            ) {
                                onChange(null);
                            }
                        }}
                    />

                    {open && !disabled && (
                        <div className="absolute w-full z-[9999] mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-56 overflow-auto">

                            {filtered.map((o) => (
                                <button
                                    key={o.id}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => select(o)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50"
                                >
                                    <div className="text-sm font-medium text-slate-700">
                                        {o.label}
                                    </div>

                                    {o.subtitle && (
                                        <div className="text-xs text-slate-500">
                                            {o.subtitle}
                                        </div>
                                    )}
                                </button>
                            ))}

                            {!filtered.length && (
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