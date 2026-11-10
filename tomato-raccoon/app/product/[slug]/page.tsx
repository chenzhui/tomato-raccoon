import { getProductBySlug, PRODUCTS } from "@/lib/products";
import { ProductDetails } from "./ProductDetails";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Tomato Raccoon" };
  }

  return {
    title: `${product.name} | Tomato Raccoon Supply Co.`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b6460]">
        <Link href="/products" className="hover:text-[#cf3c2a] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Goods</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-[#cf3c2a] transition-colors">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-[#231f1e] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Interactive Product Details */}
      <ProductDetails product={product} />
    </div>
  );
}
