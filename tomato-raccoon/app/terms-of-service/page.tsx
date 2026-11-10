import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
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
          Legal Agreement
        </span>
        <h1 className="text-3xl font-black text-[#231f1e]">Terms of Service</h1>
        <p className="text-xs text-[#6b6460]">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6 text-sm text-[#4a423f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">1. Acceptance of Terms</h2>
          <p>
            By visiting our site or purchasing merchandise from Tomato Raccoon Supply Co., you engage in our Service and agree to be bound by the following terms and conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">2. Grassroots Advocacy & Intellectual Property</h2>
          <p>
            The &ldquo;Grow Tomatoes, Not Data Centers&rdquo; slogans, Tomato Raccoon linocut mascot illustrations, and artwork featured on this store are the proprietary creative expressions of our community grassroots coalition.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">3. Product Descriptions & Pricing</h2>
          <p>
            We strive to display our apparel, lawn signs, and stickers as accurately as possible. Prices are quoted in USD and are subject to adjustment without prior notice based on raw cotton and coroplast material costs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">4. Governing Law</h2>
          <p>
            These terms and any separate agreements shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia, United States.
          </p>
        </section>

        <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
          <FileText className="w-5 h-5 text-[#cf3c2a] flex-shrink-0" />
          <span>
            Contact for legal questions: <a href="mailto:growtomatoes.service@outlook.com" className="font-bold text-[#cf3c2a] underline">growtomatoes.service@outlook.com</a>.
          </span>
        </div>
      </div>
    </div>
  );
}
