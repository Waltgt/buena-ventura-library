import { useAuthStore } from "@/modules/auth/store/authStore";

export const withUserHeader = () => {
  const user = useAuthStore.getState().user;
  console.log(user?.username)
  return user?.username
    ? {
        headers: {
          "X-Username": user.username,
        },
      }
    : {};
};