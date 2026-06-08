import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
export function paginatedMapper<T, R>(
  dto: PaginatedResponse<T>,
  mapper: (item: T) => R
): PaginatedResponse<R> {
  return {
    content: dto.content.map(mapper),
    pageNumber: dto.pageNumber,
    pageSize: dto.pageSize,
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
  };
}