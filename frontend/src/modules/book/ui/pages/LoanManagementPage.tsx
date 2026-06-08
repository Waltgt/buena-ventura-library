import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import Input from "@/shared/components/forms/Input";
import Button from "@/shared/components/forms/Button";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import type { TableColumn } from "@/shared/types/table/TableTypes";

import {
  faPlus,
  faRotate,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

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

const dummyLoans: Loan[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  user: `Usuario ${i + 1}`,
  book: "Cien Años de Soledad",
  isbn: "978-84-376-0494-7",
  deliveryDate: "2026-01-01",
  expectedDate: "2026-01-10",
  realDate: i % 3 === 0 ? "2026-01-09" : null,
  status: i % 3 === 0 ? "DEV" : "ACT"
}));

const LoanManagementPage = () => {

  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Loan | null>(null);
  const [openReturn, setOpenReturn] = useState(false);

  const kpis = useMemo(() => {
    const active = dummyLoans.filter(l => l.status === "ACT").length;
    const returned = dummyLoans.filter(l => l.status === "DEV").length;

    return { active, returned, total: dummyLoans.length };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return dummyLoans.filter(l =>
      l.user.toLowerCase().includes(q) ||
      l.book.toLowerCase().includes(q) ||
      l.isbn.includes(q)
    );
  }, [search]);

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const resolveStatus = (loan: Loan) => {
    if (loan.status === "DEV") return "Devuelto";

    const today = new Date();
    const due = new Date(loan.expectedDate);

    if (!loan.realDate && today > due) return "Vencido";

    return "Activo";
  };

  const columns: TableColumn[] = useMemo(() => [
    { key: "user", label: "Usuario" },
    { key: "book", label: "Libro" },
    { key: "isbn", label: "ISBN" },
    { key: "deliveryDate", label: "Entrega" },
    { key: "expectedDate", label: "Devolución" },
    { key: "statusLabel", label: "Estado" },
    { key: "actions", label: "Acciones", hasActions: true },
  ], []);

  const data = useMemo(() => {
    return filtered.map((l) => ({
      ...l,
      deliveryDate: formatDate(l.deliveryDate),
      expectedDate: formatDate(l.expectedDate),
      statusLabel: resolveStatus(l)
    }));
  }, [filtered]);

  const actions = [
    {
      label: "Extender",
      color: "blue",
      onClick: (row: Loan) => navigate(`/loans/edit/${row.id}`)
    },
    {
      label: "Devolver",
      color: "green",
      onClick: (row: Loan) => {
        setSelected(row);
        setOpenReturn(true);
      }
    }
  ];

  const confirmReturn = () => {
    showToast("Libro devuelto correctamente", TOAST_TYPES.SUCCESS);
    setOpenReturn(false);
  };

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Préstamos
            </h1>
            <p className="text-sm text-slate-500">
              Gestión de préstamos de libros
            </p>
          </div>

          <Button
            icon={faPlus}
            label="Nuevo préstamo"
            color="blue"
            onClick={() => navigate("/loans/assign")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Activos</p>
            <p className="text-xl font-semibold text-blue-700">{kpis.active}</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Devueltos</p>
            <p className="text-xl font-semibold text-slate-700">{kpis.returned}</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Total</p>
            <p className="text-xl font-semibold text-slate-800">{kpis.total}</p>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <Input
            placeholder="Buscar por ISBN, título o usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            actions={actions as any}
            page={page}
            pageSize={10}
            total={data.length}
            onPageChange={setPage}
          />
        </div>

      </div>

      <Modal
        abierto={openReturn}
        onClose={() => setOpenReturn(false)}
        titulo="Confirmar devolución"
      >
        <div className="space-y-4">

          <p className="text-sm text-slate-600">
            ¿Desea marcar como devuelto este libro?
          </p>

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

      <div className="fixed top-4 right-4 z-[9999]">
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