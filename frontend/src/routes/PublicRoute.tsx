import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { getHomeRoute } from "@/modules/auth/ui/utils/getHomeRoute";
import type { Role } from "@/shared/types/auth/RolesTypes";

export const PublicRoute = () => {
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    if (!hasHydrated) {
        return <div>Cargando...</div>;
    }

    if (user) {
        return <Navigate to={getHomeRoute(user.role.name as Role)} replace />;
    }

    return <Outlet />;
};