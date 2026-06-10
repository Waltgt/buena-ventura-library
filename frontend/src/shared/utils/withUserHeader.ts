import { useAuthStore } from "@/modules/auth/store/authStore";

export const withUserHeader = () => {
  const user = useAuthStore.getState().user;
  return user?.username
    ? {
        headers: {
          "X-Username": user.username,
        },
      }
    : {};
};