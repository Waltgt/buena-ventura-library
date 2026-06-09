import { useState, useCallback } from "react";
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

type BookForm = {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  editorial: string;
  date: string;
  quantity: string;
};

type FormErrors = {
  isbn?: string;
  title?: string;
  author?: string;
  quantity?: string;
};

const initialForm: BookForm = {
  isbn: "",
  title: "",
  author: "",
  editorial: "",
  date: "",
  quantity: ""
};

const BookFormPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  const { toast, showToast, hideToast } = useToast();

  const [editing, setEditing] = useState<BookForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);


  const validate = useCallback(() => {

    const newErrors: FormErrors = {};

    if (!editing.isbn.trim())
      newErrors.isbn = "Debe ingresar el código ISBN";

    if (!editing.title.trim())
      newErrors.title = "Debe ingresar el título";

    if (!editing.author.trim())
      newErrors.author = "Debe ingresar el autor";

    if (!editing.quantity || Number(editing.quantity) <= 0)
      newErrors.quantity = "Cantidad inválida";

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      showToast("Campos inválidos, revise el formulario.", TOAST_TYPES.ERROR);
    }

    return isValid;

  }, [editing]);

  const save = useCallback(async () => {

    if (!validate()) return;

    setSaving(true);

    try {

      const payload = {
        ...editing,
        quantity: Number(editing.quantity),
      };

      if (isEdit) {
        // await updateBook.mutateAsync(payload)
      } else {
        // await createBook.mutateAsync(payload)
      }

      showToast(
        isEdit
          ? "Libro actualizado correctamente"
          : "Libro registrado correctamente",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(() => navigate(-1), 1200);

    } catch (error) {
      showToast("Error al guardar libro", TOAST_TYPES.ERROR);
    } finally {
      setSaving(false);
    }

  }, [editing, validate]);

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
              <Input
                value={editing.author}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, author: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Editorial">
              <Input
                value={editing.editorial}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, editorial: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Fecha de publicación">
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
            label={saving
              ? "Guardando..."
              : isEdit
                ? "Actualizar libro"
                : "Registrar libro"
            }
            onClick={save}
            disabled={saving}
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