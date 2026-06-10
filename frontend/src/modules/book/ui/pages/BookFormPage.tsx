import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";

import {
  faArrowLeft,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/shared/components/forms/Select";

import { BOOK_STATUS, type BookRequestParams } from "../../types/BookTypes";
import { useBookById } from "../../hooks/books/useBookById";
import { useCreateBook } from "../../hooks/books/useCreateBook";
import { useUpdateBook } from "../../hooks/books/useUpdateBook";

type BookForm = {
  id?: number;
  isbn: string;
  title: string;
  author: number;
  editorial: number;
  date: string;
  quantity: string;
};

type FormErrors = {
  isbn?: string;
  title?: string;
  author?: string;
  quantity?: string;
  editorial?: string;
  date?: string;
};

const initialForm: BookForm = {
  isbn: "",
  title: "",
  author: 0,
  editorial: 0,
  date: "",
  quantity: ""
};

const BookFormPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const bookId = Number(id);
  const isEdit = Number.isFinite(bookId);

  const { toast, showToast, hideToast } = useToast();

  const [editing, setEditing] = useState<BookForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading } = useBookById(bookId, { enabled: isEdit });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const isProcessing = submitted || createBook.isPending || updateBook.isPending;

  useEffect(() => {
    if (!data) return;

    setEditing({
      id: data.id,
      isbn: data.isbn ?? "",
      title: data.title ?? "",
      author: data.author?.id ?? 0,
      editorial: data.editorial?.id ?? 0,
      date: data.publicationDate ?? "",
      quantity: String(data.stock ?? "")
    });

  }, [data]);

  const validate = useCallback(() => {

    const newErrors: FormErrors = {};

    if (!editing.isbn.trim())
      newErrors.isbn = "Debe ingresar el código ISBN";

    if (!editing.title.trim())
      newErrors.title = "Debe ingresar el título";

    if (!editing.author || editing.author === 0)
      newErrors.author = "Debe seleccionar el autor";

    if (!editing.editorial || editing.editorial === 0)
      newErrors.editorial = "Debe seleccionar la editorial";

    if (!editing.quantity || Number(editing.quantity) <= 0)
      newErrors.quantity = "Cantidad inválida";

    if (!editing.date) {
      newErrors.date = "Debe ingresar la fecha de publicación";
    } else {
      const selectedDate = new Date(editing.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.date = "La fecha no puede ser futura";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      showToast("Campos inválidos, revise el formulario.", TOAST_TYPES.ERROR);
    }

    return isValid;

  }, [editing, showToast]);

  const save = useCallback(async () => {

    if (isProcessing) return;
    if (!validate()) return;

    setSubmitted(true);

    try {

      const payload: BookRequestParams = {
        id: editing.id,
        isbn: editing.isbn,
        title: editing.title,
        authorId: editing.author,
        editorialId: editing.editorial,
        publicationDate: editing.date,
        stock: Number(editing.quantity),
        status: isEdit
          ? (data?.status || BOOK_STATUS.AVAILABLE)
          : BOOK_STATUS.AVAILABLE
      };

      let response;

      if (isEdit) {
        response = await updateBook.mutateAsync(payload);
      } else {
        response = await createBook.mutateAsync(payload);
      }

      const bookId = isEdit ? editing.id : response?.id;

      showToast(
        isEdit
          ? "Libro actualizado correctamente"
          : "Libro registrado correctamente",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(() => {
        navigate(`/admin/books/detail/${bookId}`);
      }, 1000);

    } catch {
      showToast("Error al guardar libro", TOAST_TYPES.ERROR);
      setSubmitted(false);
    }

  }, [editing, isEdit, validate, data, createBook, updateBook, navigate, showToast, isProcessing]);

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              {isEdit ? "Editar libro" : "Registrar libro"}
            </h1>

            <p className="text-sm text-slate-500">
              Gestión del catálogo de biblioteca
            </p>
          </div>

          <Button
            icon={faArrowLeft}
            label="Volver"
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField label="ISBN" error={errors.isbn}>
              <Input
                value={editing.isbn}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, isbn: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Título" error={errors.title}>
              <Input
                value={editing.title}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, title: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Autor" error={errors.author}>
              <Select
                value={editing.author}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, author: Number(e.target.value) }))
                }
              >
                <option value={0}>Seleccionar</option>
                <option value={1}>Gabriel García Márquez</option>
                <option value={2}>Jorge Luis Borges</option>
                <option value={3}>Julio Cortázar</option>
                <option value={4}>Mario Vargas Llosa</option>
              </Select>
            </FormField>

            <FormField label="Editorial" error={errors.editorial}>
              <Select
                value={editing.editorial}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, editorial: Number(e.target.value) }))
                }
              >
                <option value={0}>Seleccionar</option>
                <option value={1}>Penguin Random House</option>
                <option value={2}>Editorial Planeta</option>
                <option value={3}>Alfaguara</option>
                <option value={4}>Fondo de Cultura Económica</option>
                <option value={5}>Editorial Sudamericana</option>
              </Select>
            </FormField>

            <FormField label="Fecha de publicación" error={errors.date}>
              <Input
                type="date"
                value={editing.date}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, date: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Cantidad disponible" error={errors.quantity}>
              <Input
                type="number"
                value={editing.quantity}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, quantity: e.target.value }))
                }
              />
            </FormField>

          </div>
        </div>

        <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex justify-end gap-3">

          <Button
            label="Cancelar"
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />

          <Button
            icon={faSave}
            color="blue"
            label={
              isProcessing
                ? "Guardando..."
                : isEdit
                  ? "Actualizar libro"
                  : "Registrar libro"
            }
            onClick={save}
            disabled={isProcessing}
          />

        </div>

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
  );
};

export default BookFormPage;