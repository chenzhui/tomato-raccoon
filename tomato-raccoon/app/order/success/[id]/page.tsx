import Link from "next/link";
import { CheckCircle2, Truck, ArrowRight, ShieldCheck, Home } from "lucide-react";

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-[#2d5a37]/10 text-[#2d5a37] flex items-center justify-center mx-auto ring-8 ring-[#2d5a37]/5">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          Order Confirmed & Sent to Workshop
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231f1e]">
          Thank You for Supporting the Soil!
        </h1>
        <p className="text-sm text-[#6b6460] max-w-lg mx-auto">
          Your order has been registered and transmitted to our American print facility. A USPS tracking number will be assigned shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5ded4] shadow-xs text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0ece5] gap-4">
          <div>
            <p className="text-xs text-[#6b6460]">Official Movement Order Number</p>
            <p className="text-xl font-black text-[#231f1e] tracking-tight">{id}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2d5a37]/10 text-[#2d5a37] text-xs font-bold self-start sm:self-auto">
            <Truck className="w-4 h-4" />
            <span>Fulfilling via USPS Ground</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#231f1e]">
            What Happens Next?
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2d5a37] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-[#231f1e]">Direct-to-Garment / Screen Print Production</p>
                <p className="text-[#6b6460]">Your items are printed on demand using eco-friendly water-based inks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#faf8f5] border border-[#e5ded4] text-[#4a423f] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-[#231f1e]">USPS Pickup & Tracking Label Generation</p>
                <p className="text-[#6b6460]">A USPS Ground Advantage tracking number is issued and active within 48-72 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#faf8f5] border border-[#e5ded4] text-[#4a423f] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-[#231f1e]">Doorstep Delivery in Recycled Paper</p>
                <p className="text-[#6b6460]">Arrives in 3-5 business days across the continental US.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-4 bg-[#f8f5ee] rounded-2xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
          <ShieldCheck className="w-5 h-5 text-[#2d5a37] flex-shrink-0" />
          <span>
            30-day print guarantee: If your print has any defect or sizing issue, file a one-click replacement under our Return Center.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href={`/track-order?orderNumber=${id}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Progress</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#f5f0ea] text-[#231f1e] font-bold rounded-xl transition-all border border-[#e5ded4] flex items-center justify-center gap-2 text-xs tracking-wider"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
