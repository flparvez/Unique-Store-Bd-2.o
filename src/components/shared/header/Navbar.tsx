"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search,  User } from "lucide-react";

import Link from "next/link";
import Logo from "../../../../public/logo.jpg"
import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";


export function Navbar() {
  const { cart } = useCart();

  const session = useSession();
const admin = session.data?.user?.role==="admin"
const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sm:sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-700 focus:outline-none"
        >
          <Search className="h-6 w-6" />
        </button>
        <div className="w-auto">
          <Link href="/">
            <h2 className="flex items-center">
              <Image src={Logo} alt="Logo" width={100} height={100} className="h-8 w-auto sm:h-10" />
            </h2>
          </Link>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
        <SearchBar />
      </div>

      {/* Right: Cart + User */}
      <div className="flex items-center gap-4">
     
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    {admin && (
            <Link href="/admin" className="text-gray-700 font-medium">
              Admin
            </Link>
          )}
    {/* Mobile Menu */}
    {menuOpen && (
      <div className="lg:hidden px-4 pb-4">
        <div className="flex flex-col gap-2">
          <SearchBar />
       
   
        </div>
      </div>
    )}
  </header>

  );
}