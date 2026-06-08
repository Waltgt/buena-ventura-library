import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { getHomeRoute } from "@/modules/auth/ui/utils/getHomeRoute";

export const PublicRoute = () => {
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    if (!hasHydrated) {
        return <div>Cargando...</div>;
    }

    // si ya está logeado redirige
    if (user) {
        return <Navigate to={getHomeRoute(user.roles)} replace />;
    }

    return <Outlet />;
};