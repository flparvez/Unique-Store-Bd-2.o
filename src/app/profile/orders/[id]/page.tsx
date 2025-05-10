
import OrderInformationPage from '@/components/shared/OrderInformationPage'

import { Metadata } from 'next'

import React from 'react'
export const metadata: Metadata = {
  title: 'Order Details',
  description: 'Order Details- Unique Store BD',
}
const OrderInfo =async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = (await params).id
  const res = await fetch(`https://unique-store-bd.vercel.app/api/order/${id}`, {

    cache: 'force-cache',
  })
  const order = await res.json()

  return (
    <div>
      <OrderInformationPage order={order}  />
    </div>
  )
}

export default OrderInfo