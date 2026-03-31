import BookstoreHeader from '../BookstoreHeader';
import BookList from '../BookList';
import CartSummary from '../CartSummary';

function BookstorePage() {
  return (
    <main className="app-shell">
      <BookstoreHeader />

      <section className="bookstore-panel">
        <CartSummary />
        <BookList />
      </section>
    </main>
  );
}

export default BookstorePage;
