import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
} from '../api/books';
import type { Book } from '../types/book';

interface BookFormValues {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: string;
  price: string;
}

const emptyFormValues = (): BookFormValues => ({
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: '',
  price: '',
});

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deletingBookId, setDeletingBookId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<BookFormValues>(emptyFormValues);

  const loadBooks = async () => {
    try {
      setError('');
      setIsLoading(true);

      const response = await fetchBooks({
        pageSize: 1000,
        pageNum: 1,
        sort: 'title_asc',
      });

      setBooks(response.books);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load admin books.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setFormValues(emptyFormValues());
    setIsEditMode(false);
    setError('');
  };

  const openAddModal = () => {
    setStatusMessage('');
    setError('');
    setIsEditMode(false);
    setFormValues(emptyFormValues());
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setStatusMessage('');
    setError('');
    setIsEditMode(true);
    setFormValues({
      bookID: book.bookID,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount.toString(),
      price: book.price.toString(),
    });
    setShowModal(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError('');

      const bookPayload: Book = {
        bookID: isEditMode ? formValues.bookID : 0,
        title: formValues.title.trim(),
        author: formValues.author.trim(),
        publisher: formValues.publisher.trim(),
        isbn: formValues.isbn.trim(),
        classification: formValues.classification.trim(),
        category: formValues.category.trim(),
        pageCount: Number(formValues.pageCount),
        price: Number(formValues.price),
      };

      if (isEditMode) {
        await updateBook(bookPayload.bookID, bookPayload);
        setStatusMessage(`Updated "${bookPayload.title}".`);
      } else {
        await createBook(bookPayload);
        setStatusMessage(`Added "${bookPayload.title}".`);
      }

      closeModal();
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the book.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (book: Book) => {
    const shouldDelete = window.confirm(
      `Delete "${book.title}" by ${book.author}?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingBookId(book.bookID);
      setError('');
      setStatusMessage('');
      await deleteBook(book.bookID);
      setStatusMessage(`Deleted "${book.title}".`);
      await loadBooks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete the book.'
      );
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <main className="app-shell">
      <section className="bookstore-header admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mb-2">Manage Books</h1>
          <p className="subtitle mb-0">
            Add, update, and remove books from the catalog without leaving the
            app.
          </p>
        </div>

        <div className="header-actions">
          <Link to="/" className="btn btn-outline-secondary">
            Back to Store
          </Link>

          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            Add Book
          </button>
        </div>
      </section>

      {statusMessage ? (
        <div className="alert alert-success">{statusMessage}</div>
      ) : null}

      {error && !showModal ? <div className="alert alert-danger">{error}</div> : null}

      <section className="bookstore-panel">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h2 className="h4 mb-1">Book Catalog</h2>
            <p className="text-secondary mb-0">{books.length} books loaded</p>
          </div>
        </div>

        {isLoading ? (
          <div className="alert alert-light border mb-0">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="alert alert-light border mb-0">
            No books are currently in the catalog.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0 admin-books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookID}>
                    <td>
                      <div className="fw-semibold">{book.title}</div>
                      <div className="small text-secondary">
                        ISBN {book.isbn} • {book.publisher}
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditModal(book)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(book)}
                          disabled={deletingBookId === book.bookID}
                        >
                          {deletingBookId === book.bookID ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal ? (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <div>
                    <p className="eyebrow mb-1">
                      {isEditMode ? 'Edit Book' : 'Add Book'}
                    </p>
                    <h2 className="modal-title fs-4 mb-0">
                      {isEditMode ? 'Update Book Details' : 'Create a New Book'}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  ></button>
                </div>

                <div className="modal-body">
                  {error ? <div className="alert alert-danger">{error}</div> : null}

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        className="form-control"
                        value={formValues.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="author" className="form-label">
                        Author
                      </label>
                      <input
                        id="author"
                        name="author"
                        className="form-control"
                        value={formValues.author}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="publisher" className="form-label">
                        Publisher
                      </label>
                      <input
                        id="publisher"
                        name="publisher"
                        className="form-control"
                        value={formValues.publisher}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="isbn" className="form-label">
                        ISBN
                      </label>
                      <input
                        id="isbn"
                        name="isbn"
                        className="form-control"
                        value={formValues.isbn}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="classification" className="form-label">
                        Classification
                      </label>
                      <input
                        id="classification"
                        name="classification"
                        className="form-control"
                        value={formValues.classification}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="category" className="form-label">
                        Category
                      </label>
                      <input
                        id="category"
                        name="category"
                        className="form-control"
                        value={formValues.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="pageCount" className="form-label">
                        Page Count
                      </label>
                      <input
                        id="pageCount"
                        name="pageCount"
                        type="number"
                        min="1"
                        className="form-control"
                        value={formValues.pageCount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-control"
                        value={formValues.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving
                      ? isEditMode
                        ? 'Saving Changes...'
                        : 'Adding Book...'
                      : isEditMode
                        ? 'Save Changes'
                        : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default AdminBooksPage;
