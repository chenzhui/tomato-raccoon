"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState } from "react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e5ded4]">
      {/* Top Banner */}
      <div className="bg-[#2d5a37] text-white text-xs font-semibold py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 inline-block" />
        <span>FREE US SHIPPING ON ORDERS OVER $50 • 100% RECYCLED PAPER PACKAGING • USPS FULFILLMENT</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Tomato Raccoon Logo"
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#231f1e] block leading-none">
              Tomato Raccoon
            </span>
            <span className="text-[11px] font-bold text-[#cf3c2a] uppercase tracking-widest block mt-1">
              Supply Co. · Defend Soil
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4a423f]">
          <Link href="/products" className="hover:text-[#cf3c2a] transition-colors">
            All Goods
          </Link>
          <Link href="/category/apparel" className="hover:text-[#cf3c2a] transition-colors">
            Vintage Apparel
          </Link>
          <Link href="/category/signs" className="hover:text-[#cf3c2a] transition-colors">
            Yard Signs
          </Link>
          <Link href="/category/stickers" className="hover:text-[#cf3c2a] transition-colors">
            Stickers
          </Link>
          <Link href="/track-order" className="hover:text-[#cf3c2a] transition-colors flex items-center gap-1.5 text-[#2d5a37]">
            <Truck className="w-4 h-4" />
            Track Order
          </Link>
          <Link href="/about" className="hover:text-[#cf3c2a] transition-colors">
            Our Story
          </Link>
        </nav>

        {/* Right Action: Cart Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="View Shopping Cart"
            className="relative p-2.5 rounded-full bg-white border border-[#e5ded4] text-[#231f1e] hover:border-[#cf3c2a] hover:text-[#cf3c2a] transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#cf3c2a] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4a423f] hover:text-[#231f1e]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5ded4] bg-[#fdfbf7] px-4 pt-3 pb-6 space-y-3 font-semibold text-sm">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#231f1e] hover:text-[#cf3c2a]"
          >
            All Goods
          </Link>
          <Link
            href="/category/apparel"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#231f1e] hover:text-[#cf3c2a]"
          >
            Vintage Apparel
          </Link>
          <Link
            href="/category/signs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#231f1e] hover:text-[#cf3c2a]"
          >
            Lawn Yard Signs
          </Link>
          <Link
            href="/category/stickers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#231f1e] hover:text-[#cf3c2a]"
          >
            Vinyl Stickers
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#2d5a37] flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Track Order
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#231f1e] hover:text-[#cf3c2a]"
          >
            Our Story & Movement
          </Link>
        </div>
      )}
    </header>
  );
}
