import { useMemo } from "react";
import type { DataListOption } from "../types/datalist/DataListOption";

export function useDataListOptions<T>(
    data: T[] | undefined,
    mapper: (item: T) => DataListOption<T>
) {
    return useMemo(
        () => (data ?? []).map(mapper),
        [data, mapper]
    );
}