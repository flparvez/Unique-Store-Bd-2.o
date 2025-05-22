"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import {  Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/SearchBar";
import { useCart } from "@/hooks/useCart";
import Logo from "../../../../public/logo.jpg";
import { useState } from "react";

export function Navbar() {
  const { cart } = useCart();
  const session = useSession();
  const admin = session.data?.user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sm:sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-12 items-center justify-between px-2 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={30} height={30} className="rounded" />
          <span className="text-sm font-semibold">Unique Store BD</span>
        </Link>

        {/* Center: SearchBar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-lg">
          <SearchBar />
        </div>

        {/* Right: Cart & User */}
        <div className="flex items-center sm:gap-4 ">
          {/* Mobile Search Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden  text-gray-700"
          >
            <Search className="h-5 mr-1 w-8" />
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex flex-col items-center mr-2 text-gray-800 hover:text-blue-600"
          >
            <svg
              className="sm:h-6 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z" />
            </svg>
            <span className="text-xs">Cart</span>
            {cart?.totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Link href="/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile SearchBar */}
   
      {menuOpen &&      <div className="block sm:hidden p-2  ">
          <SearchBar />
        </div>
   }

      {/* Admin link */}
      {admin && (
        <div className="text-right px-4 pb-1 text-xs text-gray-600">
          <Link href="/admin">Admin Panel</Link>
        </div>
      )}
    </header>
  );
}
