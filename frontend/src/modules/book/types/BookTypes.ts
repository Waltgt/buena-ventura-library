export type BookRequestParams = {
    id?: number;
    editorialId: number;
    isbn: string;
    publicationDate: string;
    status: string;
    stock: number;
    title: string;
    authorId: number;
}


export const BOOK_STATUS = {
  AVAILABLE: "disponible",
  LOANED: "prestado",
} as const;

export type BookStatus = typeof BOOK_STATUS[keyof typeof BOOK_STATUS];
