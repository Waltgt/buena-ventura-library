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