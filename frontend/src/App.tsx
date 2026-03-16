import BookstoreHeader from './BookstoreHeader'
import BookList from './BookList'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <BookstoreHeader />

      <section className="bookstore-panel">
        <BookList />
      </section>
    </main>
  )
}

export default App
