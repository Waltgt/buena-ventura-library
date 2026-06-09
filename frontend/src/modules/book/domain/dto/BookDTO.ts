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
    id_book?: number;
    id_author: number;
    id_editorial: number;
    editoral_name: string;
    isbn: string;
    publication_date: string;
    status: string;
    stock: number;
    title: string
}