import { useMemo, useState } from "react";

import Button from "@/shared/components/forms/Button";

type Loan = {
  id_loan: number;
  user_loan_name: string;
  delivery_date: string;
  expected_return_date: string;
  real_return_date: string | null;
  status_code: string;
};

type Props = {
  loans?: Loan[];
};

const BookLoanHistory: Loan[] = Array.from({ length: 20 }).map((_, i) => ({
  id_loan: i + 1,
  user_loan_name: `Usuario ${i + 1}`,
  delivery_date: "2026-01-01",
  expected_return_date: "2026-01-10",
  real_return_date: i % 3 === 0 ? "2026-01-09" : null,
  status_code: i % 3 === 0 ? "DEV" : "ACT"
}));

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString() : "-";

const resolveStatus = (loan: Loan) => {
  if (loan.status_code === "DEV") return "Devuelto";

  const today = new Date();
  const due = new Date(loan.expected_return_date);

  if (!loan.real_return_date && today > due) return "Vencido";

  return "Activo";
};

const getStatusClass = (s: string) => {
  switch (s) {
    case "Activo": return "text-blue-600";
    case "Devuelto": return "text-slate-500";
    case "Vencido": return "text-yellow-600";
    default: return "";
  }
};

const PAGE_SIZE = 5;

const BookLoanHistoryCards = ({ loans }: Props) => {

  const [page, setPage] = useState(1);

  const data = useMemo(() => {
    const source = loans?.length ? loans : BookLoanHistory;

    return source.map((l) => ({
      ...l,
      status: resolveStatus(l),
      delivery: formatDate(l.delivery_date),
      expected: formatDate(l.expected_return_date),
      returned: formatDate(l.real_return_date)
    }));
  }, [loans]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginated = data.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
            key={loan.id_loan}
            className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >

            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">
                {loan.user_loan_name}
              </span>

              <span className="text-xs text-slate-400">
                {loan.delivery} → {loan.expected}
              </span>
            </div>

            <div className="text-right">
              <span className={`text-xs font-semibold ${getStatusClass(loan.status)}`}>
                {loan.status}
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