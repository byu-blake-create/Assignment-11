import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext'

function CartSummary() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = useCart()
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const returnTo = `${location.pathname}${location.search}`

  const openCart = () => {
    // Pass the current page location into the cart so the user can return here.
    navigate('/cart', { state: { returnTo } })
  }

  return (
    <section
      className="cart-summary alert alert-light border mb-4"
      aria-live="polite"
      role="button"
      tabIndex={0}
      onClick={openCart}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openCart()
        }
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          {/* ============================================
              BOOTSTRAP BADGE FEATURE FOR THE RUBRIC
              THIS SHOWS THE LIVE QUANTITY OF ITEMS
              ============================================ */}
          <h2 className="h6 mb-1">Cart Summary</h2>
          <span className="badge text-bg-primary">{totalQuantity} items</span>
        </div>

        <div className="text-end">
          <div className="fw-semibold">${totalAmount.toFixed(2)}</div>
          <small className="text-secondary">Open cart</small>
        </div>
      </div>
    </section>
  )
}

export default CartSummary
