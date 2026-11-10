import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, MOVEMENT_REVIEWS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Sprout, Droplets, ZapOff, Star, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f3ece0] via-[#faf8f5] to-[#faf8f5] border-b border-[#e5ded4] pt-12 pb-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cf3c2a]/10 text-[#cf3c2a] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#cf3c2a] animate-pulse" />
                Grassroots Soil Protection Movement
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#231f1e] tracking-tight leading-[1.1]">
                Grow Tomatoes, <br />
                <span className="text-[#cf3c2a]">Not Data Centers.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5a524e] max-w-2xl leading-relaxed">
                Fertile Virginia farm soil took thousands of years to create. Don&apos;t let mega-watt data centers concrete over our food sheds and drain our pristine aquifers. Wear the message, plant the yard sign, and stand with local agriculture.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <span>Shop Movement Goods</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#f5f0ea] text-[#231f1e] font-bold rounded-xl transition-all border border-[#e5ded4] flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                  <span>Why We Protest</span>
                </Link>
              </div>

              {/* Fast Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-[#6b6460]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2d5a37]" />
                  <span>Free US Shipping Over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2d5a37]" />
                  <span>USPS Tracked Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#2d5a37]" />
                  <span>100% Recyclable Packaging</span>
                </div>
              </div>
            </div>

            {/* Right Artwork / Mascot */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl bg-white p-8 border-2 border-[#e5ded4] shadow-xl hover:rotate-1 transition-transform">
                <Image
                  src="/images/raccoon-tomato.svg"
                  alt="Official Tomato Raccoon Protest Mascot"
                  fill
                  className="object-contain p-4"
                  priority
                />
                <div className="absolute -bottom-4 -left-4 bg-[#2d5a37] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md uppercase tracking-wider">
                  🌱 Soil First • Always
                </div>
                <div className="absolute -top-4 -right-4 bg-[#cf3c2a] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md uppercase tracking-wider">
                  🍅 100% Grassroots
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Fast Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/category/apparel"
            className="group p-6 rounded-2xl bg-white border border-[#e5ded4] hover:border-[#cf3c2a] transition-all shadow-xs hover:shadow-md flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">Comfort Colors</span>
              <h3 className="text-lg font-bold text-[#231f1e] group-hover:text-[#cf3c2a] transition-colors mt-0.5">
                Vintage Apparel
              </h3>
              <p className="text-xs text-[#6b6460] mt-1">Water-based ink tees & heavyweight hoodies</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9b948f] group-hover:text-[#cf3c2a] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/category/signs"
            className="group p-6 rounded-2xl bg-white border border-[#e5ded4] hover:border-[#cf3c2a] transition-all shadow-xs hover:shadow-md flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#2d5a37] uppercase tracking-wider">High Visibility</span>
              <h3 className="text-lg font-bold text-[#231f1e] group-hover:text-[#cf3c2a] transition-colors mt-0.5">
                Lawn Yard Signs
              </h3>
              <p className="text-xs text-[#6b6460] mt-1">Weatherproof corrugated signs with metal H-stake</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9b948f] group-hover:text-[#cf3c2a] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/category/stickers"
            className="group p-6 rounded-2xl bg-white border border-[#e5ded4] hover:border-[#cf3c2a] transition-all shadow-xs hover:shadow-md flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">Outdoor Vinyl</span>
              <h3 className="text-lg font-bold text-[#231f1e] group-hover:text-[#cf3c2a] transition-colors mt-0.5">
                Bumper Decals & Stickers
              </h3>
              <p className="text-xs text-[#6b6460] mt-1">UV-laminated for truck tailgates & water bottles</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9b948f] group-hover:text-[#cf3c2a] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">Official Gear</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#231f1e] mt-1">
              Movement Bestsellers
            </h2>
            <p className="text-sm text-[#6b6460] mt-1">
              Printed on-demand in the USA with eco-inks, fulfilling directly to your doorstep via USPS.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#cf3c2a] hover:text-[#ad2c1c]"
          >
            <span>View All Goods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Movement Manifesto / Values */}
      <section className="bg-[#f0ece5] py-16 border-y border-[#e5ded4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#2d5a37] uppercase tracking-wider">Grassroots Coalition</span>
            <h2 className="text-3xl font-black text-[#231f1e] mt-1">
              Water Over Watts. Farms Over Firewalls.
            </h2>
            <p className="text-sm text-[#6b6460] mt-2">
              Why thousands of Virginia homesteaders, family farmers, and neighbors are speaking out at county supervisor hearings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#e5ded4] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2d5a37]/10 text-[#2d5a37] flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#231f1e]">Water Depletion Crisis</h3>
              <p className="text-xs text-[#6b6460] leading-relaxed">
                A single industrial data center campus consumes up to 5 million gallons of clean drinking water every day for evaporative cooling towers, threatening private well owners and agricultural aquifers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#e5ded4] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#cf3c2a]/10 text-[#cf3c2a] flex items-center justify-center">
                <ZapOff className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#231f1e]">Spiking Electric Bills</h3>
              <p className="text-xs text-[#6b6460] leading-relaxed">
                Grid expansions, new high-voltage transmission corridors, and peak fossil-fuel peaker plants get subsidized through residential ratepayer utility bills while tech conglomerates get tax incentives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#e5ded4] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2d5a37]/10 text-[#2d5a37] flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-[#231f1e]">Irreplaceable Farmland</h3>
              <p className="text-xs text-[#6b6460] leading-relaxed">
                Once prime historical agricultural topsoil is scraped away for concrete data slabs and asphalt parking lots, it is permanently lost to food security and ecological wildlife corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Voices / Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">Community Voices</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#231f1e] mt-1">
            Heard Across Town Halls & Farmers Markets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOVEMENT_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-[#e5ded4] flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1 text-[#eab308] mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#4a423f] leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f4eee6]">
                <p className="font-bold text-xs text-[#231f1e]">{review.authorName}</p>
                <p className="text-[11px] text-[#6b6460]">{review.authorTitle}</p>
                <p className="text-[10px] text-[#2d5a37] font-semibold mt-0.5">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
