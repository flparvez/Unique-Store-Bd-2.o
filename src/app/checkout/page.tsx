'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

const CheckoutPage = () => {
  const { clearCart,cart } = useCart();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    paymentType: 'full',
    bkashTransactionId: '',
  });

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [payNowAmount, setPayNowAmount] = useState(0);
  const [payToRiderAmount, setPayToRiderAmount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const delivery = form.city.trim().toLowerCase() === 'dhaka' ? 60 : 120;
    setDeliveryCharge(delivery);

    const total = cart.totalPrice + delivery;

    if (form.paymentType === 'partial') {
      setPayNowAmount(100);
      setPayToRiderAmount(total - 100);
    } else {
      setPayNowAmount(total);
      setPayToRiderAmount(0);
    }
  }, [form.city, form.paymentType, cart.totalPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const orderData = {
      ...form,
      deliveryCharge,
      payNowAmount,
      payToRiderAmount,
      cart,
    };
  
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      const result = await res.json();
  
      if (result.success) {
        alert('✅ Order saved successfully!');
        clearCart();
        // Optional: redirect or clear cart
      } else {
        alert('❌ Failed to place order!');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Something went wrong!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">🛒 Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            required
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Full Address</label>
          <input
            type="text"
            name="address"
            required
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            name="city"
            required
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Type</label>
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="full">Full Payment</option>
            <option value="partial">Partial Payment (100৳)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Bkash Transaction ID</label>
          <input
            type="text"
            name="bkashTransactionId"
            placeholder="Enter Bkash Txn ID"
            required
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div className="bg-gray-100 p-4 rounded mt-6">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <p>Subtotal: ৳{cart.totalPrice.toFixed(2)}</p>
          <p>Delivery Charge: ৳{deliveryCharge}</p>
          <hr className="my-2" />
          <p className="font-bold">Total: ৳{(cart.totalPrice + deliveryCharge).toFixed(2)}</p>

          <div className="mt-3">
            {form.paymentType === 'partial' ? (
              <div className="text-sm text-gray-700">
                <p>📌 <span className="font-semibold">Pay Now:</span> ৳100 via <span className="font-bold text-pink-600">Bkash (019XXXXXXXX)</span></p>
                <p>💸 <span className="font-semibold">Pay to Rider:</span> ৳{payToRiderAmount.toFixed(2)}</p>
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                <p>📌 <span className="font-semibold">Pay Now:</span> ৳{payNowAmount.toFixed(2)} via <span className="font-bold text-pink-600">Bkash (019XXXXXXXX)</span></p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          ✅ Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
