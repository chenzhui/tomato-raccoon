export function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Payment methods">
      {/* Visa */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-[#1a1f71] shadow-2xs">
        VISA
      </span>
      {/* Mastercard */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-[#eb001b] shadow-2xs">
        Mastercard
      </span>
      {/* Amex */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-[#006fcf] shadow-2xs">
        AMEX
      </span>
      {/* Apple Pay */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-black shadow-2xs">
         Pay
      </span>
      {/* Google Pay */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-[#5f6368] shadow-2xs">
        G Pay
      </span>
      {/* PayPal */}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-[#D9CDB8] text-[10px] font-bold text-[#003087] shadow-2xs">
        PayPal
      </span>
    </div>
  );
}
