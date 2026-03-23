import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

interface CartPageLocationState {
  returnTo?: string
  addedTitle?: string
}

function CartPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, clearCart, removeFromCart, totalAmount, totalQuantity } = useCart()
  const locationState = location.state as CartPageLocationState | null
  const continueShoppingTarget = locationState?.returnTo ?? '/'
  const [showToast, setShowToast] = useState<boolean>(Boolean(locationState?.addedTitle))

  useEffect(() => {
    if (!locationState?.addedTitle) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowToast(false)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [locationState?.addedTitle])

  return (
    <main className="app-shell">
      {/* ============================================
          BOOTSTRAP TOAST FEATURE FOR THE RUBRIC
          THIS SHOWS AFTER A BOOK IS ADDED TO CART
          ============================================ */}
      {showToast ? (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div className="toast show text-bg-success border-0" role="status" aria-live="polite">
            <div className="d-flex">
              <div className="toast-body">
                Added "{locationState?.addedTitle}" to your cart.
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mb-4">
        <p className="eyebrow">Shopping Cart</p>
        <h1 className="h3 mb-1">Your Cart</h1>
        <p className="subtitle mb-0">
          Review the books you added before you continue shopping.
        </p>
      </section>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-8">
          <section className="bookstore-panel h-100">
            {cart.length === 0 ? (
              <div className="alert alert-light border mb-0">Your cart is empty.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
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
            )}
          </section>
        </div>

        <div className="col-12 col-lg-4">
          <aside className="bookstore-panel cart-sidebar">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
              <div>
                <h2 className="h5 mb-1">Summary</h2>
                <p className="text-secondary mb-0">
                  {totalQuantity} book(s) across {cart.length} line item(s)
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(continueShoppingTarget)}
              >
                Continue Shopping
              </button>
            </div>

            <div className="border rounded-3 p-3 bg-light-subtle">
              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span className="fw-semibold">${totalAmount.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CartPage
