import OrderInfoPage from '@/components/admin/OrderDetailPage'
import React from 'react'

const OrderInfo =async ({
    params,
  }: {
    params: Promise<{ id: string }>
  }) => {
    const id = (await params).id
    const res = await fetch(`https://landig-store.vercel.app/api/order/${id}`, {
  
      cache: 'force-cache',
      
    })
    const order = await res.json()
  
    return (
        <div>
            <OrderInfoPage order={order} />
        </div>
    )
}

export default OrderInfo
