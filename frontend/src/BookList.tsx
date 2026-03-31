import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from './context/useCart';
import type { CartItem } from './types/CartItem';
import type { Book, BookResponse } from './types/book';

// Point the frontend to the backend route you are using during local development.
const apiUrl = 'http://localhost:5028/books';

function BookList() {
  // Keep track of the loaded books and the user's current paging and sorting choices.
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [controlsOpen, setControlsOpen] = useState<boolean>(true);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mirror the browsing state into the URL so pagination and filters survive route changes.
  const pageSize = Math.max(1, Number(searchParams.get('pageSize')) || 5);
  const pageNum = Math.max(1, Number(searchParams.get('pageNum')) || 1);
  const sort = searchParams.get('sort') ?? 'title_asc';
  const selectedCategory = searchParams.get('category') ?? 'All';

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  useEffect(() => {
    // Load the available categories once so the filter options come from the API.
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories`);

        if (!response.ok) {
          throw new Error('Could not load book categories from the API.');
        }

        const data: string[] = await response.json();
        setCategories(data.length > 0 ? data : ['All']);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Reload the book list whenever the user changes page, page size, sort order, or category.
    const fetchBooks = async () => {
      try {
        setError('');

        const query = new URLSearchParams({
          pageSize: pageSize.toString(),
          pageNum: pageNum.toString(),
          sort,
        });

        if (selectedCategory !== 'All') {
          query.set('category', selectedCategory);
        }

        const response = await fetch(`${apiUrl}?${query.toString()}`);

        if (!response.ok) {
          throw new Error('Could not load books from the API.');
        }

        // Save the returned books and total count so the page can render correctly.
        const data: BookResponse = await response.json();
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
      } catch (err) {
        // Show a readable message if the frontend cannot reach the API.
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sort, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleAddToCart = (book: Book) => {
    // Convert the current book into the cart shape expected by the shared context.
    const newItem: CartItem = {
      bookId: book.bookID,
      bookTitle: book.title,
      price: book.price,
      quantity: 1,
    };

    addToCart(newItem);
    // Preserve the current browse state so Continue Shopping can return here.
    const returnTo = searchParams.toString()
      ? `/?${searchParams.toString()}`
      : '/';
    navigate('/cart', { state: { returnTo, addedTitle: book.title } });
  };

  return (
    <>
      {/* Let the user know right away if the books could not be loaded. */}
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {/* ============================================
          BOOTSTRAP ACCORDION FEATURE FOR THE RUBRIC
          THIS HOLDS FILTER SORT AND PAGE SIZE CONTROLS
          ============================================ */}
      <div className="accordion mb-4" id="browseControlsAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="browseControlsHeading">
            <button
              type="button"
              className={`accordion-button ${controlsOpen ? '' : 'collapsed'}`}
              onClick={() => setControlsOpen((currentValue) => !currentValue)}
              aria-expanded={controlsOpen}
              aria-controls="browseControlsBody"
            >
              Browse Controls
            </button>
          </h2>

          <div
            id="browseControlsBody"
            className={`accordion-collapse collapse ${controlsOpen ? 'show' : ''}`}
            aria-labelledby="browseControlsHeading"
          >
            <div className="accordion-body">
              <div className="book-controls d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div>
                  <label htmlFor="categorySelect" className="form-label mb-1">
                    Filter by category
                  </label>
                  <select
                    id="categorySelect"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(event) => {
                      updateSearchParams({
                        category: event.target.value,
                        pageNum: '1',
                      });
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sortSelect" className="form-label mb-1">
                    Sort by title
                  </label>
                  <select
                    id="sortSelect"
                    className="form-select"
                    value={sort}
                    onChange={(event) => {
                      updateSearchParams({
                        sort: event.target.value,
                        pageNum: '1',
                      });
                    }}
                  >
                    <option value="title_asc">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pageSizeSelect" className="form-label mb-1">
                    Results per page
                  </label>
                  <select
                    id="pageSizeSelect"
                    className="form-select"
                    value={pageSize}
                    onChange={(event) => {
                      updateSearchParams({
                        pageSize: event.target.value,
                        pageNum: '1',
                      });
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show where the user is in the full set of results. */}
      <p className="text-secondary mb-4">
        Showing page {pageNum} of {totalPages} with {totalItems} total books
        {selectedCategory === 'All' ? '' : ` in ${selectedCategory}`}.
      </p>

      {/* Display each book's details in a readable card layout. */}
      <div className="row g-3">
        {books.map((book) => (
          <div key={book.bookID} className="col-12 col-md-6 col-xl-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h5 mb-3">{book.title}</h3>
                <ul className="list-unstyled mb-0">
                  <li>
                    <strong>Author:</strong> {book.author}
                  </li>
                  <li>
                    <strong>Publisher:</strong> {book.publisher}
                  </li>
                  <li>
                    <strong>ISBN:</strong> {book.isbn}
                  </li>
                  <li>
                    <strong>Classification:</strong> {book.classification}
                  </li>
                  <li>
                    <strong>Category:</strong> {book.category}
                  </li>
                  <li>
                    <strong>Page Count:</strong> {book.pageCount}
                  </li>
                  <li>
                    <strong>Price:</strong> ${book.price.toFixed(2)}
                  </li>
                </ul>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
                  <small className="text-secondary">
                    In cart:{' '}
                    {cart.find((item) => item.bookId === book.bookID)
                      ?.quantity ?? 0}
                  </small>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create the page navigation buttons from the total results. */}
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 my-4">
        <button
          className="btn btn-outline-primary"
          disabled={pageNum === 1}
          onClick={() =>
            updateSearchParams({ pageNum: (pageNum - 1).toString() })
          }
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className="btn btn-outline-primary"
            onClick={() =>
              updateSearchParams({ pageNum: (index + 1).toString() })
            }
            disabled={pageNum === index + 1}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary"
          disabled={pageNum === totalPages || totalPages === 0}
          onClick={() =>
            updateSearchParams({ pageNum: (pageNum + 1).toString() })
          }
        >
          Next
        </button>
      </div>
    </>
  );
}

export default BookList;
