"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/track-order", label: "Track Order" },
    { href: "/returns", label: "Support" },
  ];

  return (
    <>
      {/* 顶部公告栏 (Top Announcement Bar) */}
      <div className="bg-[#1E3F20] text-[#FAF7F0] text-center py-2 px-4 text-[11px] sm:text-xs font-bold tracking-wider">
        🍅 FREE US SHIPPING ON ORDERS OVER $50 • 100% PLASTIC-FREE PACKAGING 🌱
      </div>

      {/* 暖调复古美式田园顶栏 */}
      <header className="sticky top-0 z-50 border-b border-[#E5DDD0] bg-[#FAF7F0]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-14 sm:h-16">
            {/* 左侧：品牌 Logo 与移动端汉堡按钮 */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Open menu"
                className="lg:hidden p-2 rounded-full text-neutral-700 hover:bg-[#EAE4D7] transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-sm font-bold tracking-tight text-[#1E3F20] hover:opacity-85 transition-opacity"
              >
                <span className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#D9CDB8] flex items-center justify-center p-0.5 shadow-xs shrink-0 overflow-hidden">
                  <Image
                    src="/images/raccoon-tomato.svg"
                    alt="Tomato Raccoon"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                    priority
                  />
                </span>
                <span className="text-[#1E3F20] text-base sm:text-lg font-black tracking-tight">
                  Tomato Raccoon <span className="text-[#D93829] font-semibold text-xs ml-0.5">Supply Co.</span>
                </span>
              </Link>
            </div>

            {/* 居中：苹果官网风格居中极简导航链接 */}
            <nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-normal text-neutral-600 hover:text-black transition-colors tracking-tight whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 右侧：搜索栏与购物车按钮 */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 搜索框 (桌面端常驻，小屏折叠) */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search goods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => !searchQuery && setSearchOpen(false)}
                      className="w-36 sm:w-48 pl-3 pr-8 py-1.5 text-xs rounded-full border border-[#D9CDB8] bg-white text-[#1E1D1B] focus:outline-none focus:ring-1 focus:ring-[#1E3F20]"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-neutral-700 hover:bg-[#EAE4D7] rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* 购物车按钮 */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 hover:bg-[#EAE4D7] rounded-full transition-colors relative text-neutral-800"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItems > 0 && (
                  <span
                    aria-live="polite"
                    className="absolute -top-1 -right-1 bg-[#1E1D1B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs animate-in zoom-in-50"
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端汉堡抽屉菜单 */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E5DDD0] bg-[#FAF7F0] px-6 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-[#D9CDB8] bg-white text-[#1E1D1B] focus:outline-none"
              />
            </form>
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-[#EAE4D7] hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
