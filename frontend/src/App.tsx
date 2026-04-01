import './App.css';
import { CartProvider } from './context/CartContext';
import BookstorePage from './pages/BookstorePage';
import CartPage from './pages/CartPage';
import AdminBooksPage from './pages/AdminBooksPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    // Keep the cart alive while the user moves between the bookstore and cart routes.
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BookstorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
