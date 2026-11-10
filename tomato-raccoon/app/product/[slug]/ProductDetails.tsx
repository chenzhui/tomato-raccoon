"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export function ProductDetails({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productSlug: product.slug,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      image: selectedVariant.image || selectedImage,
      quantity,
      printifyProductId: product.printifyProductId,
      printifyVariantId: selectedVariant.printifyVariantId,
    });
    toast.success(`Added ${quantity} × ${product.name} (${selectedVariant.name}) to cart!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Media Gallery */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-square bg-white rounded-3xl border border-[#e5ded4] overflow-hidden shadow-xs">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        {/* Thumbnail Selector */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedImage === img
                    ? "border-[#cf3c2a] ring-2 ring-[#cf3c2a]/20 scale-102"
                    : "border-[#e5ded4] opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Buying Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
            {product.categoryLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f1e] mt-1 leading-snug">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6b6460] mt-1 font-medium">
            {product.tagline}
          </p>
        </div>

        {/* Price Display */}
        <div className="p-4 bg-white rounded-2xl border border-[#e5ded4] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#231f1e]">
                {formatPrice(selectedVariant.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#9b948f] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#2d5a37] font-semibold mt-0.5">
              USPS Tracked Shipping • Ships within 2-4 business days
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#f4eee6] text-[#4a423f] rounded-full">
            In Stock
          </span>
        </div>

        {/* Variant / Size Options */}
        {product.variants.length > 1 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#1E1D1B] uppercase tracking-wider">
                Select Option / Size:
              </label>
              <span className="font-semibold text-[#D93829]">{selectedVariant.name}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.image) setSelectedImage(v.image);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1E3F20] text-[#FAF7F0] border-[#1E3F20] shadow-xs"
                        : "bg-white text-[#1E1D1B] border-[#D9CDB8] hover:border-[#1E3F20]"
                    }`}
                  >
                    <span>{v.size || v.name}</span>
                    {v.price !== product.price && (
                      <span className={`block text-[10px] ${isSelected ? "text-white/80" : "text-[#7C5335]"}`}>
                        {formatPrice(v.price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity and Add to Cart Button */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-[#D9CDB8] rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-[#524B42] hover:text-[#1E1D1B] hover:bg-[#F3ECE0] rounded-lg transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-[#1E1D1B] min-w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-[#524B42] hover:text-[#1E1D1B] hover:bg-[#F3ECE0] rounded-lg transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Movement Cart • {formatPrice(selectedVariant.price * quantity)}</span>
            </button>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="p-5 bg-white rounded-2xl border border-[#e5ded4] space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#231f1e]">
            Specifications & Craftsmanship
          </h3>
          <ul className="space-y-2 text-xs text-[#5a524e]">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#2d5a37] flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grassroots Guarantees */}
        <div className="grid grid-cols-2 gap-3 text-xs text-[#5a524e]">
          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e5ded4] flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#2d5a37] flex-shrink-0" />
            <div>
              <p className="font-bold text-[#231f1e]">USPS Ground</p>
              <p className="text-[10px] text-[#6b6460]">Tracked US delivery</p>
            </div>
          </div>
          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e5ded4] flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-[#cf3c2a] flex-shrink-0" />
            <div>
              <p className="font-bold text-[#231f1e]">30-Day Guarantee</p>
              <p className="text-[10px] text-[#6b6460]">Flawless replacement</p>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="border-t border-[#e5ded4] pt-6 space-y-3">
          <h3 className="font-bold text-sm text-[#231f1e]">About This Piece</h3>
          <p className="text-xs text-[#5a524e] leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
