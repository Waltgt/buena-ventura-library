import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import Button from "@/shared/components/forms/Button";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import type { TableColumn } from "@/shared/types/table/TableTypes";

import {
  faCheck,
  faBook,
  faRotate,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Loan = {
  id: number;
  user: string;
  book: string;
  isbn: string;
  deliveryDate: string;
  expectedDate: string;
  realDate?: string | null;
  status: "ACT" | "DEV" | "VENC";
};

const PAGE_SIZE = 15;

const dummyLoans: Loan[] = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  user: `Usuario ${i + 1}`,
  book: "Cien Años de Soledad",
  isbn: "978-84-376-0494-7",
  deliveryDate: "2026-01-01",
  expectedDate: "2026-01-10",
  realDate: i % 4 === 0 ? "2026-01-09" : null,
  status: i % 4 === 0 ? "DEV" : "ACT"
}));

const LoanManagementPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [openReturn, setOpenReturn] = useState(false);

  const kpis = useMemo(() => {
    const active = dummyLoans.filter(l => l.status === "ACT").length;
    const returned = dummyLoans.filter(l => l.status === "DEV").length;

    return {
      active,
      returned,
      total: dummyLoans.length
    };
  }, []);

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const resolveStatus = (loan: Loan) => {
    if (loan.status === "DEV") return "Devuelto";

    const today = new Date();
    const due = new Date(loan.expectedDate);

    if (!loan.realDate && today > due) return "Vencido";

    return "Activo";
  };

  const getStatusBadge = (loan: Loan) => {
    const status = resolveStatus(loan);

    if (status === "Activo") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Activo
        </span>
      );
    }

    if (status === "Vencido") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Vencido
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        Devuelto
      </span>
    );
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return dummyLoans.slice(start, start + PAGE_SIZE);
  }, [page]);

  const totalPages = Math.ceil(dummyLoans.length / PAGE_SIZE);

  const columns: TableColumn[] = useMemo(() => [
    { key: "user", label: "Usuario", hasInput: true },
    { key: "book", label: "Libro", hasInput: true },
    { key: "isbn", label: "ISBN" , hasInput: true},
    { key: "deliveryDate", label: "Entrega" , hasInput: true, inputType: "date"},
    { key: "expectedDate", label: "Devolución" , inputType: "date"},
    { key: "statusLabel", label: "Estado" },
    { key: "actions", label: "Acciones", hasActions: true }
  ], []);

  const data = useMemo(() => {
    return paginated.map(l => ({
      ...l,
      deliveryDate: formatDate(l.deliveryDate),
      expectedDate: formatDate(l.expectedDate),
      statusLabel: getStatusBadge(l)
    }));
  }, [paginated]);

  const actions = [
    {
      label: "Editar",
      color: "blue",
      icon: faPen,
      onClick: (row: Loan) => {
        navigate(`/admin/books/assign/edit/${row.id}`);
      },
      hidden: (row: Loan) => row.status === "DEV"
    },
    {
      label: "Devolver",
      color: "green",
      onClick: (row: Loan) => {
        setSelected(row);
        setOpenReturn(true);
      },
      hidden: (row: Loan) => row.status === "DEV"
    }
  ];

  const confirmReturn = () => {
    showToast("Préstamo actualizado correctamente", TOAST_TYPES.SUCCESS);
    setOpenReturn(false);
  };

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Préstamos
            </h1>
            <p className="text-sm text-slate-500">
              Gestión de préstamos del sistema
            </p>
          </div>

          <Button
            label="Nuevo préstamo"
            color="blue"
            onClick={() => navigate("/admin/books/assign")}
          />
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <FontAwesomeIcon icon={faBook} />
              Activos
            </div>
            <p className="text-xl font-semibold text-blue-600 mt-2">
              {kpis.active}
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <div className="text-slate-500 text-sm">
              Devueltos
            </div>
            <p className="text-xl font-semibold text-green-600 mt-2">
              {kpis.returned}
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <div className="text-slate-500 text-sm">
              Total
            </div>
            <p className="text-xl font-semibold text-slate-800 mt-2">
              {kpis.total}
            </p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-slate-800">
                Lista de préstamos
              </h2>
              <p className="text-xs text-slate-500">
                Página {page} de {totalPages}
              </p>
            </div>

            <Button
              icon={faRotate}
              label="Actualizar"
              color="gray"
              variant="outline"
            />
          </div>

          <DataTable
            columns={columns}
            data={data}
            actions={actions as any}
            page={page}
            pageSize={PAGE_SIZE}
            total={dummyLoans.length}
            onPageChange={setPage}
          />
        </div>

      </div>

      {/* MODAL */}
      <Modal
        abierto={openReturn}
        onClose={() => setOpenReturn(false)}
        titulo="Confirmar devolución"
      >
        <div className="space-y-4">

          <p className="text-slate-600">
            Confirmar devolución del préstamo:
          </p>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="font-medium">{selected?.book}</p>
            <p className="text-sm text-slate-500">
              Usuario: {selected?.user}
            </p>
          </div>

          <div className="flex justify-end gap-3">

            <Button
              label="Cancelar"
              color="gray"
              variant="outline"
              onClick={() => setOpenReturn(false)}
            />

            <Button
              icon={faCheck}
              label="Confirmar"
              color="green"
              onClick={confirmReturn}
            />

          </div>

        </div>
      </Modal>

      {/* TOAST */}
      <div className="fixed top-4 right-4 z-[99999]">
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      </div>
    </>
  );
};

export default LoanManagementPage;