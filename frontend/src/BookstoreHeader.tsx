import { Link } from 'react-router-dom';

function BookstoreHeader() {
  return (
    // Introduce the bookstore page before the user starts browsing books.
    <section className="bookstore-header">
      <div>
        <h1>Online Bookstore</h1>
        <p className="subtitle mb-0">
          Browse the catalog, sort by title, and move through the results with
          pagination.
        </p>
      </div>

      <Link to="/adminbooks" className="btn btn-outline-dark">
        Manage Books
      </Link>
    </section>
  );
}

export default BookstoreHeader;
