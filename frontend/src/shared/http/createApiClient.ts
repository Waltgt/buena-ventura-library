import { getValidAccessToken } from "@/modules/auth/services/tokenService";
import { UnauthorizedError } from "@/shared/errors/UnauthorizedError";
import { HttpError } from "@/shared/errors/HttpError";

function mergeSignals(signals: Array<AbortSignal | undefined>) {
  const valid = signals.filter(Boolean) as AbortSignal[];

  if (valid.length === 0) return undefined;
  if (valid.length === 1) return valid[0];

  const controller = new AbortController();

  const onAbort = () => controller.abort();

  for (const s of valid) {
    if (s.aborted) {
      controller.abort();
      break;
    }

    s.addEventListener("abort", onAbort, { once: true });
  }

  return controller.signal;
}

export function createApiClient(baseUrl = "") {
  return {
    async request<T>(req: any): Promise<T> {
      const finalSignal = mergeSignals([req.signal]);

      const token = await getValidAccessToken();

      const headers: Record<string, string> = {
        ...(req.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Solo agregar Content-Type JSON cuando realmente es JSON
      if (
        req.body &&
        !(req.body instanceof FormData) &&
        !(req.body instanceof URLSearchParams) &&
        !headers["Content-Type"]
      ) {
        headers["Content-Type"] = "application/json";
      }

      const body =
        req.body instanceof FormData ||
        req.body instanceof URLSearchParams
          ? req.body
          : req.body != null
          ? JSON.stringify(req.body)
          : undefined;

      const res = await fetch(`${baseUrl}${req.url}`, {
        method: req.method ?? "GET",
        headers,
        body,
        signal: finalSignal,
        credentials: req.withCredentials ? "include" : "same-origin",
      });

      if (res.status === 401) {
        throw new UnauthorizedError();
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new HttpError(res.status, text);
      }

      if (res.status === 204) {
        return undefined as T;
      }

      const contentType = res.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        return undefined as T;
      }

      return (await res.json()) as T;
    },
  };
}