"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has single variant, add directly
    if (product.variants.length === 1) {
      const variant = product.variants[0];
      addItem({
        productId: product.id,
        variantId: variant.id,
        productSlug: product.slug,
        name: product.name,
        variantName: variant.name,
        price: variant.price,
        image: variant.image || product.images[0],
        quantity: 1,
        printifyProductId: product.printifyProductId,
        printifyVariantId: variant.printifyVariantId,
      });
      toast.success(`Added ${product.name} to cart!`);
    } else {
      // Multiple variants, navigate to product page to choose size
      window.location.href = `/product/${product.slug}`;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#e5ded4] overflow-hidden flex flex-col hover:border-[#cf3c2a]/40 hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-[#f5f0ea] overflow-hidden block">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-[#fdfbf7]/95 backdrop-blur-xs text-[#24201e] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#e5ded4] shadow-xs">
          {product.categoryLabel}
        </span>

        {product.compareAtPrice && (
          <span className="absolute top-3 right-3 bg-[#cf3c2a] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
            SAVE {formatPrice(product.compareAtPrice - product.price)}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="font-bold text-base text-[#231f1e] group-hover:text-[#cf3c2a] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="text-xs text-[#6b6460] mt-1.5 line-clamp-2">
            {product.tagline}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[#f0ece5] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#231f1e]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#9b948f] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#2d5a37] font-semibold block">
              In Stock • Ships USPS Ground
            </span>
          </div>

          {product.variants.length === 1 ? (
            <button
              onClick={handleQuickAdd}
              aria-label="Add to Cart"
              className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#cf3c2a] text-[#231f1e] hover:text-white border border-[#e5ded4] hover:border-[#cf3c2a] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-1 text-xs font-bold text-[#cf3c2a] hover:text-[#ad2c1c] transition-colors"
            >
              <span>Select Size</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
