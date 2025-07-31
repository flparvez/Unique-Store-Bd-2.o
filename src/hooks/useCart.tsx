'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { IProduct } from '@/types/product';

type CartItem = {
  product: IProduct;
  quantity: number;
  selectedVariant?: string;
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
};

const defaultCart: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
};

const CartContext = createContext<{
  cart: CartState;
  addToCart: (product: IProduct, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  incrementQuantity: (productId: string, selectedVariant?: string) => void;
  decrementQuantity: (productId: string, selectedVariant?: string) => void;
  clearCart: () => void;
  getItem: (productId: string, selectedVariant?: string) => CartItem | undefined;
  isInitialized: boolean;
}>({
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

const CART_KEY = 'cart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartState>(defaultCart);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      setCart(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const recalculate = (items: CartItem[]): CartState => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item?.product?.price
      return sum + price * item.quantity;
    }, 0);
    const totalDiscount = items?.reduce((sum, item) => {
      const discountAmount = item?.product?.discount
        ? item?.product?.price * (item.product.discount / 100) * item.quantity
        : 0;
      return sum + discountAmount;
    }, 0);
    return { items, totalItems, totalPrice, totalDiscount };
  };

  const getItem = (productId: string, selectedVariant?: string) => {
    return cart?.items?.find(
      (item) =>
        item?.product?._id === productId &&
        (selectedVariant ? item.selectedVariant === selectedVariant : true)
    );
  };

  const addToCart = (product: IProduct, quantity = 1, selectedVariant?: string) => {
    const existing = getItem(product._id, selectedVariant);
    let newItems;
    if (existing) {
      newItems = cart.items.map((item) =>
        item.product._id === product._id && item.selectedVariant === selectedVariant
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      );
    } else {
      newItems = [...cart?.items, { product, quantity, selectedVariant }];
    }
    setCart(recalculate(newItems));
  };

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    const filtered = cart.items.filter(
      (item) => !(item?.product?._id === productId && item.selectedVariant === selectedVariant)
    );
    setCart(recalculate(filtered));
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    const updated = cart.items.map((item) =>
      item.product._id === productId && item.selectedVariant === selectedVariant
        ? { ...item, quantity }
        : item
    );
    setCart(recalculate(updated));
  };

  const incrementQuantity = (productId: string, selectedVariant?: string) => {
    const item = getItem(productId, selectedVariant);
    if (item && item.quantity < item.product.stock) {
      updateQuantity(productId, item.quantity + 1, selectedVariant);
    }
  };

  const decrementQuantity = (productId: string, selectedVariant?: string) => {
    const item = getItem(productId, selectedVariant);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1, selectedVariant);
    }
  };

  const clearCart = () => {
    setCart(defaultCart);
  };

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
