import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const legalPagesData: Record<string, { title: string; body: string }> = {
	"privacy-policy": {
		title: "Privacy Policy",
		body: `
Last updated: November 2026

At Tomato Raccoon Supply Co. ("we", "our", or "us"), we are dedicated to protecting your personal data and privacy.

1. Information We Collect
When you make a purchase or enter checkout, we collect your shipping address, email, and order details. All payment card transactions are processed securely through 256-bit encrypted gateways (Stripe / PayPal). We never store your full card number on our servers.

2. Logistics and Delivery Sharing
We transmit your recipient address and contact information to trusted domestic and international couriers (USPS, DHL) solely for the purpose of shipping label generation and package delivery.

3. Questions & Data Rights
To access, modify, or delete your customer record, contact our data protection and customer support team at growtomatoes.service@outlook.com.
		`,
	},
	"terms-of-service": {
		title: "Terms of Service",
		body: `
Last updated: November 2026

By visiting our store and purchasing movement merchandise, you agree to our Terms of Service.

1. Independent Grassroots Goods
All apparel, lawn yard signs, and decals featuring the Tomato Raccoon and "Grow Tomatoes, Not Data Centers" are original independent designs celebrating Virginia agricultural heritage and clean groundwater conservation.

2. Order Acceptance & Pricing
Prices are stated in USD. We reserve the right to cancel or limit orders that appear placed by unauthorized wholesale resellers or fraudulent activities.
		`,
	},
	"shipping-policy": {
		title: "Shipping Policy",
		body: `
Last updated: November 2026

All apparel, lawn signs, and vinyl stickers are printed on-demand with premium materials and inspected before shipping.

1. Production & Dispatch Timeline
- Processing & Production Time: 2-4 business days.
- Standard Shipping: 3-5 business days across the United States via USPS Standard Ground.

2. Tracking Your Order
You will receive an automated tracking notification email with your USPS tracking number as soon as your package ships. You can also track your package anytime on our /track-order page.

3. Free Shipping
Orders exceeding $50.00 qualify for 100% Free US Shipping.
		`,
	},
	"refund-policy": {
		title: "Refund & Return Policy (30-Day Defend the Soil Guarantee)",
		body: `
Last updated: November 2026

We guarantee 100% satisfaction on all our grassroots protest apparel and goods.

1. 30-Day Money Back Guarantee
If your merchandise arrives defective, misprinted, or damaged during shipping, contact growtomatoes.service@outlook.com within 30 days of delivery.

2. Free Replacement or Full Refund
Send a quick photo of the defective item with your order number (e.g. TR-XXXXXX). We will ship a brand new replacement free of charge or issue an immediate 100% refund to your original payment method.
		`,
	},
};

export function LegalDoc({ slug }: { slug: string }) {
	const doc = legalPagesData[slug] || {
		title: "Store Policy",
		body: "Policy information is being updated.",
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<Link
				href="/"
				className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Store
			</Link>

			<div className="rounded-2xl border border-slate-800 bg-[#0a0d16] p-6 sm:p-12 shadow-xl">
				<div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
					<ShieldCheck className="w-4 h-4" />
					<span>Verified Legal Compliance</span>
				</div>
				<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-8 border-b border-slate-800 pb-4">
					{doc.title}
				</h1>
				<div className="prose prose-invert prose-slate max-w-none space-y-4 text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
					{doc.body}
				</div>
			</div>
		</div>
	);
}
