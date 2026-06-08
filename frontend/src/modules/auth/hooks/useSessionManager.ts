import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import {
  getTokenTimeLeftMs,
  isTokenExpired,
} from "@/shared/utils/jwt";

import { refreshAccessToken } from "../application/useCases/refreshAccessToken";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";

export const useSessionManager = (warnBeforeMs = 60_000) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateToken = useAuthStore((s) => s.updateToken);

  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const forceLogout = useCallback(() => {
    setShowRenewModal(false);
    logout();
  }, [logout]);

  const close = useCallback(() => {
    setShowRenewModal(false);
  }, []);

  const renew = useCallback(async () => {
    try {
      setLoading(true);

      const refreshToken = user?.tokenMetadata?.refreshToken;

      if (!refreshToken) {
        forceLogout();
        return;
      }

      const newTokens = await refreshAccessToken(
        authRepository,
        refreshToken
      );

      updateToken(newTokens);

      setShowRenewModal(false);
    } catch (e) {
      forceLogout();
    } finally {
      setLoading(false);
    }
  }, [user, updateToken, forceLogout]);

  useEffect(() => {
    if (!hasHydrated) return;

    const token = user?.tokenMetadata?.accessToken;
    if (!token) return;

    const timeLeft = getTokenTimeLeftMs(token);

    if (timeLeft <= 0 || isTokenExpired(token)) {
      forceLogout();
      return;
    }

    const warningTime = Math.max(timeLeft - warnBeforeMs, 0);

    const warningTimer = setTimeout(() => {
      setShowRenewModal(true);
    }, warningTime);

    const logoutTimer = setTimeout(() => {
      forceLogout();
    }, timeLeft);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [user, hasHydrated, warnBeforeMs, forceLogout]);

  useEffect(() => {
    const sync = () => {
      const token =
        useAuthStore.getState().user?.tokenMetadata?.accessToken;

      if (!token) {
        setShowRenewModal(false);
      }
    };

    window.addEventListener("storage", sync);
    window.addEventListener("auth-sync", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-sync", sync);
    };
  }, []);

  return {
    showRenewModal,
    forceLogout,
    close,
    renew,
    loading,
  };
};