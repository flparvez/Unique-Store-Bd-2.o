"use client"
import { useSession,signOut } from 'next-auth/react'

import React from 'react'

const ProfilePage = () => {
    const {data:session} = useSession()
  
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
  
        {/* <OrderTable orders={userOrders} /> */}
      </div>
    )
}

export default ProfilePage
