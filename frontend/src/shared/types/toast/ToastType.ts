export const TOAST_TYPES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];