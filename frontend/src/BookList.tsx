import { useEffect, useState } from 'react'
import type { Book, BookResponse } from './types/book'

const apiUrl = 'http://localhost:5028/books'

function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState<number>(5)
  const [pageNum, setPageNum] = useState<number>(1)
  const [sort, setSort] = useState<string>('title_asc')
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setError('')

        const response = await fetch(
          `${apiUrl}?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sort}`,
        )

        if (!response.ok) {
          throw new Error('Could not load books from the API.')
        }

        const data: BookResponse = await response.json()
        setBooks(data.books)
        setTotalItems(data.totalNumBooks)
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    }

    fetchBooks()
  }, [pageSize, pageNum, sort])

  return (
    <>
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="book-controls d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <label htmlFor="sortSelect" className="form-label mb-1">
            Sort by title
          </label>
          <select
            id="sortSelect"
            className="form-select"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value)
              setPageNum(1)
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
              setPageSize(Number(event.target.value))
              setPageNum(1)
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <p className="text-secondary mb-4">
        Showing page {pageNum} of {Math.max(totalPages, 1)} with {totalItems} total
        books.
      </p>

      <div className="row g-3">
        {books.map((book) => (
          <div key={book.bookID} className="col-12">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 my-4">
        <button
          className="btn btn-outline-primary"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className="btn btn-outline-primary"
            onClick={() => setPageNum(index + 1)}
            disabled={pageNum === index + 1}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary"
          disabled={pageNum === totalPages || totalPages === 0}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default BookList
