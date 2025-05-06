
import OrderTable from '@/components/admin/OrderTable'
import React from 'react'

const Orders =async () => {
    const res = await fetch('https://landig-store.vercel.app/api/order')
    const data = await res.json()
  console.log(data?.orders)
    return (
        <div>
            <h2>All Orders</h2>
            <OrderTable orders={data?.orders} />
        </div>
    )
}

export default Orders
