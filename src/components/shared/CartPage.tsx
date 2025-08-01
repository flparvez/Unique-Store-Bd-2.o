'use client';

import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/types/product';

import Image from 'next/image';
import Link from 'next/link';

// Define the Product and CartItem interfaces


interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariant?: string; // Optional, if applicable
}

const EmptyCartState = () => (
  <div className="text-center py-12">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
    <p className="mt-1 text-gray-500">Start adding some products to your cart.</p>
    <Link
      href="/products"
      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      Continue Shopping
    </Link>
  </div>
);

const CartItemComponent = ({
  item,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
}: {
  item: CartItem; // Use the CartItem interface here
  removeFromCart: (id: string, variant?: string) => void;
  incrementQuantity: (id: string, variant?: string) => void;
  decrementQuantity: (id: string, variant?: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
    <div className="w-full sm:w-1/3 bg-gray-50 flex items-center justify-center p-4">
      <Image
        src={item.product.images[0]?.url || '/placeholder-product.jpg'}
        alt={item.product.name || 'Product Image'}
        width={200}
        height={200}
        className="w-full h-auto max-h-48 object-contain"
      />
    </div>
    <div className="flex-1 p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
          {item.selectedVariant && (
            <p className="text-sm text-gray-500 mt-1">Variant: {item.selectedVariant}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{item.product.shortName}</p>
        </div>
        <button
          onClick={() => removeFromCart(item.product._id, item.selectedVariant)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <QuantityControl 
          quantity={item.quantity}
          onIncrement={() => incrementQuantity(item.product._id, item.selectedVariant)}
          onDecrement={() => decrementQuantity(item.product._id, item.selectedVariant)}
          max={item.product.stock}
          min={1}
        />
        <div className="text-right">
          {item.product.discount ? (
            <div>
              <span className="text-lg font-semibold text-red-600">
                ৳{(item.product.price * item.quantity).toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ৳{(item.product.originalPrice! * item.quantity).toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold">
              ৳{(item.product.price * item.quantity).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const QuantityControl = ({ quantity, onIncrement, onDecrement, max, min }: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max: number;
  min: number;
}) => (
  <div className="flex items-center space-x-3">
    <button
      onClick={onDecrement}
      disabled={quantity <= min}
      className="w-8 h-8 flex items-center justify-center border rounded-md transition-opacity disabled:opacity-50"
      aria-label="Decrease quantity"
    >
      -
    </button>
    <span className="w-10 text-center">{quantity}</span>
    <button
      onClick={onIncrement}
      disabled={quantity >= max}
      className="w-8 h-8 flex items-center justify-center border rounded-md transition-opacity disabled:opacity-50"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

const OrderSummary = ({ totalPrice, totalDiscount }: { totalPrice: number; totalDiscount: number }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
    <div className="space-y-4">
      {totalDiscount > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="text-green-600">-৳{totalDiscount.toFixed(2)}</span>
        </div>
      )}
      <div className="border-t mb-4 pt-4 flex justify-between">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-medium text-gray-900">৳{totalPrice.toFixed(2)}</span>
      </div>
    </div>
    <Link
      href="/checkout"
      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium text-center block transition-colors"
    >
      Checkout
    </Link>
    <div className="mt-4 flex justify-center">
      <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
        Continue Shopping
      </Link>
    </div>
  </div>
);

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInitialized,
  } = useCart();

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {cart.items.map(item => (
              <CartItemComponent
                key={`${item.product._id}-${item.selectedVariant || 'default'}`}
                item={item}
                removeFromCart={removeFromCart}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
              />
            ))}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                aria-label="Clear all items from cart"
              >
                Clear Cart
              </button>
            </div>
          </div>
          <div className="md:col-span-1">
            <OrderSummary totalPrice={cart.totalPrice} totalDiscount={cart.totalDiscount} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
