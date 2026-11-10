"use client";

import { useState } from "react";
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ReturnsPage() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    reason: "print_flaw",
    resolution: "replacement",
    details: "",
    evidencePhotoUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/returns/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit return request");
      }

      setTicketResult(data.ticketId);
      toast.success("Return ticket submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          30-Day Grassroots Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231f1e]">
          File a Replacement or Return
        </h1>
        <p className="text-sm text-[#6b6460] max-w-lg mx-auto">
          We stand 100% behind our print quality. If your shirt, hoodie, yard sign, or sticker has any defect, we will reprint and ship a replacement at zero charge.
        </p>
      </div>

      {ticketResult ? (
        <div className="bg-white p-8 rounded-3xl border border-[#e5ded4] shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#2d5a37]/10 text-[#2d5a37] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2d5a37] uppercase tracking-wider">
              Ticket Logged Successfully
            </span>
            <h2 className="text-2xl font-black text-[#231f1e] mt-1">Ticket #{ticketResult}</h2>
            <p className="text-xs text-[#6b6460] max-w-md mx-auto mt-2">
              Our grassroots support team has received your ticket. A confirmation email with next steps will be sent to <span className="font-semibold text-[#231f1e]">{formData.email}</span> within 24 hours.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TR-123456"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
                Customer Email *
              </label>
              <input
                type="email"
                required
                placeholder="supporter@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
                Reason for Ticket *
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
              >
                <option value="print_flaw">Print Flaw / Misalignment</option>
                <option value="damaged_in_transit">Damaged in Transit by Carrier</option>
                <option value="wrong_size_or_item">Incorrect Size / Item Received</option>
                <option value="defective_garment">Fabric / Sewing Defect</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
                Preferred Resolution *
              </label>
              <select
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
              >
                <option value="replacement">Free Fast Replacement (Recommended)</option>
                <option value="full_refund">Full Refund to Original Payment Method</option>
                <option value="store_credit">Store Credit + 10% Movement Bonus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
              Details & Description
            </label>
            <textarea
              rows={4}
              placeholder="Please describe the issue with your merchandise so our workshop can rectify it..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
              Photo Evidence Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://... (Image link of the flawed print or damaged parcel)"
              value={formData.evidencePhotoUrl}
              onChange={(e) => setFormData({ ...formData, evidencePhotoUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm"
            />
          </div>

          <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
            <ShieldCheck className="w-5 h-5 text-[#2d5a37] flex-shrink-0" />
            <span>
              Zero return shipping fee: For damaged goods or print errors, you do not need to mail the defective item back. We will dispatch the reprint directly.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-[#cf3c2a] hover:bg-[#ad2c1c] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Ticket to Support...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Submit Ticket for Review</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
