export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  metadata?: string;
  timestamp: string;
  path: string;
  statusCode: number;
};