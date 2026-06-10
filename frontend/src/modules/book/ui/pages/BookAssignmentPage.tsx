import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import DataList from "@/shared/components/forms/DataList";
import Toast from "@/shared/components/Toast";
import Skeleton from "@/shared/components/Skeleton";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import type { DataListOption } from "@/shared/types/datalist/DataListOption";

import type { User } from "@/modules/admin/domain/entities/User";
import type { Book } from "../../domain/entities/Book";

import { useBooks } from "../../hooks/books/useBooks";
import { useGetUsers } from "@/modules/admin/hooks/user/useGetUsers";
import type { LoanRequestParams } from "../../types/LoanTypes";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useCreateLoan } from "../../hooks/loans/useCreateLoan";
import { HttpError } from "@/shared/errors/HttpError";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type FormState = {
  user: DataListOption<User> | null;
  book: DataListOption<Book> | null;
  returnDate: string;
};

type FormErrors = {
  user?: string;
  book?: string;
  returnDate?: string;
};

const BookAssignmentPage = () => {
  const navigate = useNavigate();

  const { toast, showToast, hideToast } = useToast();

  const { data: users = [], isLoading: loadingUsers } = useGetUsers();

  const { data: books = [], isLoading: loadingBooks } =  useBooks();

  const authUser = useAuthStore((state) => state.user); //usuario logeadp

  const createLoan = useCreateLoan()


  const userOptions = useMemo<DataListOption<User>[]>(
    () =>
      users.map((user) => ({
        id: user.id,
        label: user.name,
        subtitle: user.email,
        value: user,
      })),
    [users]
  );

  const bookOptions = useMemo<DataListOption<Book>[]>(
    () =>
      books.map((book) => ({
        id: book.id,
        label: book.title,
        subtitle: book.isbn,
        value: book,
      })),
    [books]
  );

  const [form, setForm] = useState<FormState>({
    user: null,
    book: null,
    returnDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!form.user) {
      newErrors.user = "Seleccione un usuario";
    }

    if (!form.book) {
      newErrors.book = "Seleccione un libro";
    }

    if (!form.returnDate) {
      newErrors.returnDate = "Fecha requerida";
    }

    if (form.returnDate) {
      const selected = new Date(form.returnDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selected <= today) {
        newErrors.returnDate =
          "Debe ser una fecha futura";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast(
        "Campos inválidos, revise el formulario",
        TOAST_TYPES.ERROR
      );
      return false;
    }

    return true;
  }, [form, showToast]);

  const save = useCallback(async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      const payload: LoanRequestParams = {
        delivery_date: new Date().toISOString().split("T")[0],
        expected_return_date: form.returnDate,
        id_book: Number(form.book!.id),
        id_user_loan: Number(form.user!.id),
        id_user_register: authUser?.id ?? 0
      };
      await createLoan.mutateAsync(payload)

      showToast(
        "Préstamo registrado correctamente",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(() => navigate(-1), 1200);
    } catch(error) {
      if(error instanceof HttpError) {
        const errMsg = JSON.parse(error.body)
        showToast(errMsg.error, TOAST_TYPES.ERROR )
        return
      }
      showToast( "Error al registrar préstamo", TOAST_TYPES.ERROR )
    } finally {
      setSaving(false);
    }
  }, [form, validate, navigate, showToast]);

  const loading =
    loadingUsers ||
    loadingBooks;

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Asignación de libro
            </h1>

            <p className="text-sm text-slate-500">
              Asignación de libro a usuario
            </p>
          </div>

          <Button
            label="Volver"
            icon={faArrowLeft}
            color="gray"
            variant="outline"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

          {loading ? (
            <>
              <Skeleton height="h-12" />
              <Skeleton height="h-12" />
              <Skeleton height="h-12" />
            </>
          ) : (
            <>
              <FormField
                label="Usuario"
                error={errors.user}
              >
                <DataList
                  options={userOptions}
                  value={form.user}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      user: value,
                    }))
                  }
                  placeholder="Buscar usuario"
                />
              </FormField>

              <FormField
                label="Libro"
                error={errors.book}
              >
                <DataList
                  options={bookOptions}
                  value={form.book}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      book: value,
                    }))
                  }
                  placeholder="Buscar libro"
                />
              </FormField>

              <FormField
                label="Fecha de devolución"
                error={errors.returnDate}
              >
                <Input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      returnDate: e.target.value,
                    }))
                  }
                />
              </FormField>
            </>
          )}
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
                : "Asignar"
            }
            color="blue"
            onClick={save}
            disabled={saving || loading}
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