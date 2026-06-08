import { useState } from "react";
import { TOAST_TYPES, type ToastType } from "@/shared/types/toast/ToastType";

export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: TOAST_TYPES.SUCCESS as ToastType,
  });

  const showToast = (
    message: string,
    type: ToastType
  ) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const hideToast = () =>
    setToast((prev) => ({
      ...prev,
      show: false,
    }));

  return {
    toast,
    showToast,
    hideToast,
  };
};