
import OrderInfoPage from '@/components/admin/OrderDetailPage'

import React from 'react'

const OrderInfo =async ({
    params,
  }: {
    params: Promise<{ id: string }>
  }) => {
    const id = (await params).id


    return (
        <div>
            <OrderInfoPage id={id} />
        </div>
    )
}

export default OrderInfo
