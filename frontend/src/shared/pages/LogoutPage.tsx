import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/authStore";

import { useToast } from "@/shared/hooks/useToast";
import Toast from "@/shared/components/Toast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";

export default function LogoutPage() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        showToast("Cerrando sesión...", TOAST_TYPES.LOADING)
        logout();
        navigate("/login");
    }, []);

    return (
        <Toast
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={hideToast}
        />
    )
}