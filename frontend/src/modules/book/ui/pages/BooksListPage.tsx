import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import DataTable from "@/shared/components/DataTable"
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button"

import { faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useBooks } from "../../hooks/books/useBooks"
import type { TableAction, TableColumn } from "@/shared/types/table/TableTypes"
import type { Book } from "../../domain/entities/Book"

import ConfirmationModal from "@/shared/components/ConfirmationModal"
import { useRemoveBook } from "../../hooks/books/useRemoveBook"

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import { HttpError } from "@/shared/errors/HttpError"

const BooksListPage = () => {
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: books = [], isLoading: booksLoading } = useBooks()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const removeBook = useRemoveBook()

  const columns: TableColumn[] = useMemo(() => [
    { key: "isbn", label: "ISBN", hasInput: true },
    { key: "title", label: "Título", hasInput: true },
    { key: "author.name", label: "Autor", hasInput: true },
    { key: "editorial.name", label: "Editorial", hasInput: true },
    { key: "publicationDate", label: "Fecha de publicación", hasInput: true, inputType: "date" },
    { key: "status", label: "Estado", hasInput: true },
    { key: "actions", label: "Acciones", hasActions: true },
  ], [])

  const handleDeleteClick = (row: Book) => {
    setSelectedBook(row)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedBook) return

    try {
      await removeBook.mutateAsync(selectedBook.id)
      showToast("Libro eliminado permanentemente de manera exitosa.", TOAST_TYPES.SUCCESS)
    } catch(error) {
      if(error instanceof HttpError) {
        const msgError = JSON.parse(error.body).error

        if(msgError) {
          showToast(msgError, TOAST_TYPES.ERROR)
          return
        }
        
      }
      showToast("Ha ocurrido un error al eliminar el libro.", TOAST_TYPES.ERROR)
    } finally {
      setDeleteOpen(false)
      setSelectedBook(null)
    }



  }

  const handleCancelDelete = () => {
    setDeleteOpen(false)
    setSelectedBook(null)
  }

  const actions: TableAction<Book>[] = [
    {
      title: "Ver detalles de libros",
      label: "Ver",
      color: BUTTON_COLORS.GREEN,
      icon: faEye,
      onClick: (row: any) =>
        navigate(`detail/${row.id}`),
    },
    {
      title: "Eliminar libro permanentemente",
      label: "Eliminar",
      color: BUTTON_COLORS.RED,
      icon: faTrash,
      onClick: (row: any) =>
        handleDeleteClick(row),
    }
  ]

  return (
    <>
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Libros
          </h1>
          <p className="text-sm text-slate-500">
            Gestión de catálogo de libros
          </p>
        </div>

        <Button
          icon={faPlus}
          label="Registrar libro"
          onClick={() => navigate("create")}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={books}
          actions={actions}
          page={page}
          pageSize={pageSize}
          total={books.length}
          onPageChange={setPage}
          loading={booksLoading}
        />
      </div>

      <ConfirmationModal
        open={deleteOpen}
        title="Eliminar libro"
        message={`¿Seguro que deseas eliminar el libro "${selectedBook?.title}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
      />

    </div>
    <div className="fixed top-4 right-4 z-[99999]">
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

export default BooksListPage