import type { Book } from "../../domain/entities/Book";
import type { BookRequestParams } from "../../types/BookTypes";

export interface BookRepository {
    getAllBooks(signal?: AbortSignal): Promise<Book[]>;
    getBookById(id: number, signal?: AbortSignal): Promise<Book>;
    createBook(params: BookRequestParams, signal?: AbortSignal): Promise<Book>;
    updateBook(params: BookRequestParams, signal?: AbortSignal): Promise<Book>;
    removeBook(id: number, signal?: AbortSignal): Promise<boolean>;
}