'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { IProduct } from '@/types/product';

interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariant?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
}

interface CartContextType {
  cart: CartState;
  addToCart: (product: IProduct, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  incrementQuantity: (productId: string, selectedVariant?: string) => void;
  decrementQuantity: (productId: string, selectedVariant?: string) => void;
  clearCart: () => void;
  getItem: (productId: string, selectedVariant?: string) => CartItem | undefined;
  isInitialized: boolean;
}

const CART_KEY = 'cart';
const defaultCart: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
};

const CartContext = createContext<CartContextType>({
  cart: defaultCart,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  clearCart: () => {},
  getItem: () => undefined,
  isInitialized: false,
});

const calculateCartTotals = (items: CartItem[]): Omit<CartState, 'items'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => {
    if (!item.product?.discount) return sum;
    return sum + (item.product.price * (item.product.discount / 100) * item.quantity);
  }, 0);

  return { totalItems, totalPrice, totalDiscount };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartState>(defaultCart);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart({ ...parsed, ...calculateCartTotals(parsed.items) });
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const getItem = useCallback((productId: string, selectedVariant?: string) => {
    return cart.items.find(
      item => item.product._id === productId && 
      (selectedVariant ? item.selectedVariant === selectedVariant : true)
    );
  }, [cart.items]);

  const updateCartItems = useCallback((newItems: CartItem[]) => {
    setCart(  ({
      items: newItems,
      ...calculateCartTotals(newItems)
    }));
  }, []);

  const addToCart = useCallback((
    product: IProduct,
    quantity: number = 1,
    selectedVariant?: string
  ) => {
    const existingItem = getItem(product._id, selectedVariant);
    const newItems = existingItem 
      ? cart.items.map(item => 
          item.product._id === product._id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      : [...cart.items, { product, quantity, selectedVariant }];
    
    updateCartItems(newItems);
  }, [cart.items, getItem, updateCartItems]);

  const removeFromCart = useCallback((
    productId: string, 
    selectedVariant?: string
  ) => {
    const newItems = cart.items.filter(
      item => !(item.product._id === productId && item.selectedVariant === selectedVariant)
    );
    updateCartItems(newItems);
  }, [cart.items, updateCartItems]);

  const updateQuantity = useCallback((
    productId: string,
    quantity: number,
    selectedVariant?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    const newItems = cart.items.map(item => 
      item.product._id === productId && item.selectedVariant === selectedVariant
        ? { ...item, quantity }
        : item
    );
    updateCartItems(newItems);
  }, [cart.items, removeFromCart, updateCartItems]);

  const incrementQuantity = useCallback((
    productId: string,
    selectedVariant?: string
  ) => {
    const item = getItem(productId, selectedVariant);
    if (item && item.quantity < item.product.stock) {
      updateQuantity(productId, item.quantity + 1, selectedVariant);
    }
  }, [getItem, updateQuantity]);

  const decrementQuantity = useCallback((
    productId: string,
    selectedVariant?: string
  ) => {
    const item = getItem(productId, selectedVariant);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1, selectedVariant);
    }
  }, [getItem, updateQuantity]);

  const clearCart = useCallback(() => {
    updateCartItems([]);
  }, [updateCartItems]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getItem,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
