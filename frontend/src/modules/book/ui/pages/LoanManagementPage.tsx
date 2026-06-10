import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import type { TableAction, TableColumn } from "@/shared/types/table/TableTypes";

import {
  faCheck,
  faBook,
  faRotate,
  faPen,
  faArrowRightToBracket,
  faClockRotateLeft,
  faFileExcel,
  faAdd
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useLoans } from "../../hooks/loans/useLoans";
import { LoanStatusMap, type LoanStatusCode } from "../../types/LoanTypes";
import type { Loan } from "../../domain/entities/Loan";
import { useLoansReport } from "../../hooks/loans/useLoansReport";
import { downloadBlob } from "@/shared/utils/downloadBlobl";
import type { ReportExportParams } from "../../types/ReportTypes";
import { HttpError } from "@/shared/errors/HttpError";
import { useReturnLoan } from "../../hooks/loans/useReturnLoan";

import CanAccess from "@/shared/components/permissions/CanAccess";
import ConfirmationModal from "@/shared/components/ConfirmationModal";

const PAGE_SIZE = 15;

const LoanManagementPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [openReturn, setOpenReturn] = useState(false);

  const [filters, setFilters] = useState<Partial<ReportExportParams>>({});
  const exportReport = useLoansReport()

  const { data: loans = [], isLoading, refetch, isRefetching } = useLoans();

  const kpis = useMemo(() => {
    const active = loans.filter(l => l.status === "ACT").length;
    const returned = loans.filter(l => l.status === "DEV").length;

    return {
      active,
      returned,
      total: loans.length
    };
  }, [loans]);

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const getStatusLabel = (status: LoanStatusCode) => {
    return LoanStatusMap[status];
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return loans.slice(start, start + PAGE_SIZE);
  }, [page, loans]);

  const totalPages = Math.ceil(loans.length / PAGE_SIZE);

  const columns: TableColumn[] = useMemo(() => [
    { key: "user", label: "Usuario", hasInput: true },
    { key: "book", label: "Libro", hasInput: true },
    { key: "isbn", label: "ISBN", hasInput: true },
    { key: "deliveryDate", label: "Entrega", hasInput: true, inputType: "date" },
    { key: "expectedDate", label: "Devolución", inputType: "date" },
    { key: "statusLabel", label: "Estado" },
    { key: "actions", label: "Acciones", hasActions: true }
  ], []);

  const data = useMemo(() => {
    return paginated.map(l => ({
      id: l.id,
      user: l.user.name,
      book: l.book.title,
      isbn: l.book.isbn,
      deliveryDate: formatDate(l.expectedReturnDate),
      expectedDate: formatDate(l.expectedReturnDate),
      status: l.status,
      statusLabel: getStatusLabel(l.status)
    }));
  }, [paginated]);


  const actions: TableAction<Loan>[] = [
    {
      title: "Devolver préstamo de libro",
      label: "Devolver",
      color: BUTTON_COLORS.GREEN,
      icon: faArrowRightToBracket,
      onClick: (row: any) => {
        const loan = loans.find(l => l.id === row.id) || null;
        setSelected(loan);
        setOpenReturn(true);
      },
      visible: (row: any) => row.status !== "DEV"
    },

  ];

  const returnBook = useReturnLoan()

  const confirmReturn = async () => {
    try {

      await returnBook.mutateAsync(selected!.id)
      showToast("Préstamo actualizado correctamente", TOAST_TYPES.SUCCESS);

    } catch (error) {
      if (error instanceof HttpError) {
        const errMsg = JSON.parse(error.body).message

        showToast(errMsg, TOAST_TYPES.ERROR);
        return
      }
      showToast("Error al procecar retorno de libro.", TOAST_TYPES.ERROR);
    } finally {
      setOpenReturn(false);
    }
  };

  const getReport = async () => {
    try {
      showToast("Obteniendo reporte", TOAST_TYPES.LOADING)

      const file = await exportReport.mutateAsync(filters)
      downloadBlob(file, "reporte_prestamos_libros.csv")
      hideToast()

      showToast("Reporte exportado exitosamente", TOAST_TYPES.SUCCESS)

    } catch (error) {
      hideToast();

      showToast("Error al generar el reporte", TOAST_TYPES.ERROR)
    }
  }


  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Préstamos
            </h1>
            <p className="text-sm text-slate-500">
              Gestión de préstamos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <CanAccess role="Administrador">
              <Button

                icon={faFileExcel}
                label="Exportar"
                title="Exportar a excel"
                color="green"
                onClick={getReport}
              />
            </CanAccess>
            <Button
              label="Nuevo préstamo"
              icon={faAdd}
              color="blue"
              onClick={() => navigate("/admin/loans/assign/new")}
            />
          </div>
        </div>

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
              label={isRefetching ? "Actualizando..." : "Actualizar"}
              onClick={refetch}
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
            total={loans.length}
            onPageChange={setPage}
            loading={isLoading}
            onFiltersChange={(f) =>
              setFilters(f as ReportExportParams)
            }
          />
        </div>

      </div>

      <ConfirmationModal
        open={openReturn}
        loading={returnBook.isPending}
        title="Confirmar devolución"
        message={`Confirmar devolución del préstamo del libro "${selected?.book.title}" para el usuario ${selected?.user.name}`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmColor="green"
        onConfirm={confirmReturn}
        onCancel={() => setOpenReturn(false)}
      />

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