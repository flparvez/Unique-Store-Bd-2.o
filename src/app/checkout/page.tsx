'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string }[];
  advanced?: number; // Optional, if applicable
}

interface CartItems {
  product: Product;
  quantity: number;
}

interface OrderItemsProps {
  items: CartItems[];
}

const LOCAL_STORAGE_KEY = 'checkoutFormPermanent';

const CheckoutPage = () => {
  const { clearCart, cart } = useCart();
  const router = useRouter();

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
  const [copied, setCopied] = useState(false);
  const advancedPayment = cart?.items[0]?.product?.advanced || 100;

  // Load from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm((prev) => ({ ...prev, ...parsed }));
    }
  }, []);
console.log(copied)
  // Save form data permanently on every change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Calculate delivery and payment
  useEffect(() => {
    const delivery = form.city.trim().toLowerCase() === 'dhaka' ? 60 : 120;
    setDeliveryCharge(delivery);

    const total = cart.totalPrice + delivery;
    if (form.paymentType === 'partial') {
      setPayNowAmount(advancedPayment);
      setPayToRiderAmount(total - advancedPayment);
    } else {
      setPayNowAmount(total);
      setPayToRiderAmount(0);
    }
  }, [form.city, form.paymentType, cart.totalPrice, advancedPayment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Copy Click
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("01608257876");
      setCopied(true);
      toast.success("Copied: 01608257876");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy number");
    }
  }, []);

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
        const orderId = result?.order?._id; // Get orderId from the response
        toast.success('✅ Order Placed successfully!');
        clearCart();
        router.push(`/orders/${orderId}`); // Use orderId here
      } else {
        toast.error('❌ Failed to place order!');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Something went wrong!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className='text-xl sm:text-2xl font-bold text-center'>
        অর্ডারটি কনফার্ম করতে ফর্মটি সম্পুর্ণ পুরণ করে নিচের Place Order বাটনে ক্লিক করুন।
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInputField("আপনার নাম", "name", "আপনার নাম লিখুন", form.name, handleChange, true)}
        {renderInputField("মোবাইল নাম্বার", "mobile", "মোবাইল নাম্বার লিখুন", form.mobile, handleChange, true)}
        {renderInputField("সম্পূর্ণ ঠিকানা", "address", "থানা সহ সম্পূর্ণ ঠিকানা লিখুন", form.address, handleChange, true)}
        {renderInputField("City", "city", "জেলা", form.city, handleChange, true)}

        <div>
          <label className="block mb-1 font-medium">Payment Type</label>
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="full">Full Payment</option>
            <option value="partial">Partial Payment ({advancedPayment}৳)</option>
          </select>
        </div>

        <div>
          <div className='block text-center font-bold sm:text-2xl text-xl text-gray-700 border'>
            Bkash(Send Money): <button type="button" onClick={handleCopy}>01608257876</button>
          </div>
          <br />
          {renderInputField("Last 4 Digits of Transaction", "bkashTransactionId", "Enter Bkash Txn ID", form.bkashTransactionId, handleChange, true)}
        </div>

        <OrderItems items={cart.items} />
        <OrderSummary 
          totalPrice={cart.totalPrice} 
          deliveryCharge={deliveryCharge} 
          paymentType={form.paymentType} 
          payNowAmount={payNowAmount} 
          payToRiderAmount={payToRiderAmount} 
          advancedPayment={advancedPayment} 
        />

        <Button type="submit" className="w-full mb-8 hover:bg-blue-700 transition">
          Place Order
        </Button>
      </form>
    </div>
  );
};

const renderInputField = (
  label: string,
  name: string,
  placeholder: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  required: boolean = false
) => (
  <div>
    <label className="block mb-1 font-medium">{label} {required && <span className='text-red-600'>*</span>}</label>
    <input
      type="text"
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border px-4 py-2 rounded"
    />
  </div>
);

const OrderItems = ({ items }: OrderItemsProps) => (
  <div className="flex flex-col">
    <h2 className="text-xl font-semibold mt-3 mb-4 text-center">Items</h2>
    {items.map((item) => (
      <div key={item.product._id} className="flex items-center justify-center mb-4">
        <Image width={100} height={100} src={item.product.images[0].url} alt={item.product.name} className="w-18 h-18 mr-4" />
        <div>
          <h3 className="text-sm sm:text-xl font-medium">{item.product.name}</h3>
          <p className="text-black text-sm">{item.quantity} x ৳{item.product.price}</p>
        </div>
      </div>
    ))}
  </div>
);

const OrderSummary = ({
  totalPrice,
  deliveryCharge,
  paymentType,
  payNowAmount,
  payToRiderAmount,
  advancedPayment,
}: {
  totalPrice: number;
  deliveryCharge: number;
  paymentType: string;
  payNowAmount: number;
  payToRiderAmount: number;
  advancedPayment: number;
}) => (
  <div className="bg-gray-100 p-4 rounded mt-6">
    <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
    <p>Subtotal: ৳{totalPrice}</p>
    <p>Delivery Charge: ৳{deliveryCharge}</p> [<span className='font-bold text-gray-500'>
      ঢাকার ভিতরে - ৬০টাকা, ঢাকার বাইরে-১২০টাকা
    </span>]
    <hr className="my-2" />
    <p className="font-bold">Total: ৳{(totalPrice + deliveryCharge).toFixed(2)}</p>

    <div className="mt-3 text-sm text-gray-700">
      {paymentType === 'partial' ? (
        <>
          <p>📌 <span className="font-semibold">Pay Now:</span> ৳{advancedPayment} via <span className="font-bold text-pink-600">Bkash (01608257876)</span></p>
          <p className='text-sm font-bold'>💸 <span className="font-bold">Pay to Rider:</span> ৳{payToRiderAmount}</p>
        </>
      ) : (
        <p>📌 <span className="font-semibold">Pay Now:</span> ৳{payNowAmount} via <span className="font-bold text-pink-600">Bkash (01608257876)</span></p>
      )}
    </div>
  </div>
);

export default CheckoutPage;
