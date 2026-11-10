import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#24201e] text-[#d6cebf] border-t border-[#3c3633] mt-24">
      {/* Grassroots Trust Bar */}
      <div className="border-b border-[#3c3633]/80 bg-[#1b1817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#cf3c2a]/15 text-[#cf3c2a] flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">USPS Ground Advantage</h4>
              <p className="text-xs text-[#a89f91] mt-0.5">Dispatched quickly from US print workshops</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#2d5a37]/25 text-[#4ade80] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Eco-Friendly Materials</h4>
              <p className="text-xs text-[#a89f91] mt-0.5">Water-based inks & plastic-free packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#cf3c2a]/15 text-[#cf3c2a] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30-Day Grassroots Guarantee</h4>
              <p className="text-xs text-[#a89f91] mt-0.5">Hassle-free replacement for print flaws or defects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/logo.svg" alt="Tomato Raccoon" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              Tomato Raccoon
            </span>
          </div>
          <p className="text-xs text-[#a89f91] leading-relaxed">
            Grow Tomatoes, Not Data Centers. Independent grassroots movement merchandise defending American agricultural soil, aquifers, and community open spaces.
          </p>
          <p className="text-[11px] text-[#786f63]">
            Hanover County & Central Virginia Grassroots Coalition
          </p>
        </div>

        {/* Collection Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Movement Gear</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                All Protest Goods
              </Link>
            </li>
            <li>
              <Link href="/category/apparel" className="hover:text-white transition-colors">
                Comfort Colors Vintage Apparel
              </Link>
            </li>
            <li>
              <Link href="/category/signs" className="hover:text-white transition-colors">
                Double-Sided Lawn Yard Signs
              </Link>
            </li>
            <li>
              <Link href="/category/stickers" className="hover:text-white transition-colors">
                Weatherproof Vinyl Stickers
              </Link>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Fulfillment & Help</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#cf3c2a]" />
                Track My USPS Package
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-white transition-colors flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#cf3c2a]" />
                File a Return / Replacement
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Why We Protest Data Centers
              </Link>
            </li>
            <li>
              <a href="mailto:growtomatoes.service@outlook.com" className="hover:text-white transition-colors">
                growtomatoes.service@outlook.com
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Policies */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Policies</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shipping-policy" className="hover:text-white transition-colors">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-white transition-colors">
                Refund & Replacement Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3c3633] py-6 text-center text-xs text-[#786f63]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Tomato Raccoon Supply Co. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Rooted in fertile Virginia soil <Heart className="w-3 h-3 text-[#cf3c2a] fill-current" /> Clean Water over Mega-Watts
          </p>
        </div>
      </div>
    </footer>
  );
}
