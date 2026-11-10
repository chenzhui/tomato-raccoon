import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() || "";

  const filteredProducts = query
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    : PRODUCTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E5DDD0] pb-6">
        <span className="text-xs font-bold text-[#D93829] uppercase tracking-wider">
          Official Store
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E3F20] mt-1">
          {query ? `Search results for "${query}"` : "All Movement Goods"}
        </h1>
        <p className="text-sm text-[#524B42] mt-1 max-w-2xl">
          High-durability yard signs, Comfort Colors garment-dyed apparel, and weatherproof vinyl stickers printed in the USA.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-6">
          <Link
            href="/products"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              !query
                ? "bg-[#1E3F20] text-[#FAF7F0] shadow-xs"
                : "bg-white text-[#524B42] border border-[#D9CDB8] hover:border-[#1E3F20]"
            }`}
          >
            All Goods ({PRODUCTS.length})
          </Link>
          {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#524B42] border border-[#D9CDB8] hover:border-[#1E3F20] hover:text-[#1E3F20] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-3xl border border-[#E5DDD0]">
          <p className="text-sm text-[#524B42]">No products found matching &ldquo;{query}&rdquo;.</p>
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-block px-5 py-2 text-xs font-bold rounded-full bg-[#1E3F20] text-white"
            >
              View all products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
