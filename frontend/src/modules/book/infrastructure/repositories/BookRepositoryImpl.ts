
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { BookRepository } from "../../application/interfaces/BookRepository";

import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type {
    BookRequestDTO,
    BookResponseDTO,
} from "../../domain/dto/BookDTO";
import {
    bookToDomain,
    booksToDomain
} from "../mappers/bookMapper";

import { withUserHeader } from "@/shared/utils/withUserHeader";


export function createBookRepository(http: HttpClient): BookRepository {
    return {


        async getAllBooks(signal) {
            const dto = await http.request<ApiResponse<BookResponseDTO[]>>({
                url: API_ROUTES.BOOK_ENDPOINT,
                method: "GET",
                signal,
            });

            return booksToDomain(dto.data);
        },
        async getBookById(id, signal) {
            const dto = await http.request<ApiResponse<BookResponseDTO>>({
                url: `${API_ROUTES.BOOK_ENDPOINT}/${id}`,
                method: "GET",
                signal,
            });

            return bookToDomain(dto.data);
        },
        async createBook(params, signal) {

            const body: BookRequestDTO = {
                id_author: params.authorId,
                id_editorial: params.editorialId,
                isbn: params.isbn,
                publication_date: params.publicationDate,
                status: params.status,
                stock: params.stock,
                title: params.title
            };
            const dto = await http.request<ApiResponse<BookResponseDTO>>({
                url: API_ROUTES.BOOK_ENDPOINT,
                method: "POST",
                body,
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return bookToDomain(dto.data)
        },
        async updateBook(params, signal) {

            const body: BookRequestDTO = {
                id_book: params.id,
                id_author: params.authorId,
                id_editorial: params.editorialId,
                isbn: params.isbn,
                publication_date: params.publicationDate,
                status: params.status,
                stock: params.stock,
                title: params.title
            };
            const dto = await http.request<ApiResponse<BookResponseDTO>>({
                url: API_ROUTES.BOOK_ENDPOINT,
                method: "PUT",
                body,
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return bookToDomain(dto.data)
        },
        async removeBook(id, signal) {

            const dto = await http.request<ApiResponse<BookResponseDTO>>({
                url: `${API_ROUTES.BOOK_ENDPOINT}/${id}`,
                method: "DELETE",
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return dto.success
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const bookRepository: BookRepository =
    createBookRepository(httpClient);