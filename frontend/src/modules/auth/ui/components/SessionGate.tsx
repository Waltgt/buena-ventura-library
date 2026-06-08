import SessionRenewModal from "@/shared/components/permissions/SessionRenewModal";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/toast/ToastType";

import { useSessionManager } from "@/modules/auth/hooks/useSessionManager";
import { refreshAccessToken } from "@/modules/auth/application/useCases/refreshAccessToken";
import { authRepository } from "@/modules/auth/infrastructure/repositories/AuthRepositoryImpl";
import { useAuthStore } from "@/modules/auth/store/authStore";

export default function SessionGate() {
  const {
    showRenewModal,
    forceLogout,
    close,
  } = useSessionManager(60_000);

  const updateToken = useAuthStore(
    (s) => s.updateToken
  );

  const refreshToken = useAuthStore(
    (s) => s.user?.tokenMetadata?.refreshToken
  );

  const { toast, showToast, hideToast } =
    useToast();

  const handleRenew = async () => {
    try {
      if (!refreshToken) {
        forceLogout();
        return;
      }

      const newTokens =
        await refreshAccessToken(
          authRepository,
          refreshToken
        );

      updateToken(newTokens);

      close();

      showToast(
        "Sesión renovada correctamente",
        TOAST_TYPES.SUCCESS
      );
    } catch {
      showToast(
        "No fue posible renovar la sesión",
        TOAST_TYPES.ERROR
      );

      forceLogout();
    }
  };

  const handleLogout = () => {
    showToast(
      "Cerrando sesión...",
      TOAST_TYPES.LOADING
    );

    forceLogout();
  };

  return (
    <>
      <SessionRenewModal
        open={showRenewModal}
        loading={false}
        onRenew={handleRenew}
        onLogout={handleLogout}
        onClose={close}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
}