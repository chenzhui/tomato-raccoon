import { getProductsByCategory, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const currentCategory = CATEGORIES.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const products = getProductsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb / Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524B42] hover:text-[#D93829] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Goods</span>
      </Link>

      {/* Header */}
      <div className="border-b border-[#E5DDD0] pb-6">
        <span className="text-xs font-bold text-[#D93829] uppercase tracking-wider">
          Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E3F20] mt-1">
          {currentCategory.name}
        </h1>
        <p className="text-sm text-[#524B42] mt-1 max-w-2xl">
          {currentCategory.description}
        </p>

        {/* Category Switcher Pills */}
        <div className="flex flex-wrap gap-2 pt-6">
          <Link
            href="/products"
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#524B42] border border-[#D9CDB8] hover:border-[#1E3F20] hover:text-[#1E3F20] transition-colors"
          >
            All Goods
          </Link>
          {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                cat.slug === slug
                  ? "bg-[#1E3F20] text-[#FAF7F0] shadow-xs"
                  : "bg-white text-[#524B42] border border-[#D9CDB8] hover:border-[#1E3F20] hover:text-[#1E3F20]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-3xl border border-[#E5DDD0]">
          <p className="text-sm text-[#524B42]">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
