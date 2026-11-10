import Link from "next/link";
import { Truck, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b6460] hover:text-[#cf3c2a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Store</span>
      </Link>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          Fulfillment Guidelines
        </span>
        <h1 className="text-3xl font-black text-[#231f1e]">Shipping & Delivery Policy</h1>
        <p className="text-xs text-[#6b6460]">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6 text-sm text-[#4a423f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">1. Shipping Rates & Free Shipping</h2>
          <p>
            We offer <strong className="text-[#2d5a37]">100% FREE US Shipping</strong> on all domestic orders of $50 or more. For orders under $50, standard shipping is charged at a flat rate of <strong>$4.99</strong> across the continental United States.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">2. Fulfillment & Production Times</h2>
          <p>
            All Tomato Raccoon merchandise is custom-printed on-demand to prevent excess textile waste and support local manufacturing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#5a524e]">
            <li><strong>Apparel (T-Shirts & Hoodies):</strong> 2-4 business days production time.</li>
            <li><strong>Lawn Yard Signs:</strong> 2-3 business days production time.</li>
            <li><strong>Vinyl Bumper Stickers & Decals:</strong> 1-2 business days production time.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">3. Carrier & Tracking Information</h2>
          <p>
            Packages are shipped primarily through the <strong>United States Postal Service (USPS Ground Advantage / Priority Mail)</strong>. Once dispatched, tracking information is automatically linked to your order and viewable on our <Link href="/track-order" className="text-[#cf3c2a] underline font-semibold">Track Order Page</Link>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">4. Plastic-Free Sustainable Packaging</h2>
          <p>
            In keeping with our environmental mission, our products are delivered in 100% recyclable, plastic-free paper mailers and corrugated cardboard boxes.
          </p>
        </section>

        <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
          <Truck className="w-5 h-5 text-[#2d5a37] flex-shrink-0" />
          <span>
            Questions about your package? Contact our fulfillment desk at <a href="mailto:growtomatoes.service@outlook.com" className="font-bold text-[#cf3c2a] underline">growtomatoes.service@outlook.com</a>.
          </span>
        </div>
      </div>
    </div>
  );
}
