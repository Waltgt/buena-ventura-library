import { useMemo, useState } from "react";
import Button from "./forms/Button";

import { useToast } from "@/shared/hooks/useToast";
import Toast from "@/shared/components/Toast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";

import type {
  TableAction,
  TableColumn,
  SortConfig,
} from "@/shared/types/table/TableTypes";

import { TABLE_ICONS } from "@/shared/types/table/TableIcons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CanAccess from "./permissions/CanAccess";

interface DataTableProps<T> {
  columns: TableColumn[];
  data: T[];
  actions?: TableAction<T>[];
  defaultSort?: SortConfig;

  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;

  fitContainer?: boolean;
  loading?: boolean;

  onFiltersChange?: (filters: Record<string, string>) => void;

  rowKey?: keyof T;
}

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split(".").reduce((acc, part) => {
    if (acc == null) return undefined;
    return acc[part];
  }, obj);
};

const isDateLike = (v: any) =>
  typeof v === "string" ||
  typeof v === "number" ||
  v instanceof Date;

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  actions = [],
  defaultSort,
  page,
  pageSize,
  total,
  onPageChange,
  loading = false,
  onFiltersChange,
  rowKey,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultSort?.key ?? null,
    direction: defaultSort?.direction ?? null,
  });

  const { toast, showToast, hideToast } = useToast();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const copyToClipboard = async (text: unknown) => {
    try {
      await navigator.clipboard.writeText(String(text ?? ""));
      showToast("Copiado al portapapeles", TOAST_TYPES.SUCCESS);
    } catch {
      showToast("No se pudo copiar", TOAST_TYPES.ERROR);
    }
  };

  const handleSort = (colKey: string) => {
    setSortConfig((prev) => ({
      key: colKey,
      direction:
        prev.key === colKey && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortIcon = (colKey: string): IconDefinition => {
    if (sortConfig.key !== colKey) return TABLE_ICONS.SORT_DEFAULT;
    return sortConfig.direction === "asc"
      ? TABLE_ICONS.SORT_ASC
      : TABLE_ICONS.SORT_DESC;
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const safeData = data ?? [];

  const filteredData = useMemo(() => {
    return safeData.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        const cellValue = getNestedValue(row, key);
        if (cellValue == null) return false;

        const col = columns.find((c) => c.key === key);
        const isDate = col?.inputType === "date";

        if (isDate) {
          let dateStr = "";

          if (typeof cellValue === "string") {
            dateStr = cellValue.slice(0, 10);
          } else if (isDateLike(cellValue)) {
            dateStr = new Date(
              cellValue as string | number | Date
            )
              .toISOString()
              .slice(0, 10);
          }

          return dateStr.includes(value);
        }

        return String(cellValue)
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [safeData, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key!);
      const bVal = getNestedValue(b, sortConfig.key!);

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const aDate = isDateLike(aVal)
        ? new Date(aVal as any).getTime()
        : NaN;

      const bDate = isDateLike(bVal)
        ? new Date(bVal as any).getTime()
        : NaN;

      const isDate =
        !isNaN(aDate) &&
        !isNaN(bDate) &&
        String(aVal).includes("-");

      if (isDate) {
        return sortConfig.direction === "asc"
          ? aDate - bDate
          : bDate - aDate;
      }

      const aCompare = String(aVal);
      const bCompare = String(bVal);

      if (aCompare < bCompare)
        return sortConfig.direction === "asc" ? -1 : 1;

      if (aCompare > bCompare)
        return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(total / pageSize);

  const goPrev = () => page > 1 && onPageChange(page - 1);
  const goNext = () =>
    page < totalPages && onPageChange(page + 1);

  const isInitialLoading =
    loading && safeData.length === 0;

  if (!loading && safeData.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="sticky top-0 z-10 bg-slate-800 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold border-b border-slate-700"
                >
                  <div
                    className={`flex items-center gap-2 select-none ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      col.sortable && handleSort(col.key)
                    }
                  >
                    <span>{col.label}</span>

                    {col.sortable && (
                      <FontAwesomeIcon
                        icon={getSortIcon(col.key)}
                        className="text-xs opacity-80"
                      />
                    )}
                  </div>

                  {col.hasInput && (
                    <div className="mt-2">
                      <input
                        type={col.inputType || "text"}
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            col.key,
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs"
                        placeholder={
                          col.inputType === "date"
                            ? "YYYY-MM-DD"
                            : "Buscar..."
                        }
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {isInitialLoading ? (
              Array(5)
                .fill(null)
                .map((_, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-4 border-b border-gray-100"
                      >
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={
                    rowKey
                      ? String(row[rowKey])
                      : idx
                  }
                  className="hover:bg-blue-50/50 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      {col.hasActions ? (
                        <div className="flex justify-center gap-2">
                          {actions
                            .filter(
                              (action) =>
                                action.visible?.(row) ?? true
                            )
                            .map((action) => (
                              <CanAccess
                                key={action.label}
                                permission={action.permission}
                              >
                                <Button
                                  icon={action.icon}
                                  label={action.label}
                                  title={action.title}
                                  color={action.color}
                                  onClick={() =>
                                    action.onClick(row)
                                  }
                                />
                              </CanAccess>
                            ))}
                        </div>
                      ) : (
                        <span
                          onClick={() =>
                            copyToClipboard(
                              getNestedValue(
                                row,
                                col.key
                              )
                            )
                          }
                          className="block cursor-pointer truncate"
                        >
                          {String(
                            getNestedValue(
                              row,
                              col.key
                            ) ?? "-"
                          )}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-4 shrink-0">
        <span className="text-sm text-gray-500">
          Página {page} de {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <Button
            label="Anterior"
            color="gray"
            onClick={goPrev}
            disabled={page === 1}
          />
          <Button
            label="Siguiente"
            color="blue"
            onClick={goNext}
            disabled={page === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTable;