export type Book = {
    id: number;
    authorId: number;
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