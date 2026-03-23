import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const navigate = useNavigate()
  const { cart, clearCart, removeFromCart, totalAmount, totalQuantity } = useCart()

  return (
    <main className="app-shell">
      <section className="bookstore-panel">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <p className="eyebrow">Shopping Cart</p>
            <h1 className="h3 mb-1">Your Cart</h1>
            <p className="subtitle mb-0">
              Review the books you added before you continue shopping.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="alert alert-light border mb-4">Your cart is empty.</div>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.bookId}>
                      <td>{item.bookTitle}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.bookId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div className="fw-semibold">{totalQuantity} book(s)</div>
                <div className="text-secondary">Total: ${totalAmount.toFixed(2)}</div>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default CartPage
