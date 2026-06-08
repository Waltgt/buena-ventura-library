import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";

import {
  faArrowLeft,
  faUser,
  faPen,
  faBook
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookLoanHistory from "../components/BookLoanHistory";

const BookDetailsPage = () => {

  const navigate = useNavigate();

  const book = {
    id: 1,
    isbn: "978-84-376-0494-7",
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    editorial: "Sudamericana",
    publicationDate: "1967-05-30",
    available: 3,
    total: 5,
    restricted: false 
  };

  const isAvailable = book.available > 0;

  const canAssign = isAvailable && !book.restricted;

  const statusStyles = isAvailable
    ? "bg-blue-50 text-blue-700"
    : "bg-slate-100 text-slate-600";

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {book.title}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            ISBN: {book.isbn}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles}`}
          >
            {isAvailable ? "Disponible" : "Sin stock"}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            icon={faArrowLeft}
            label="Volver"
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />

          <Button
            icon={faPen}
            label="Editar"
            color="blue"
            onClick={() => navigate(`/books/edit/${book.id}`)}
          />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-400">Autor</p>
          <p className="font-medium text-slate-700">
            {book.author}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-400">Editorial</p>
          <p className="font-medium text-slate-700">
            {book.editorial}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-400">Publicación</p>
          <p className="font-medium text-slate-700">
            {book.publicationDate}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-400">
            Disponibles
          </p>
          <p className="text-xl font-semibold text-slate-800">
            {book.available} / {book.total}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faBook} className="text-blue-600"/>
              <h2 className="text-lg font-semibold text-slate-700">
                Información del libro
              </h2>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-slate-400">Título</p>
                <p className="font-medium text-slate-700">
                  {book.title}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Autor</p>
                <p className="font-medium text-slate-700">
                  {book.author}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Editorial</p>
                <p className="font-medium text-slate-700">
                  {book.editorial}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Fecha publicación</p>
                <p className="font-medium text-slate-700">
                  {book.publicationDate}
                </p>
              </div>

            </div>

          </div>

          <BookLoanHistory/>

        </div>

        <div className="space-y-5">

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faUser} className="text-blue-600"/>
              <h2 className="font-semibold text-slate-700">
                Estado
              </h2>
            </div>

            {isAvailable ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-blue-700 font-medium">
                  Disponible
                </p>
                <p className="text-sm text-blue-600">
                  Unidades disponibles para préstamo
                </p>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                <p className="text-slate-600 font-medium">
                  Sin disponibilidad
                </p>
                <p className="text-sm text-slate-500">
                  No hay unidades disponibles
                </p>
              </div>
            )}

            {book.restricted && (
              <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-yellow-700 font-medium">
                  Restringido
                </p>
                <p className="text-sm text-yellow-600">
                  Este libro no puede prestarse actualmente
                </p>
              </div>
            )}

          </div>

          {canAssign && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

              <Button
                label="Asignar libro"
                color="blue"
                className="w-full"
                onClick={() =>
                  navigate(`/loans/assign?book=${book.id}`)
                }
              />

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default BookDetailsPage;