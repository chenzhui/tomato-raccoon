export type FAQCategory = {
	id: string;
	title: string;
	questions: { question: string; answer: string }[];
};

export const faqCategories: FAQCategory[] = [
	{
		id: "care-guide",
		title: "Lawn Signs, Apparel & Care Guide",
		questions: [
			{
				question: "How do I install the \"Grow Tomatoes, Not Data Centers\" yard sign?",
				answer:
					"Each yard sign comes with a heavy-duty galvanized steel H-frame ground stake. Simply insert the top prongs of the H-stake into the vertical flutes at the bottom of your 4mm corrugated sign, then press the bottom prongs firmly into your lawn soil with your foot. Our weather-treated signs easily withstand heavy wind and rain.",
			},
			{
				question: "How should I wash my Comfort Colors 1717 vintage tee and protest hoodie?",
				answer:
					"Turn the garment inside out before washing to protect the screen-printed artwork. Machine wash in cold water with similar colors using mild eco-friendly detergent. Tumble dry on low heat or hang dry for longest lasting vibrancy. Avoid bleach and direct iron on the print.",
			},
			{
				question: "Are the bumper decals and kiss-cut stickers dishwasher safe and waterproof?",
				answer:
					"Yes! Our stickers are printed on thick 6-mil outdoor vinyl with UV-matte lamination. They are 100% waterproof, weather-resistant, and top-rack dishwasher safe on water bottles and tumblers.",
			},
		],
	},
	{
		id: "shipping",
		title: "Shipping & Order Tracking",
		questions: [
			{
				question: "How long does delivery take within the United States?",
				answer:
					"All items are printed on demand and dispatched within 2-4 business days. Standard shipping via USPS Ground takes 3-5 business days across the continental US. You will receive an automated tracking email as soon as your label is printed.",
			},
			{
				question: "Where can I track my package in real time?",
				answer:
					"You can track your package directly at our /track-order page using your Order Number (e.g. TR-123456) and email address, or look up your USPS tracking number at tools.usps.com.",
			},
			{
				question: "Do you offer free shipping?",
				answer:
					"Yes! All orders over $35.00 automatically qualify for 100% Free US Shipping with plastic-free, recyclable packaging.",
			},
		],
	},
	{
		id: "returns",
		title: "30-Day Defend the Soil Guarantee",
		questions: [
			{
				question: "What happens if my item arrives damaged or misprinted?",
				answer:
					"We offer a 100% Defend the Soil Guarantee. If any item arrives damaged or defective in transit, you do NOT need to mail it back. Simply visit our /returns portal or email growtomatoes.service@outlook.com with a quick photo of the defective item, and we will immediately send a brand-new replacement free of charge or issue a 100% refund.",
			},
			{
				question: "How long do I have to request a replacement or refund?",
				answer:
					"You have 30 days from the date tracking shows your package was delivered to submit a claim through our /returns portal or by emailing growtomatoes.service@outlook.com.",
			},
			{
				question: "Can I cancel or change my shipping address after ordering?",
				answer:
					"Address changes and cancellations are accepted within 12 hours of placing your order before printing begins. Please contact growtomatoes.service@outlook.com immediately with your order number.",
			},
		],
	},
	{
		id: "advocacy",
		title: "About the Movement & Studio",
		questions: [
			{
				question: "What is \"Grow Tomatoes, Not Data Centers\" all about?",
				answer:
					"It is an independent community-inspired movement born out of Hanover County, Virginia. We celebrate local agricultural heritage, open skies, and clean groundwater over massive industrial server campuses. All proceeds from merchandise help spread community advocacy.",
			},
			{
				question: "How can I contact customer support directly?",
				answer:
					"You can reach our team anytime via email at growtomatoes.service@outlook.com or through our /contact form. We respond to all inquiries within 24 business hours.",
			},
		],
	},
];
