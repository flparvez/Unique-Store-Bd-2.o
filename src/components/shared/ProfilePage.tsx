'use client';

import { useSession, signOut } from 'next-auth/react';
import { useOrders } from '@/hooks/UseOrders';
import ProductLoadingSkeleton from '../ProductLoadingSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import React from 'react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const { orders, isLoading } = useOrders();

  const userOrders = orders?.orders?.filter(order => order.userid === session?.user?.id);

  if (isLoading) return <ProductLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Profile Info Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">👤 My Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={session?.user?.name || ''}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧾 My Orders</h2>

          {userOrders?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link
                        href={`/orders/${order._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>
              <span className="font-semibold">Placed on:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
