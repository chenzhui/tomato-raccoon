import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const legalPagesData: Record<string, { title: string; body: string }> = {
	"privacy-policy": {
		title: "Privacy Policy",
		body: `
Last updated: November 2026

At AI-Chan Geek Merch, we are dedicated to protecting your personal data and privacy.

1. Information We Collect
When you make a purchase or enter checkout, we collect your shipping address, email, and order details. All payment card transactions are processed securely through 256-bit encrypted gateways (Stripe / PayPal). We never store your full card number on our servers.

2. Logistics and Delivery Sharing
We transmit your recipient address and contact information to trusted international couriers (USPS, YunExpress, DHL) solely for the purpose of customs clearance and package delivery.

3. Questions & Data Rights
To access, modify, or delete your customer record, contact our data protection team at support@aichan-merch.com.
		`,
	},
	"terms-of-service": {
		title: "Terms of Service",
		body: `
Last updated: November 2026

By visiting our store and purchasing merchandise, you agree to our Terms of Service.

1. Fan Parody and Transformative Merchandise
All character standees, dangos, and desk mats ("Whale-Chan", "Sonnet-Tan", "Omni-Chan", "Rebel-Tan", "TwinStar-Chan") are transformative artistic parodies. All trademarks, registered logos, and brand names belong to their respective corporate entities and are NOT affiliated with this fan store.

2. Order Acceptance & Pricing
Prices are stated in USD. We reserve the right to cancel or limit orders that appear placed by unauthorized wholesale resellers.
		`,
	},
	"shipping-policy": {
		title: "Shipping Policy",
		body: `
Last updated: November 2026

All collectible acrylic standees and desk mats are custom-crafted with diamond laser polished edges.

1. Crafting and Dispatch Timeline
- Processing & Crafting Time: 2-4 business days.
- Express Air Delivery: 7-12 business days to the United States and European Union.

2. Tracking Your Order
You will receive an automated tracking notification email with your USPS / YunExpress tracking number as soon as the flight departs.

3. Free Shipping
Orders containing the Full Desk Waifu Bundle or exceeding $40.00 qualify for 100% Free Priority Shipping.
		`,
	},
	"refund-policy": {
		title: "Refund & Return Policy (30-Day Guarantee)",
		body: `
Last updated: November 2026

We guarantee 100% satisfaction on all our developer desk merchandise.

1. 30-Day Money Back Guarantee
Every acrylic standee comes with double-sided scratch-resistant protective films. If your merchandise arrives cracked, scratched under the film, or defective, contact support@aichan-merch.com within 30 days of delivery.

2. Free Replacement or Full Refund
Send a quick photo of the defective item. We will ship a brand new replacement free of charge or issue an immediate 100% refund to your original payment method.
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
