export type BookRequestDTO = {
    id_author: number;
    id_editorial: number;
    isbn: string;
    publication_date: string;
    status: string;
    stock: number;
    title: string
    id_book?: number;
}

export type BookResponseDTO = {
    author_name: string;
    editorial_name: string;
    id_author: number;
    id_book?: number;
    id_editorial: number;
    isbn: string;
    publication_date: string;
    status: string;
    stock: number;
    title: string
}