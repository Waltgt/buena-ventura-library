import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

type QueryFn<T> = (args: {
  page: number;
  size: number;
  signal?: AbortSignal;
}) => Promise<PaginatedResponse<T>>;

export function usePaginatedTable<T>(
  key: string,
  page: number,
  size: number,
  queryFn: QueryFn<T>
) {
  const query = useQuery<PaginatedResponse<T>>({
    queryKey: [key, page, size],

    queryFn: ({ signal }) =>
      queryFn({ page, size, signal }),
    
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    items: query.data?.content ?? [],
    page: query.data?.pageNumber ?? page,
    size: query.data?.pageSize ?? size,
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}