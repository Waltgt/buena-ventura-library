import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";

import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "../../hooks/books/useBooks";
import type { TableAction, TableColumn } from "@/shared/types/table/TableTypes";
import type { Book } from "../../domain/entities/Book";

const BooksListPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: books = [], isLoading: booksLoading } = useBooks();


  const columns: TableColumn[] = useMemo(() => [
    { key: "isbn", label: "ISBN", hasInput: true },
    { key: "title", label: "Título", hasInput: true  },
    { key: "author.name", label: "Autor", hasInput: true  },
    { key: "editorial.name", label: "Editorial", hasInput: true  },
    { key: "publicationDate", label: "Fecha de publicación", hasInput: true, inputType: "date" },
    { key: "status", label: "Estado", hasInput: true  },
    { key: "actions", label: "Acciones", hasActions: true },
  ], []);

  const actions: TableAction<Book>[] = [
    {
      title: "Ver detalles de libros",
      label: "Ver",
      color: BUTTON_COLORS.GRAY,
      icon: faEye,
      onClick: (row: any) =>
        navigate(`detail/${row.id}`),
    }

  ];

  return (
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

    </div>
  );
};

export default BooksListPage;