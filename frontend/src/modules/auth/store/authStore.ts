import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../domain/entities/User";

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  logout: () => void;

  updateToken: (tokenMetadata: User["tokenMetadata"]) => void;

  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => {
        localStorage.setItem("auth-sync", Date.now().toString());
        set({ user });
      },

      logout: () => {
        localStorage.setItem("auth-sync", Date.now().toString());
        set({ user: null });
      },

      updateToken: (tokenMetadata) => {
        localStorage.setItem("auth-sync", Date.now().toString());

        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                tokenMetadata,
              }
            : null,
        }));
      },

      hasRole: (role) => {
        const user = get().user;

        return (
          user?.roles?.some(
            (r) => r.toLowerCase() === role.toLowerCase()
          ) ?? false
        );
      },

      hasPermission: (permission) => {
        const user = get().user;

        return (
          user?.permissions?.some(
            (p) => p.permissionName === permission
          ) ?? false
        );
      },
    }),
    {
      name: "auth-storage",
    }
  )
);