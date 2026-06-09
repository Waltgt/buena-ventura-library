import type { Book } from "../../domain/entities/Book";
import type {
  BookResponseDTO
} from "../../domain/dto/BookDTO";

export function bookToDomain(dto: BookResponseDTO): Book {
  return {
    id: dto.id_book ?? 0,
    authorId: dto.id_author,
    editorial: {
      id: dto.id_editorial,
      name: dto.editoral_name
    },
    isbn: dto.isbn,
    publicationDate: dto.publication_date,
    status: dto.status,
    title: dto.title,
    stock: dto.stock
  };
}

export function booksToDomain(dtos: BookResponseDTO[]): Book[] {
  return dtos.map(bookToDomain);
}

