import type { ResponseType } from "./ResponseType";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpRequest = {
  url: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
  responseType?: ResponseType
};

export interface HttpClient {
  request<T>(req: HttpRequest): Promise<T>;
}