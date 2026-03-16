import BookstoreHeader from './BookstoreHeader'
import BookList from './BookList'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      {/* Show the page title and short intro for the bookstore app. */}
      <BookstoreHeader />

      {/* Place the main book browsing feature inside the page layout. */}
      <section className="bookstore-panel">
        <BookList />
      </section>
    </main>
  )
}

export default App
