import { useMemo, useState } from "react";
import Button from "@/shared/components/forms/Button";
import Skeleton from "@/shared/components/Skeleton";

import { LoanStatusMap } from "../../types/LoanTypes";
import type { Loan } from "../../domain/entities/Loan";
import { useLoanBookHistory } from "../../hooks/loans/useLoanBookHistory";
import { useNavigate } from "react-router-dom";

type Props = {
  bookId: number;
};

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString() : "-";

const getStatusClass = (status: Loan["status"]) => {
  if (status === "ACT") return "text-blue-600";
  if (status === "DEV") return "text-slate-500";
  if (status === "VENC") return "text-yellow-600";
  return "";
};

const PAGE_SIZE = 5;

const BookLoanHistoryCards = ({ bookId }: Props) => {

  const navigate = useNavigate()
  const [page, setPage] = useState(1);

  const { data: loans, isLoading } = useLoanBookHistory(bookId);

  const data = useMemo(() => {
    if (!loans) return [];

    return loans.map((l) => ({
      ...l,
      expected: formatDate(l.expectedReturnDate),
      returned: formatDate(l.realReturnDate),
    }));
  }, [loans]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginated = data.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <Skeleton width="w-40" height="h-4" />
          <Skeleton width="w-20" height="h-4" />
        </div>

        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="px-5 py-3 flex items-center justify-between"
            >
              <div className="flex flex-col gap-2">
                <Skeleton width="w-32" height="h-4" />
                <Skeleton width="w-40" height="h-3" />
              </div>

              <div className="flex flex-col items-end gap-2">
                <Skeleton width="w-28" height="h-4" />
                <Skeleton width="w-12" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-sm text-slate-500">
          No hay historial
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          Historial de préstamos
        </h2>

        <span className="text-xs text-slate-400">
          {data.length} registros
        </span>
      </div>

      <div className="divide-y divide-slate-100">

        {paginated.map((loan) => (
          <div
            key={loan.id}
            className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">
                {loan.user.name}
              </span>

              <span className="text-xs text-slate-400">
                Retorno esperado: {loan.expected} → Retorno real: {loan.returned}
              </span>
            </div>

            <div className="text-right">
              <span className={`text-xs font-semibold ${getStatusClass(loan.status)}`}>
                {LoanStatusMap[loan.status]}
              </span>

              <div className="text-xs text-slate-400">
                {loan.returned}
              </div>
            </div>

          </div>
        ))}

      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">

          <Button
            label="Anterior"
            color="gray"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />

          <span className="text-xs text-slate-400">
            Página {page} de {totalPages}
          </span>

          <Button
            label="Siguiente"
            color="gray"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          />

        </div>
      )}

    </div>
  );
};

export default BookLoanHistoryCards;