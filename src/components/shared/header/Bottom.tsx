"use client";


import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const BottomBar = () => {
    const { cart } = useCart();

  return (
    <>
     
      {/* Mobile Navbar (Bottom Fixed) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black shadow-md z-50">
        <div className="flex justify-between items-center py-2 px-4">
          {/* Home Icon */}
          <Link href="/" className="flex flex-col items-center text-gray-800 dark:text-white hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4V2m0 0l-6 6m6-6l6 6m0 10v-6M6 14v6m12 0h-4m0 0H10m6 0h4"
              />
            </svg>
            Home
          </Link>

          {/* Products Icon */}
          <Link href="/products" className="flex flex-col items-center text-gray-800 dark:text-white hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 6h18M3 12h18M3 18h18"
              />
            </svg>
            Products
          </Link>

          {/* Cart Icon with Item Count */}
          <Link href="/cart" className="flex flex-col items-center relative text-gray-800 dark:text-white hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h18v18H3V3z"
              />
            </svg>
            Cart
            {/* {cartItemCount > 0 && ( */}
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
                {cart?.totalItems}
              </span>
            {/* )} */}
          </Link>

          {/* Profile Icon */}
          <Link href="/profile" className="flex flex-col items-center text-gray-800 dark:text-white hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14c3.866 0 7 2.686 7 6v2H5v-2c0-3.314 3.134-6 7-6z"
              />
            </svg>
            Profile
          </Link>
        </div>
      </nav>

    
    </>
  );
};

export default BottomBar;