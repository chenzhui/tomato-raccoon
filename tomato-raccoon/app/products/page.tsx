import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#e5ded4] pb-6">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          Official Store
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231f1e] mt-1">
          All Movement Goods
        </h1>
        <p className="text-sm text-[#6b6460] mt-1 max-w-2xl">
          High-durability yard signs, Comfort Colors garment-dyed apparel, and weatherproof vinyl stickers printed in the USA.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-6">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#cf3c2a] text-white shadow-xs"
          >
            All Goods ({PRODUCTS.length})
          </Link>
          {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white text-[#4a423f] border border-[#e5ded4] hover:border-[#cf3c2a] hover:text-[#cf3c2a] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
