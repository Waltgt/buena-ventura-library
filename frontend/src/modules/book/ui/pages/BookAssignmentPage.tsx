import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import DataList from "@/shared/components/forms/DataList";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";

type Option = {
  id: string;
  label: string;
  subtitle?: string;
};

type FormState = {
  user: Option | null;
  book: Option | null;
  returnDate: string;
};

type FormErrors = {
  user?: string;
  book?: string;
  returnDate?: string;
};

const dummyUsers: Option[] = [
  { id: "1", label: "John Doe", subtitle: "12345678" },
  { id: "2", label: "Ana López", subtitle: "87654321" },
  { id: "3", label: "Carlos Pérez", subtitle: "99999999" }
];

const dummyBooks: Option[] = [
  { id: "1", label: "Cien Años de Soledad", subtitle: "978-84-376-0494-7" },
  { id: "2", label: "Don Quijote", subtitle: "978-84-376-0494-8" }
];

const BookAssignmentPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();

  const isEdit = !!id;

  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState<FormState>({
    user: null,
    book: null,
    returnDate: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const bookFromQuery = params.get("book");

  useEffect(() => {
    if (bookFromQuery && !form.book) {
      const found = dummyBooks.find((b) => b.id === bookFromQuery);
      if (found) {
        setForm((prev) => ({ ...prev, book: found }));
      }
    }
  }, [bookFromQuery]);

  useEffect(() => {
    if (isEdit) {
      setForm({
        user: dummyUsers[0],
        book: dummyBooks[0],
        returnDate: "2026-07-01"
      });
    }
  }, [isEdit]);

  const validate = useCallback(() => {

    const newErrors: FormErrors = {};

    if (!form.user)
      newErrors.user = "Seleccione un usuario";

    if (!form.book)
      newErrors.book = "Seleccione un libro";

    if (!form.returnDate)
      newErrors.returnDate = "Fecha requerida";

    const today = new Date();
    const selected = new Date(form.returnDate);

    if (form.returnDate && selected <= today)
      newErrors.returnDate = "Debe ser una fecha futura";

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      showToast("Campos inválidos, revise el formulario.", TOAST_TYPES.ERROR);
    }

    return isValid;

  }, [form]);

  const save = useCallback(async () => {

    if (!validate()) return;

    setSaving(true);

    try {

      const payload = {
        userId: Number(form.user!.id),
        bookId: Number(form.book!.id),
        returnDate: form.returnDate
      };

      if (isEdit) {
        // await updateLoan.mutateAsync(payload)
        showToast("Préstamo actualizado", TOAST_TYPES.SUCCESS);
      } else {

        const userHasBook = false;
        const bookAvailable = true;

        if (userHasBook) {
          showToast("El usuario ya tiene un préstamo activo", TOAST_TYPES.ERROR);
          return;
        }

        if (!bookAvailable) {
          showToast("No hay disponibilidad de unidades", TOAST_TYPES.ERROR);
          return;
        }

        // await createLoan.mutateAsync(payload)
        showToast("Préstamo registrado correctamente", TOAST_TYPES.SUCCESS);
      }

      setTimeout(() => navigate(-1), 1200);

    } catch (e) {
      showToast("Error en la operación", TOAST_TYPES.ERROR);
    } finally {
      setSaving(false);
    }

  }, [form, validate, isEdit]);

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              {isEdit ? "Extender préstamo" : "Asignación de libro"}
            </h1>

            <p className="text-sm text-slate-500">
              {isEdit
                ? "Extensión de fecha de devolución"
                : "Asignación de libro a usuario"}
            </p>
          </div>

          <Button
            label="Volver"
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

          <FormField label="Usuario" error={errors.user}>
            <DataList
              options={dummyUsers}
              value={form.user}
              onChange={(v) =>
                setForm((p) => ({ ...p, user: v }))
              }
              placeholder="Buscar usuario"
              disabled={isEdit}
            />
          </FormField>

          <FormField label="Libro" error={errors.book}>
            <DataList
              options={dummyBooks}
              value={form.book}
              onChange={(v) =>
                setForm((p) => ({ ...p, book: v }))
              }
              placeholder="Buscar libro"
              disabled={!!bookFromQuery || isEdit}
            />
          </FormField>

          <FormField label="Fecha de devolución" error={errors.returnDate}>
            <Input
              type="date"
              value={form.returnDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, returnDate: e.target.value }))
              }
            />
          </FormField>

        </div>

        <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex justify-end gap-3">

          <Button
            label="Cancelar"
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />

          <Button
            label={
              saving
                ? "Guardando..."
                : isEdit
                  ? "Actualizar"
                  : "Asignar"
            }
            color="blue"
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

export default BookAssignmentPage;