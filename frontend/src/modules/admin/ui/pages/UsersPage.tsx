import { useMemo, useState, useCallback } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import type { TableColumn } from "@/shared/types/table/TableTypes";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import type { Role } from "../../domain/entities/Role";
import type { User } from "../../domain/entities/User";

import type { UserRequestParams } from "../../types/UserTypes";
import { HttpError } from "@/shared/errors/HttpError";

import { useGetUsers } from "../../hooks/user/useGetUsers";
import { useCreateUser } from "../../hooks/user/useCreateUser";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";

type UserForm = {
    id?: number;
    username: string;
    email: string;
    roleId: number;
    personId: string;
    name: string;
    lastname: string;
    password?: string;
    phone: string;
};

type FormErrors = {
    username?: string;
    email?: string;
    roleId?: string;
    personId?: string;
    name?: string;
    lastname?: string;
    password?: string;
    phone?: string;
};

const STATIC_ROLES: Role[] = [
    { id: 1, name: "Gestor" },
    { id: 2, name: "Administrador" },
];

const initialForm: UserForm = {
    username: "",
    email: "",
    roleId: 1,
    personId: "",
    name: "",
    lastname: "",
    password: "",
    phone: "",
};

const UsersPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserForm | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [searchRole, setSearchRole] = useState("");

    const { data: usersData = [], isLoading } = useGetUsers();

    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const isSaving = createUser.isPending || updateUser.isPending;

    const openCreate = useCallback(() => {
        setEditing(initialForm);
        setErrors({});
        setSearchRole("");
        setOpen(true);
    }, []);

    const openEdit = useCallback((user: User) => {
        setEditing({
            id: user.id,
            username: user.username,
            email: user.email,
            roleId: user.role.id,
            personId: user.personId,
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            password: ""
        });

        setErrors({});
        setSearchRole("");
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        setEditing(null);
        setErrors({});
        setSearchRole("");
    }, []);

    const isValidDPI = (dpi: string) => {
        if (!/^[0-9]{13}$/.test(dpi)) return false;

        const digits = dpi.split("").map(Number);

        const correlativo = digits.slice(0, 9);
        const verificador = digits[9];

        let total = 0;

        for (let i = 0; i < correlativo.length; i++) {
            total += correlativo[i] * (i + 2);
        }

        const mod = total % 11;
        const check = mod === 10 ? 0 : mod;

        return check === verificador;
    };

    const validate = useCallback(() => {
        if (!editing) return false;

        const newErrors: FormErrors = {};

        if (!editing.username.trim() || editing.username.length < 3)
            newErrors.username = "Mínimo 3 caracteres";

        if (
            !editing.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editing.email)
        )
            newErrors.email = "Correo inválido";

        if (!editing.name.trim() || editing.name.length < 3)
            newErrors.name = "Mínimo 3 caracteres";

        if (!editing.lastname.trim() || editing.lastname.length < 3)
            newErrors.lastname = "Mínimo 3 caracteres";


        if (!editing.personId.trim())
            newErrors.personId = "Requerido";
        else if (!isValidDPI(editing.personId))
            newErrors.personId = "DPI inválido";

        if (!editing.phone.trim())
            newErrors.phone = "Requerido";
        else if (!/^(502)?[0-9]{8}$/.test(editing.phone))
            newErrors.phone = "Teléfono inválido";

        if (!editing.id) {
            if (!editing.password || editing.password.length < 6)
                newErrors.password = "Mínimo 6 caracteres";
        }

        if (!editing.roleId)
            newErrors.roleId = "Selecciona un rol";

        setErrors(newErrors);

        const isValid = Object.keys(newErrors).length === 0;

        if (!isValid) {
            showToast("Campos inválidos, revise el formulario.", TOAST_TYPES.ERROR);
        }

        return isValid;
    }, [editing]);

    const buildPayload = useCallback((form: UserForm): UserRequestParams => {
        return {
            id: form.id,
            username: form.username.trim(),
            email: form.email.trim(),
            name: form.name.trim(),
            lastname: form.lastname.trim(),
            password: form.password ?? "",
            roleId: form.roleId,
            personId: form.personId,
            phone: form.phone,
        };
    }, []);

    const save = useCallback(async () => {
        if (!editing || !validate()) return;

        const payload = buildPayload(editing);

        try {
            if (editing.id) {
                await updateUser.mutateAsync(payload);
                showToast("Usuario actualizado exitosamente", TOAST_TYPES.SUCCESS);
            } else {
                await createUser.mutateAsync(payload);
                showToast("Usuario creado exitosamente", TOAST_TYPES.SUCCESS);
            }
        } catch (error) {
            if (error instanceof HttpError) {
                showToast(error.message, TOAST_TYPES.ERROR);
            } else {
                showToast("Error durante operación", TOAST_TYPES.ERROR);
            }
        } finally {
            close();
        }
    }, [editing, validate, buildPayload, createUser, updateUser]);

    const filteredRoles = useMemo(() => {
        return STATIC_ROLES.filter((r) =>
            r.name.toLowerCase().includes(searchRole.toLowerCase())
        );
    }, [searchRole]);

    const usersFormatted = useMemo(() => {
        return usersData.map((u: any) => ({
            ...u,
            statusLabel: "ACTIVO"
        }));
    }, [usersData]);

    const actions = useMemo(
        () => [
            { title: "Editar", label: "Editar", color: "blue", onClick: openEdit },
        ],
        [openEdit]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            { key: "username", label: "Usuario" },
            { key: "fullname", label: "Nombre" },
            { key: "email", label: "Correo" },
            { key: "statusLabel", label: "Estado" },
            { key: "actions", label: "Acciones", hasActions: true },
        ],
        []
    );

    if (isLoading) return <div className="p-6">Cargando usuarios...</div>;

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Usuarios
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión de usuarios del sistema
                        </p>
                    </div>

                    <Button
                        icon={faUserPlus}
                        label="Crear usuario"
                        color="blue"
                        onClick={openCreate}
                    />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={usersFormatted}
                        actions={actions as any}
                        page={page}
                        pageSize={pageSize}
                        total={usersFormatted.length}
                        onPageChange={(p) => setPage(p)}
                    />
                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={editing?.id ? "Editar usuario" : "Crear usuario"}
                    size="md"
                >
                    <div className="space-y-5">

                        <FormField label="Usuario" error={errors.username}>
                            <Input
                                value={editing?.username || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, username: e.target.value } : p)
                                }
                            />
                        </FormField>

                        <FormField label="Nombre" error={errors.name}>
                            <Input
                                value={editing?.name || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, name: e.target.value } : p)
                                }
                            />
                        </FormField>

                        <FormField label="Apellidos" error={errors.lastname}>
                            <Input
                                value={editing?.lastname || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, lastname: e.target.value } : p)
                                }
                            />
                        </FormField>

                        <FormField label="Identificación" error={errors.personId}>
                            <Input
                                value={editing?.personId || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, personId: e.target.value } : p)
                                }
                            />
                        </FormField>

                        <FormField label="Teléfono" error={errors.phone}>
                            <Input
                                value={editing?.phone || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, phone: e.target.value } : p)
                                }
                            />
                        </FormField>

                        <FormField label="Correo" error={errors.email}>
                            <Input
                                value={editing?.email || ""}
                                onChange={(e) =>
                                    setEditing((p) => p ? { ...p, email: e.target.value } : p)
                                }
                            />
                        </FormField>

                        {!editing?.id && (
                            <FormField label="Contraseña" error={errors.password}>
                                <Input
                                    type="password"
                                    value={editing?.password || ""}
                                    onChange={(e) =>
                                        setEditing((p) => p ? { ...p, password: e.target.value } : p)
                                    }
                                />
                            </FormField>
                        )}

                        <FormField label="Rol" error={errors.roleId}>
                            <Input
                                placeholder="Buscar roles..."
                                value={searchRole}
                                onChange={(e) => setSearchRole(e.target.value)}
                            />

                            <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto mt-3">
                                {filteredRoles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() =>
                                            setEditing((p) =>
                                                p ? { ...p, roleId: role.id } : p
                                            )
                                        }
                                        className={`w-full text-left px-4 py-3 border-b border-slate-100 ${editing?.roleId === role.id
                                            ? "bg-blue-50"
                                            : "hover:bg-slate-50"
                                            }`}
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </FormField>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button label="Cancelar" color="gray" onClick={close} />
                            <Button
                                label={editing?.id ? "Actualizar" : "Guardar"}
                                color="blue"
                                onClick={save}
                                disabled={isSaving}
                            />
                        </div>

                    </div>
                </Modal>
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

export default UsersPage;