"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Truck, Search, CheckCircle2, Clock, ExternalLink, Package, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (num: string, mail?: string) => {
    if (!num && !mail) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: num, email: mail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Order not found. Please verify your order number.");
      }

      setOrder(data.order || data.data);
    } catch (err: any) {
      setError(err.message || "Failed to find order tracking.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchTracking(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, email);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          USPS Ground Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231f1e]">
          Track Your Movement Order
        </h1>
        <p className="text-sm text-[#6b6460] max-w-lg mx-auto">
          Enter your official order number (e.g. TR-123456) or customer email address to check print status and live USPS tracking.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-3xl border border-[#e5ded4] shadow-xs space-y-4 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
              Order Number:
            </label>
            <input
              type="text"
              placeholder="e.g. TR-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#231f1e] uppercase tracking-wider mb-1">
              Or Customer Email:
            </label>
            <input
              type="email"
              placeholder="supporter@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5ded4] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cf3c2a] text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!orderNumber && !email)}
          className="w-full py-3.5 px-6 bg-[#cf3c2a] hover:bg-[#ad2c1c] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying Workshop & USPS Data...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track Package</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}
      </form>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#e5ded4] shadow-xs overflow-hidden divide-y divide-[#f0ece5] animate-in fade-in-50 duration-300">
          {/* Status Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#faf8f5] to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
                  Order Status
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a37]" />
                <span className="text-xs font-bold uppercase text-[#2d5a37]">
                  {order.status === "processing" ? "In Production" : "Dispatched via USPS"}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#231f1e] mt-1">{order.orderNumber}</h2>
              <p className="text-xs text-[#6b6460] mt-0.5">
                Recipient: <span className="font-semibold text-[#231f1e]">{order.customerName}</span> • Placed {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#6b6460] block">Carrier Tracking:</span>
              <a
                href={order.carrierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#cf3c2a] hover:underline mt-0.5"
              >
                <span>{order.trackingNumber}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-[#2d5a37] font-semibold block mt-0.5">
                {order.carrier}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-sm text-[#231f1e] uppercase tracking-wider">
              Fulfillment Journey
            </h3>
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#e5ded4]">
              {order.timeline.map((step: any, idx: number) => {
                const isDone = step.completed;
                const isCurrent = step.current;

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                        isDone
                          ? "bg-[#2d5a37] text-white"
                          : isCurrent
                          ? "bg-[#cf3c2a] text-white ring-4 ring-[#cf3c2a]/20"
                          : "bg-[#faf8f5] border-2 border-[#e5ded4] text-[#9b948f]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`font-bold text-sm ${isCurrent ? "text-[#cf3c2a]" : "text-[#231f1e]"}`}>
                          {step.title}
                        </p>
                        <span className="text-[11px] font-semibold text-[#6b6460]">{step.time}</span>
                      </div>
                      <p className="text-xs text-[#6b6460] mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this shipment */}
          <div className="p-6 sm:p-8 space-y-4 bg-[#fdfbf7]">
            <h3 className="font-bold text-sm text-[#231f1e] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#cf3c2a]" />
              <span>Items in this Shipment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-white rounded-2xl border border-[#e5ded4] flex items-center gap-3">
                  <div className="relative w-14 h-14 bg-[#faf8f5] rounded-xl overflow-hidden flex-shrink-0 border border-[#e5ded4]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#231f1e] truncate">{item.name}</p>
                    {item.variantName && (
                      <p className="text-[11px] text-[#6b6460]">{item.variantName}</p>
                    )}
                    <p className="text-xs text-[#2d5a37] font-semibold mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#cf3c2a] mx-auto" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
