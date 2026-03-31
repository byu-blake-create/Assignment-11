// Keep the frontend aligned with the shape of each book from the API.
export interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

// Keep the frontend aligned with the paginated response from the books endpoint.
export interface BookResponse {
  books: Book[];
  totalNumBooks: number;
}
