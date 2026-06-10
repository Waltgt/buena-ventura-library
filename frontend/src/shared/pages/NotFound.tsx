import { Link } from "react-router-dom";

import { getHomeRoute } from "@/modules/auth/ui/utils/getHomeRoute";
import { useAuthStore } from "@/modules/auth/store/authStore";
import type { Role } from "../types/auth/RolesTypes";

export default function NotFound() {
    const user = useAuthStore((s) => s.user);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="text-center">

                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-7xl font-extrabold text-gray-800 mb-4">
                    404
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                    Página no encontrada
                </p>

                <p className="text-gray-500 mb-6">
                    Lo sentimos, la página que buscas no existe o fue movida.
                </p>

                <Link
                    to={user ? getHomeRoute(user.role.name as Role) : "/login"}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Volver al inicio
                </Link>

            </div>

        </div>
    );
}