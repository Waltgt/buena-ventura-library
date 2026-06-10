import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Skeleton from "@/shared/components/Skeleton";

import BookLoanHistory from "../components/BookLoanHistory";
import { useBookById } from "../../hooks/books/useBookById";
import { BOOK_STATUS } from "../../types/BookTypes";

import {
  faArrowLeft,
  faUser,
  faPen,
  faBook
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const BookDetailsPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bookData, isLoading } = useBookById(Number(id));


  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton width="w-64" height="h-6" />
            <Skeleton width="w-40" height="h-4" />
            <Skeleton width="w-24" height="h-6" />
          </div>

          <div className="flex gap-3">
            <Skeleton width="w-24" height="h-10" />
            <Skeleton width="w-24" height="h-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
              <Skeleton width="w-20" height="h-4" />
              <Skeleton width="w-32" height="h-5" className="mt-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton width="w-48" height="h-5" />

              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton width="w-20" height="h-3" />
                  <Skeleton width="w-40" height="h-4" className="mt-1" />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-3">
              <Skeleton width="w-40" height="h-5" />
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height="h-4" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 space-y-3">
              <Skeleton width="w-32" height="h-5" />
              <Skeleton width="w-full" height="h-16" />
            </div>

            <div className="bg-white rounded-2xl p-5">
              <Skeleton width="w-full" height="h-10" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Libro no encontrado</p>
      </div>
    );
  }

  const isAvailable = (bookData.stock ?? 0) > 0;

  const canAssign =
    isAvailable && bookData.status === BOOK_STATUS.AVAILABLE;

  const statusStyles = isAvailable
    ? "bg-blue-50 text-blue-700"
    : "bg-slate-100 text-slate-600";

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {bookData.title}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            ISBN: {bookData.isbn}
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
            onClick={() => navigate(`/admin/books/edit/${bookData.id}`)}
          />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-slate-400">Autor</p>
          <p className="font-medium text-slate-700">
            {bookData.author.name}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-slate-400">Editorial</p>
          <p className="font-medium text-slate-700">
            {bookData.editorial.name}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-slate-400">Publicación</p>
          <p className="font-medium text-slate-700">
            {bookData.publicationDate}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-slate-400">Disponibles</p>
          <p className="text-xl font-semibold text-slate-800">
            {bookData.stock}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faBook} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-700">
                Información del libro
              </h2>
            </div>

            <div className="space-y-4">
              <p><strong>Título:</strong> {bookData.title}</p>
              <p><strong>Autor:</strong> {bookData.author.name}</p>
              <p><strong>Editorial:</strong> {bookData.editorial.name}</p>
              <p><strong>Fecha:</strong> {bookData.publicationDate}</p>
            </div>

          </div>

          <BookLoanHistory bookId={bookData.id} />

        </div>

        <div className="space-y-5">

          <div className="bg-white rounded-2xl p-5">

            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
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

            {bookData.status === BOOK_STATUS.LOANED && (
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
            <div className="bg-white rounded-2xl p-5">
              <Button
                label="Asignar libro"
                color="blue"
                className="w-full"
                onClick={() =>
                  navigate(`/admin/loans/assign`)
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