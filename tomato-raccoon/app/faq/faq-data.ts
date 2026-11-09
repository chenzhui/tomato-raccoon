export type FAQCategory = {
	id: string;
	title: string;
	questions: { question: string; answer: string }[];
};

export const faqCategories: FAQCategory[] = [
	{
		id: "unboxing",
		title: "Unboxing & Care Guide",
		questions: [
			{
				question: "🔥 Why does my acrylic standee look cloudy, frosted, or scratched?",
				answer:
					"PLEASE PEEL THE PROTECTIVE FILM! Every acrylic standee is shipped with a tight micro-frosted plastic film on BOTH sides to prevent scratches during air transport. Gently peel the film from any corner with your fingernail to reveal the crystal-clear 4K diamond-cut acrylic!",
			},
			{
				question: "Can I clean my acrylic standees or desk mats with isopropyl alcohol?",
				answer:
					"DO NOT use alcohol or harsh solvents on acrylic standees! High-concentration alcohol can react with acrylic edges and cause stress crazing (micro-cracks). Simply wipe with a soft microfiber cloth slightly dampened with clean water. Desk mats can be gently hand-washed with mild soap.",
			},
			{
				question: "How do I assemble the standee base properly?",
				answer:
					"First peel the protective films from both the character cut-out and the circular base. Align the bottom tabs with the base slot and gently press downward evenly. Our tolerances are precision-calibrated (0.1mm) so the standee stays upright and stable on your desk without wobbling.",
			},
		],
	},
	{
		id: "shipping",
		title: "Shipping & Tracking",
		questions: [
			{
				question: "How long does delivery take to the US, Canada, and Europe?",
				answer:
					"Orders are crafted on demand within 2-4 business days. Express air transit via YunExpress takes 7-12 business days and is handed over to USPS (USA), Canada Post (Canada), or Royal Mail/DHL (Europe) for final residential delivery.",
			},
			{
				question: "Where can I track my package in real time?",
				answer:
					"You can track your package directly at our /track-order page using your Order Number (e.g. AI-678413). Once the flight lands, you can also paste your tracking number into tools.usps.com for live last-mile notifications.",
			},
			{
				question: "Will I have to pay customs duties or import taxes?",
				answer:
					"No. All small parcel consumer merchandise falls well below the US $800 de minimis duty-free threshold. EU orders are processed under standard pre-cleared customs regulations. There are zero surprise fees upon delivery.",
			},
		],
	},
	{
		id: "returns",
		title: "30-Day Guarantee & Returns",
		questions: [
			{
				question: "What happens if my standee arrives cracked or broken in transit?",
				answer:
					"We offer a 100% Zero-Risk Guarantee. If any item arrives damaged or broken, you do NOT need to mail it back to China or pay international return shipping. Simply visit our /returns portal, upload a photo of the cracked piece, and we will immediately dispatch a brand-new replacement free of charge or issue a 100% refund.",
			},
			{
				question: "How long do I have to request a replacement or refund?",
				answer:
					"You have 30 days from the date tracking shows your package was delivered to submit a claim through our /returns portal or by emailing support@aichan-merch.com.",
			},
			{
				question: "Can I cancel or change my shipping address after ordering?",
				answer:
					"Address changes and cancellations are accepted within 12 hours of placing your order before laser cutting begins. Please contact support@aichan-merch.com immediately with your order number.",
			},
		],
	},
	{
		id: "brand",
		title: "Merch & Compliance",
		questions: [
			{
				question: "Why are the characters called Whale-Chan, Sonnet-Tan, and Omni-Chan?",
				answer:
					"Our merchandise is 100% original, transformative fan parody art inspired by AI culture and developer memes. To strictly comply with international trademark laws and payment processor policies, our designs contain zero corporate logos, trademarked names, or proprietary assets.",
			},
			{
				question: "What is included in the Ultimate Desk Waifu Bundle ($59.99)?",
				answer:
					"The bundle includes all 5 core 15cm dual-sided acrylic standees (Whale-Chan, Sonnet-Tan, Omni-Chan, Rebel-Tan, TwinStar-Chan) + a Limited Geek Holographic Sticker Pack + Free Worldwide Priority Express Shipping (Saving 30% compared to buying individually).",
			},
		],
	},
];
