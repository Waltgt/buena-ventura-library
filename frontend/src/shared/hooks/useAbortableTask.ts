import { useCallback, useEffect, useRef } from "react";

type RunFn<T> = (signal: AbortSignal) => Promise<T>;

export function useAbortableTask() {
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const run = useCallback(async <T,>(fn: RunFn<T>) => {
    // aborta cualquier ejecución anterior
    abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      return await fn(controller.signal);
    } finally {
      // limpia controller si es el actual
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, [abort]);

  // aborta al desmontar
  useEffect(() => abort, [abort]);

  return { run, abort };
}