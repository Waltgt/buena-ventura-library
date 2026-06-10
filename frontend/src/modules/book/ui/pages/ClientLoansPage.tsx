import { useMemo, useState } from "react"

import DataTable from "@/shared/components/DataTable"
import Toast from "@/shared/components/Toast"

import { useToast } from "@/shared/hooks/useToast"
import type { TableColumn } from "@/shared/types/table/TableTypes"

import { LoanStatusMap, type LoanStatusCode } from "../../types/LoanTypes"

import { useLoansByAuthUser } from "../../hooks/loans/useLoansByAuthUser"

const PAGE_SIZE = 10

const ClientLoansPage = () => {
  const { toast, hideToast } = useToast()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useLoansByAuthUser()

  const loans = data ?? []

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "-"

  const getStatusLabel = (status: LoanStatusCode) => {
    return LoanStatusMap[status]
  }

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return loans.slice(start, start + PAGE_SIZE)
  }, [page, loans])

  const columns: TableColumn[] = useMemo(() => [
    { key: "book", label: "Libro", hasInput: true },
    { key: "isbn", label: "ISBN", hasInput: true },
    { key: "deliveryDate", label: "Entrega", hasInput: true, inputType: "date" },
    { key: "expectedDate", label: "Devolución", inputType: "date" },
    { key: "statusLabel", label: "Estado", hasInput: true },
  ], [])

  const tableData = useMemo(() => {
    return paginated.map((l: any) => ({
      id: l.id,
      book: l.book.title,
      isbn: l.book.isbn,
      deliveryDate: formatDate(l.deliveryDate),
      expectedDate: formatDate(l.expectedReturnDate),
      statusLabel: getStatusLabel(l.status)
    }))
  }, [paginated])

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Mis Préstamos
          </h1>
          <p className="text-sm text-slate-500">
            Consulta los libros que tienes asignados
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-500">
            Cargando préstamos...
          </div>
        )}

        {!isLoading && loans.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-500">
            No se han encontrado libros en préstamo
          </div>
        )}

        {!isLoading && loans.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={tableData}
              page={page}
              pageSize={PAGE_SIZE}
              total={loans.length}
              onPageChange={setPage}
              loading={isLoading}
            />
          </div>
        )}

      </div>

      <div className="fixed top-4 right-4 z-[9999]">
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      </div>
    </>
  )
}

export default ClientLoansPage