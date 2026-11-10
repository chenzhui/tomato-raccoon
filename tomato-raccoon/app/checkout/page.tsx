"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { ShieldCheck, Truck, Lock, ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, isMounted, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "Richmond",
    region: "VA",
    zip: "23219",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.address1 || !formData.firstName) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: {
            ...formData,
            country: "US",
          },
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      toast.success("Order confirmed! Fulfilling with USPS Ground.");
      clearCart();
      router.push(`/order/success/${data.orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong during checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#cf3c2a] mx-auto" />
      </div>
    );
  }

  // Guard against empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#f4eee6] flex items-center justify-center text-[#9b948f] mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231f1e]">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-[#6b6460] max-w-md mx-auto">
          You don&apos;t have any movement gear in your cart yet. Please select your preferred shirt, hoodie, lawn sign or stickers before checkout.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl transition-colors shadow-xs text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Protest Goods</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b6460] hover:text-[#cf3c2a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Shipping Address & Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#231f1e] tracking-tight">
              Express Movement Checkout
            </h1>
            <p className="text-xs text-[#6b6460] mt-1">
              All orders are dispatched in plastic-free packaging via United States Postal Service.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5ded4] space-y-4">
              <h2 className="font-bold text-sm text-[#231f1e] uppercase tracking-wider">
                1. Contact Information
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                  Email Address (for USPS tracking link) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="supporter@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                  Phone Number (optional, for carrier alerts)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(804) 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                />
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5ded4] space-y-4">
              <h2 className="font-bold text-sm text-[#231f1e] uppercase tracking-wider">
                2. Shipping Address (Continental United States)
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Thomas"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Jefferson"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address1"
                  required
                  placeholder="104 Rural Route 301"
                  value={formData.address1}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                  Apartment, Suite, Unit (optional)
                </label>
                <input
                  type="text"
                  name="address2"
                  placeholder="Farmstead #2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Hanover"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="region"
                    required
                    placeholder="VA"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a423f] mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="23069"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Authorization */}
            <div className="bg-white p-6 rounded-2xl border border-[#e5ded4] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-[#231f1e] uppercase tracking-wider">
                  3. Payment & Security
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2d5a37]">
                  <Lock className="w-3.5 h-3.5" />
                  256-Bit Encrypted
                </span>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#e5ded4] text-xs text-[#5a524e] space-y-2">
                <p className="font-semibold text-[#231f1e]">
                  🔒 Direct Grassroots Checkout (Simulated Stripe Mode)
                </p>
                <p>
                  No credit card numbers are stored on our servers. Clicking the button below immediately sends your order to the American print house for printing & USPS dispatch.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#1E3F20] hover:bg-[#2D5A27] disabled:opacity-50 text-white font-extrabold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order & Alerting Workshop...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Authorize Order • {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6 sticky top-28">
            <h2 className="font-extrabold text-base text-[#231f1e]">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* Item List */}
            <div className="divide-y divide-[#f0ece5] max-h-96 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3">
                  <div className="relative w-16 h-16 bg-[#faf8f5] rounded-xl overflow-hidden flex-shrink-0 border border-[#e5ded4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#4a423f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#231f1e] line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-[#6b6460] mt-0.5">{item.variantName}</p>
                    <p className="text-xs font-bold text-[#cf3c2a] mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#e5ded4] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6b6460]">
                <span>Merchandise Subtotal</span>
                <span className="font-semibold text-[#231f1e]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6b6460]">
                <span>USPS Ground Shipping</span>
                <span className="font-semibold text-[#231f1e]">
                  {shipping === 0 ? <span className="text-[#2d5a37] font-bold">FREE</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#231f1e] pt-3 border-t border-[#e5ded4]">
                <span>Total Amount Due</span>
                <span className="text-[#cf3c2a]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Reassurance notes */}
            <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] space-y-2 text-[11px] text-[#6b6460]">
              <div className="flex items-center gap-2 text-[#2d5a37] font-bold">
                <Truck className="w-4 h-4" />
                <span>USPS Ground Advantage Tracked</span>
              </div>
              <p>
                Printed using eco-friendly water-based inks and dispatched in 100% recyclable paper packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
