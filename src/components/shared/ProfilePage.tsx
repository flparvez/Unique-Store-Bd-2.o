"use client"

import { useSession,signOut } from 'next-auth/react'

import React from 'react'

import { useOrders } from '@/hooks/UseOrders'
import ProductLoadingSkeleton from '../ProductLoadingSkeleton'
import { Table } from 'lucide-react'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import Link from 'next/link'

const ProfilePage = () => {
    const {data:session} = useSession()
    const { orders, isLoading } = useOrders();
   
     // Filter orders by user ID
  const userOrders = orders?.orders?.filter((order) => order.userid === session?.user?.id);

  if (isLoading) {
    return <ProductLoadingSkeleton />
  }
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={session?.user?.name || ''}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={session?.user?.email || ''}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>
     
            <button onClick={() => signOut()}
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
       
        </div>
        <div >
    
    <h1 className="sm:text-3xl text-xl font-bold text-center mb-8">My Orders</h1>
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order Id</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {userOrders?.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell className="font-medium"><Link href={`/profile/orders/${invoice._id}`}>{invoice.orderId}</Link></TableCell>
            <TableCell>{invoice?.createdAt}</TableCell>
            <TableCell>{invoice.name}</TableCell>
            <TableCell>{invoice?.status}</TableCell>
  
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
    
    </div>
 
      </div>
    )
}

export default ProfilePage
