"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, shipping, total, totalItems } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 5000; // $50.00
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col border-l border-[#e5ded4]">
          {/* Header */}
          <div className="p-5 border-b border-[#e5ded4] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#cf3c2a]" />
              <h2 className="text-lg font-bold text-[#231f1e]">Your Protest Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f4eee6] text-[#4a423f]">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#6b6460] hover:text-[#231f1e] hover:bg-[#f4eee6] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="p-4 bg-[#f8f5ee] border-b border-[#e5ded4]">
            {freeShippingRemaining > 0 ? (
              <p className="text-xs font-medium text-[#4a423f] mb-2">
                Add <span className="font-bold text-[#cf3c2a]">{formatPrice(freeShippingRemaining)}</span> more to unlock <span className="font-bold text-[#2d5a37]">FREE USPS Shipping</span>
              </p>
            ) : (
              <p className="text-xs font-bold text-[#2d5a37] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Unlocked! Your order qualifies for 100% FREE US Shipping
              </p>
            )}
            <div className="w-full bg-[#e5ded4] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2d5a37] h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#f4eee6] flex items-center justify-center text-[#9b948f] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-[#231f1e]">Your cart is empty</h3>
                <p className="text-xs text-[#6b6460] max-w-xs mt-1 mb-6">
                  Support Virginia soil and sustainable agriculture with official linocut protest gear.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                >
                  Browse Movement Goods
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#e5ded4] shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-[#f4eee6] rounded-lg overflow-hidden flex-shrink-0 border border-[#eee6db]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.productSlug}`}
                          onClick={closeCart}
                          className="font-bold text-sm text-[#231f1e] hover:text-[#cf3c2a] line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#9b948f] hover:text-[#cf3c2a] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#6b6460] mt-0.5">{item.variantName}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-sm text-[#231f1e]">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#e5ded4] rounded-md bg-[#faf8f5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#e5ded4] text-[#4a423f] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#231f1e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#e5ded4] text-[#4a423f] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call-to-action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#e5ded4] bg-white space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6b6460]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#231f1e]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6b6460]">
                  <span>USPS Ground Shipping</span>
                  <span className="font-semibold text-[#231f1e]">
                    {shipping === 0 ? <span className="text-[#2d5a37] font-bold">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#231f1e] pt-2 border-t border-[#e5ded4]">
                  <span>Estimated Total</span>
                  <span className="text-[#cf3c2a]">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6b6460] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2d5a37]" />
                <span>Zero-risk guarantee • 30-day grassroots hassle-free replacement</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
