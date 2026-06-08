import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  faHospital,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useLogin } from "../../hooks/useLogin";
import { getHomeRoute } from "../utils/getHomeRoute";

import type { Role } from "@/shared/types/auth/RolesTypes";

import { useToast } from "@/shared/hooks/useToast";
import Toast from "@/shared/components/Toast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";
import { useAbortableTask } from "@/shared/hooks/useAbortableTask";

import Input from "@/shared/components/forms/Input";
import Button from "@/shared/components/forms/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();

  const { run } = useAbortableTask();
  const { toast, showToast, hideToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await run((signal) =>
        mutateAsync({
          username,
          password,
          signal,
        })
      );

      const roles = user.roles as Role[];

      navigate(getHomeRoute(roles));
    } catch (error: any) {
      if (
        error?.name === "RequestAbortedError" ||
        error?.name === "AbortError"
      ) {
        return;
      }

      showToast("Credenciales incorrectas", TOAST_TYPES.ERROR);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Panel institucional */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
          <div className="max-w-lg mx-auto flex flex-col justify-center px-12">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
              <FontAwesomeIcon icon={faHospital} className="text-5xl" />
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Sistema Hospitalario
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed">
              Plataforma integral para la gestión de pacientes, expedientes clínicos, consultas médicas y procesos administrativos.
            </p>

            <div className="mt-10 flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Seguridad</h3>
                <p className="text-sm text-blue-100">
                  Acceso controlado por roles y permisos.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Gestión</h3>
                <p className="text-sm text-blue-100">
                  Información centralizada y segura.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

              {/* Logo móvil */}
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHospital} className="text-3xl text-blue-600" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                  Bienvenido
                </h2>
                <p className="text-slate-500 mt-2">
                  Ingrese sus credenciales para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Usuario */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usuario
                  </label>

                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña
                  </label>

                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                      className="pl-11 pr-12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  label={isPending ? "Ingresando..." : "Ingresar"}
                  loading={isPending}
                  fullWidth
                />
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">
                  © 2026 Sistema Hospitalario
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
}