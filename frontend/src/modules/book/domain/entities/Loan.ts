export type Loan = {
    id: number;
    expectedReturnDate: string;
    realReturnDate: string;
    status: string;
    book: {
        title: string;
        id: number;
        isbn: string;
    },
    user: {
        id: number;
        name: string;
    }
}