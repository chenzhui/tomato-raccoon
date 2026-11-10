import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Sprout, ShieldAlert, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          Our Story & Grassroots Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#231f1e] tracking-tight">
          Grow Tomatoes, Not Data Centers.
        </h1>
        <p className="text-base text-[#6b6460] max-w-2xl mx-auto leading-relaxed">
          How a quiet rural community along Virginia&apos;s Route 301 came together to defend irreplaceable prime topsoil, clean water aquifers, and family farming heritage.
        </p>
      </div>

      {/* Mascot & Mission Illustration */}
      <div className="relative aspect-video max-w-2xl mx-auto bg-white rounded-3xl border border-[#e5ded4] p-8 shadow-xs flex items-center justify-center">
        <Image
          src="/images/raccoon-tomato.svg"
          alt="Tomato Raccoon Mascot"
          fill
          className="object-contain p-6"
        />
      </div>

      {/* Manifesto Body */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5ded4] shadow-xs space-y-8 text-sm sm:text-base text-[#4a423f] leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[#231f1e]">
            1. Why Central Virginia?
          </h2>
          <p>
            Virginia is often referred to as the data center capital of the world. In recent years, explosive growth driven by artificial intelligence workloads has triggered a land grab that has expanded outward from Northern Virginia into Hanover, Louisa, Caroline, and Shenandoah agricultural regions.
          </p>
          <p>
            When multi-billion-dollar tech developers buy up hundreds of acres of family farm ground, the transformation is irreversible. Heavy bulldozers excavate centuries-old topsoil, compact the earth with thousands of tons of concrete footings, and construct monolithic windowless grey boxes surrounded by barbed wire and security fences.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[#231f1e] flex items-center gap-2">
            <Droplets className="w-6 h-6 text-[#2d5a37]" />
            <span>2. The Hidden Cost: Millions of Gallons of Pure Water</span>
          </h2>
          <p>
            Modern hyperscale data center clusters require enormous cooling infrastructure. A typical facility evaporates between 1 to 5 million gallons of groundwater every single day. For rural homeowners relying on private well water, aquifer depletion is not an abstract future worry — it is an immediate existential threat to their drinking water and cattle irrigation.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[#231f1e] flex items-center gap-2">
            <Sprout className="w-6 h-6 text-[#2d5a37]" />
            <span>3. Enter the Tomato Raccoon</span>
          </h2>
          <p>
            Our mascot, the spirited Tomato Raccoon, was born from a hand-carved linocut protest block printed in a rural garage workshop. Raccoons are clever, resilient, and fiercely protective of their home territory and heirloom garden plots.
          </p>
          <p>
            What started as a handful of hand-printed yard signs along Route 301 quickly spread to farmers markets, county supervisor hearings, and tractor convoys. Neighbors saw the signs, honked their truck horns, and joined the coalition.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[#231f1e] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#cf3c2a]" />
            <span>4. 100% Grassroots, Ethical Fulfillment</span>
          </h2>
          <p>
            We practice what we preach. Every Comfort Colors shirt, heavyweight hoodie, outdoor yard sign, and bumper decal is printed on-demand with water-based, non-toxic inks by American print providers.
          </p>
          <p>
            We use 100% plastic-free, recyclable paper packaging and dispatch via the United States Postal Service. Every dollar generated from our gear helps print lawn signs for local farmers and cover community meeting hall fees.
          </p>
        </div>

        <div className="pt-6 border-t border-[#f0ece5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#231f1e]">Join the movement today.</p>
            <p className="text-xs text-[#6b6460]">Display the sign, wear the shirt, make your voice heard.</p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2"
          >
            <span>Browse Movement Goods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
