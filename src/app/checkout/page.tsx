'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

const LOCAL_STORAGE_KEY = 'checkoutFormPermanent';

const CheckoutPage = () => {
  const { clearCart, cart } = useCart();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    paymentType: 'partial',
    bkashTransactionId: '',
  });

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [payNowAmount, setPayNowAmount] = useState(0);
  const [payToRiderAmount, setPayToRiderAmount] = useState(0);

  const advanced = cart?.items[0]?.product?.advanced || 100;

  // ✅ Load from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm((prev) => ({
        ...prev,
        ...parsed, // merge saved data into form
      }));
    }
  }, []);

  // ✅ Save form data permanently on every change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        city: form.city,
      })
    );
  }, [form.name, form.mobile, form.address, form.city]);

  // ✅ Calculate delivery and payment
  useEffect(() => {
    const delivery = form.city.trim().toLowerCase() === 'dhaka' ? 60 : 120;
    setDeliveryCharge(delivery);

    const total = cart.totalPrice + delivery;

    if (form.paymentType === 'partial') {
      setPayNowAmount(advanced);
      setPayToRiderAmount(total - advanced);
    } else {
      setPayNowAmount(total);
      setPayToRiderAmount(0);
    }
  }, [form.city, form.paymentType, cart.totalPrice, cart.items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        // form clear না করে রাখলে localStorage data থাকবে
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
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            required
            value={form.mobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Full Address</label>
          <input
            type="text"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
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
            <option value="partial">Partial Payment ({advanced}৳)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Bkash Transaction ID</label>
          <input
            type="text"
            name="bkashTransactionId"
            placeholder="Enter Bkash Txn ID"
            required
            value={form.bkashTransactionId}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div className="bg-gray-100 p-4 rounded mt-6">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <p>Subtotal: ৳{cart.totalPrice}</p>
          <p>Delivery Charge: ৳{deliveryCharge}</p>
          <hr className="my-2" />
          <p className="font-bold">Total: ৳{(cart.totalPrice + deliveryCharge).toFixed(2)}</p>

          <div className="mt-3 text-sm text-gray-700">
            {form.paymentType === 'partial' ? (
              <>
                <p>📌 <span className="font-semibold">Pay Now:</span> ৳{advanced} via <span className="font-bold text-pink-600">Bkash (019XXXXXXXX)</span></p>
                <p>💸 <span className="font-semibold">Pay to Rider:</span> ৳{payToRiderAmount.toFixed(2)}</p>
              </>
            ) : (
              <p>📌 <span className="font-semibold">Pay Now:</span> ৳{payNowAmount.toFixed(2)} via <span className="font-bold text-pink-600">Bkash (019XXXXXXXX)</span></p>
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
