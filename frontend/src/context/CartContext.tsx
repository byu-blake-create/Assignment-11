import { createContext, type ReactNode, useContext, useState } from 'react'
import { type CartItem } from '../types/CartItem'

interface CartContextValue {
  cart: CartItem[]
  totalQuantity: number
  totalAmount: number
  addToCart: (item: CartItem) => void
  removeFromCart: (bookId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  // This cart intentionally lives only in memory while the React app is running.
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId)
      // Merge repeated adds into one row by increasing the quantity.
      const updatedCart = prevCart.map((c) =>
        c.bookId === item.bookId
          ? { ...c, quantity: c.quantity + item.quantity }
          : c,
      )

      return existingItem ? updatedCart : [...prevCart, item]
    })
  }

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId))
  }

  const clearCart = () => {
    setCart([])
  }

  // Derive totals from the current cart so every consumer stays in sync.
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
