export type Book = {
    id: number;
    author: {
        id: number;
        name: string;
    },
    editorial: {
        id: number;
        name: string;
    },
    isbn: string;
    publicationDate: string;
    status: string;
    stock: number;
    title: string;
}