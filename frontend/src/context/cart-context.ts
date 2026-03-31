import { createContext } from 'react';
import type { CartItem } from '../types/CartItem';

export interface CartContextValue {
  cart: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);
