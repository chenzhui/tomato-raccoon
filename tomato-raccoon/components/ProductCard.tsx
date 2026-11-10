"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      window.location.href = `/product/${product.slug}`;
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* 图片展示卡片 (保持 old 版本的 rounded-3xl 与复古边框质感) */}
      <div className="relative aspect-square bg-[#FDFBF7] border border-[#E5DDD0] rounded-3xl overflow-hidden mb-4 group-hover:border-[#1E3F20]/50 transition-all flex items-center justify-center p-4 shadow-2xs">
        {/* 单变体快捷添加按钮 */}
        {product.variants.length === 1 && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-[#1E3F20] text-[#FAF7F0] opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-md z-10 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}

        <div className="relative w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* 文字与价格信息 */}
      <div className="space-y-1">
        <h3 className="font-bold text-base text-[#1E1D1B] group-hover:text-[#D93829] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-[#524B42] line-clamp-1">
          {product.tagline}
        </p>
        <div className="pt-1 flex items-baseline gap-2">
          <span className="font-bold text-sm text-[#1E3F20]">
            {product.variants.length > 1 ? `From ${formatPrice(product.price)}` : formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#8C5A2B] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
