"use client";

import { SessionProvider } from "next-auth/react";

// import useCartSidebar from '@/hooks/use-cart-sidebar'
// import CartSidebar from './cart-sidebar'
import  { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/hooks/useCart";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <SessionProvider refetchInterval={5 * 60}>
 <CartProvider>
     
     
          {children}
          
          </CartProvider>
          <Toaster />

    </SessionProvider>
  );
}