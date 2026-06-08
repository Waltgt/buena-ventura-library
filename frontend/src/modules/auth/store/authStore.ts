import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../domain/entities/User";

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
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

      hasRole: (role) => {
        const user = get().user;

        const roles = user ? [user.role.name] : [];

        return roles.some(
          (r) => r.toLowerCase() === role.toLowerCase()
        );
      },


    }),
    {
      name: "auth-storage",
    }
  )
);