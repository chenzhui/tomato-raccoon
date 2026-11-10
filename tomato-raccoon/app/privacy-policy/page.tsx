import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          Data Protection
        </span>
        <h1 className="text-3xl font-black text-[#231f1e]">Privacy Policy</h1>
        <p className="text-xs text-[#6b6460]">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e5ded4] shadow-xs space-y-6 text-sm text-[#4a423f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">1. Information We Collect</h2>
          <p>
            When you purchase goods from Tomato Raccoon Supply Co. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we collect necessary delivery information including your name, shipping address, email address, and phone number to fulfill your USPS delivery and provide order notifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">2. Secure Payment Processing</h2>
          <p>
            Payment transactions are processed securely through certified PCI-DSS compliant payment gateways. We never store, process, or retain your raw credit card numbers or banking secrets on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">3. No Sale of Personal Data</h2>
          <p>
            We will never sell, rent, or trade your personal information to third-party data brokers, advertising networks, or corporate entities. Your data is used exclusively to print and deliver your movement gear.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#231f1e]">4. Contact & Inquiries</h2>
          <p>
            For privacy inquiries or data removal requests, please write to: <a href="mailto:growtomatoes.service@outlook.com" className="font-bold text-[#cf3c2a] underline">growtomatoes.service@outlook.com</a>.
          </p>
        </section>

        <div className="p-4 bg-[#f8f5ee] rounded-xl border border-[#e5ded4] flex items-center gap-3 text-xs text-[#5a524e]">
          <Lock className="w-5 h-5 text-[#2d5a37] flex-shrink-0" />
          <span>
            Your privacy is guarded with the same tenacity as our fertile farmland.
          </span>
        </div>
      </div>
    </div>
  );
}
