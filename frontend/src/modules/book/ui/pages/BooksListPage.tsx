import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import Button from "@/shared/components/forms/Button";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BooksListPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  //todo: agregar hook de getall
  const books: any[] = [];

  const columns = useMemo(() => [
    { key: "isbn", label: "ISBN" },
    { key: "title", label: "Título" },
    { key: "author", label: "Autor" },
    { key: "editorial", label: "Editorial" },
    { key: "available", label: "Disponibles" },
    { key: "actions", label: "Acciones", hasActions: true },
  ], []);

  const actions = [
    {
      label: "Ver detalle",
      color: "blue",
      onClick: (row: any) => navigate(`/books/${row.id}`)
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
          actions={actions as any}
          page={page}
          pageSize={pageSize}
          total={books.length}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
};

export default BooksListPage;