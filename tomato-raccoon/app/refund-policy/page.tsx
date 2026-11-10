import Link from "next/link";
import { RotateCcw, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
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
          Consumer Protection
        </span>
        <h1 className="text-3xl font-black text-[#231f1e]">Refund & Replacement Policy</h1>
        <p className="text-xs text-[#6b6460]">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6 text-sm text-[#4a423f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">1. 30-Day Grassroots Guarantee</h2>
          <p>
            We are committed to delivering top-tier print craftsmanship. If your apparel, lawn sign, or sticker arrives with any manufacturing flaw, misprint, discoloration, or garment seam issue within 30 days of delivery, we will issue an immediate free replacement reprint or full refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">2. Damaged or Lost Shipments</h2>
          <p>
            If your package is damaged during USPS transit or fails to arrive within 10 business days of dispatch, please file a ticket at our <Link href="/returns" className="text-[#cf3c2a] underline font-semibold">Returns Center</Link>. We will expedite a replacement batch at zero cost to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">3. No Need to Return Defective Items</h2>
          <p>
            To minimize carbon emissions and unnecessary shipping waste, you do not need to ship defective prints back to us. Simply provide a photo of the defect in your online ticket.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">4. Refund Processing Time</h2>
          <p>
            Approved refunds are credited back to the original method of payment (card / bank) within 3-5 business days.
          </p>
        </section>

        <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
          <ShieldCheck className="w-5 h-5 text-[#2d5a37] flex-shrink-0" />
          <span>
            Need help filing a return? Visit our <Link href="/returns" className="text-[#cf3c2a] font-bold underline">Online Return Portal</Link> or email <a href="mailto:growtomatoes.service@outlook.com" className="font-bold underline">growtomatoes.service@outlook.com</a>.
          </span>
        </div>
      </div>
    </div>
  );
}
