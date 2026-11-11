import { Hero } from "@/components/sections/Hero";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* 1. 复刻旧版经典 Hero 画报与三大柱石 */}
      <Hero />

      {/* 2. 复刻旧版 ProductGrid 经典网格展示 */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider mb-2">
              ★ Official Gear
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3F20]">
              Movement Bestsellers
            </h2>
            <p className="mt-2 text-[#524B42] text-sm sm:text-base">
              Every yard sign, tote, and sticker defends local Virginia soil &amp; water
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1E3F20] hover:text-[#D93829] transition-colors"
          >
            <span>Explore all goods</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6 大周边栅格展示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#1E3F20] hover:text-[#D93829] transition-colors"
          >
            <span>View all goods</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
