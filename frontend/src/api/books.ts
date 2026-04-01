import type { Book, BookResponse } from '../types/book';

const apiUrl = 'http://localhost:5028/books';

type BookRequest = Omit<Book, never>;

interface FetchBooksOptions {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}

async function readErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const data = await response.json();

    if (data?.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors).flat().join(' ');

      if (messages) {
        return messages;
      }
    }

    if (typeof data?.title === 'string' && data.title) {
      return data.title;
    }

    if (typeof data?.message === 'string' && data.message) {
      return data.message;
    }
  }

  const text = await response.text();
  return text || fallback;
}

export async function fetchCategories() {
  const response = await fetch(`${apiUrl}/categories`);

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        'Could not load book categories from the API.'
      )
    );
  }

  return (await response.json()) as string[];
}

export async function fetchBooks(options: FetchBooksOptions = {}) {
  const query = new URLSearchParams({
    pageSize: (options.pageSize ?? 5).toString(),
    pageNum: (options.pageNum ?? 1).toString(),
    sort: options.sort ?? 'title_asc',
  });

  if (options.category && options.category !== 'All') {
    query.set('category', options.category);
  }

  const response = await fetch(`${apiUrl}?${query.toString()}`);

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, 'Could not load books from the API.')
    );
  }

  return (await response.json()) as BookResponse;
}

export async function createBook(book: BookRequest) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, 'Could not create the book.')
    );
  }

  return (await response.json()) as Book;
}

export async function updateBook(bookId: number, book: BookRequest) {
  const response = await fetch(`${apiUrl}/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, 'Could not update the book.')
    );
  }

  return (await response.json()) as Book;
}

export async function deleteBook(bookId: number) {
  const response = await fetch(`${apiUrl}/${bookId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, 'Could not delete the book.')
    );
  }
}
