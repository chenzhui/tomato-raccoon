export interface ProductReview {
	id: string;
	authorName: string;
	authorTitle: string;
	location: string;
	rating: number;
	comment: string;
	verifiedPurchase: boolean;
	date: string;
}

export const MOVEMENT_REVIEWS: ProductReview[] = [
	{
		id: "rev-1",
		authorName: "Sarah M.",
		authorTitle: "Hanover Resident & Gardener",
		location: "Hanover County, VA",
		rating: 5,
		comment:
			"Put this yard sign out along Route 301 and had three neighbors stop their trucks to ask where I got it within 24 hours. The print is bright, thick, and survived heavy Virginia thunderstorms. Defend our soil!",
		verifiedPurchase: true,
		date: "3 days ago",
	},
	{
		id: "rev-2",
		authorName: "Miller K.",
		authorTitle: "Farmers Market Regular",
		location: "Richmond, VA",
		rating: 5,
		comment:
			"Carried 30 pounds of heirloom tomatoes, sweet corn, and sourdough in this organic canvas tote last Saturday. The webbed handles didn't stretch at all. Plus, three different vendors complimented the raccoon!",
		verifiedPurchase: true,
		date: "1 week ago",
	},
	{
		id: "rev-3",
		authorName: "David & Clara B.",
		authorTitle: "Family Farm Advocates",
		location: "Loudoun County, VA",
		rating: 5,
		comment:
			"Our county is getting paved over by data centers at an alarming speed. This little plush raccoon holding his tomato has become our unofficial household mascot. Incredibly soft and well-made.",
		verifiedPurchase: true,
		date: "2 weeks ago",
	},
	{
		id: "rev-4",
		authorName: "Heather T.",
		authorTitle: "Homesteader",
		location: "Shenandoah Valley, VA",
		rating: 5,
		comment:
			"Slapped the bumper sticker on my tailgate and the Hydroflask sticker on my water bottle. Hand-washed through dozens of cycles, not a single peeling edge. Water over watts forever.",
		verifiedPurchase: true,
		date: "3 weeks ago",
	},
];

export function getMockProducts() {
	return [
		// 1. 农场守护者毛绒浣熊 (The Farm Defender Plushie)
		{
			id: "prod-raccoon-plush",
			slug: "the-farm-defender-raccoon-plush",
			name: "The Farm Defender Raccoon Plushie (with Heirloom Tomato)",
			description:
				"Meet the official defender of local farmland. Hugging a plump, bright red heirloom tomato with both paws, this 12-inch ultra-soft plushie stands for clean groundwater, open soil, and local harvests over massive server campuses. Features a vintage straw hat, embroidered Hanover leaf paw tag, and baby-safe crystal velvet fur.",
			tagline: "12\" Ultra-Soft Squeezable Grassroots Mascot",
			images: ["/images/products/raccoon-plush.svg", "/images/raccoon-tomato.svg"],
			category: "Plushies",
			variants: [
				{
					id: "var-plush-defender",
					name: "12\" Huggable Mascot Plush",
					price: "3899",
					stock: 35,
					images: ["/images/products/raccoon-plush.svg"],
					combinations: [],
				},
			],
		},

		// 2. 12盎司重磅有机棉帆布袋 (Heavy-Duty Organic Cotton Tote)
		{
			id: "prod-canvas-tote",
			slug: "heavy-duty-organic-market-tote",
			name: "Heavy-Duty 12oz Organic Cotton Canvas Market Tote",
			description:
				"The ultimate farmers market and grocery staple. Crafted from 100% GOTS-certified organic unbleached natural duck canvas. Features double-reinforced spruce green webbing handles designed to carry 40+ lbs of fresh tomatoes, vegetables, and sourdough bread without strain. Screen-printed with water-based non-toxic inks in Virginia.",
			tagline: "Farmers Market Essential • 100% Organic Cotton",
			images: ["/images/products/organic-canvas-tote.svg", "/images/raccoon-tomato.svg"],
			category: "Totes",
			variants: [
				{
					id: "var-tote-natural",
					name: "Spruce Green Handles / Natural Canvas",
					price: "2499",
					stock: 50,
					images: ["/images/products/organic-canvas-tote.svg"],
					combinations: [],
				},
			],
		},

		// 3. 防水黑胶车贴与水壶贴纸 (Weatherproof Vinyl Stickers - 3-Pack)
		{
			id: "prod-bumper-stickers",
			slug: "weatherproof-vinyl-bumper-sticker-pack",
			name: "Weatherproof Outdoor Vinyl Bumper & Flask Stickers (3-Pack)",
			description:
				"Engineered to brave heavy highway rain, blazing summer sun, and dishwasher cycles. Die-cut on thick 6-mil outdoor vinyl with UV-matte laminate coating. Features the Official Hanover Tomato Raccoon Badge, Oval Bumper Decal, and Water Over Watts emblem. Perfect for trucks, Subarus, Yeti tumblers, and laptops.",
			tagline: "UV-Resistant Die-Cut Vinyl • Pack of 3",
			images: ["/images/products/vinyl-stickers.svg", "/images/raccoon-tomato.svg"],
			category: "Stickers",
			variants: [
				{
					id: "var-stickers-3pk",
					name: "3-Pack Die-Cut Weatherproof Stickers",
					price: "1299",
					stock: 120,
					images: ["/images/products/vinyl-stickers.svg"],
					combinations: [],
				},
			],
		},

		// 4. 经典庭院草坪抗议插牌 (Official Lawn Yard Sign)
		{
			id: "prod-yard-sign",
			slug: "official-lawn-yard-sign-with-metal-stake",
			name: "Official \"Grow Tomatoes, Not Data Centers\" Lawn Yard Sign",
			description:
				"The sign that sparked the grassroots revolution across Hanover County, Virginia. 24\"x18\" double-sided fade-resistant screen print on durable 4mm fluted corrugated plastic. Includes a heavy-duty galvanized steel H-frame ground stake. Stand up for local groundwater and agricultural land right from your front lawn.",
			tagline: "Double-Sided 24\"x18\" Coroplast + Metal H-Stake",
			images: ["/images/products/yard-sign.svg", "/images/raccoon-tomato.svg"],
			category: "Signs",
			variants: [
				{
					id: "var-yard-sign-1",
					name: "1 Sign + Metal H-Stake",
					price: "2299",
					stock: 45,
					images: ["/images/products/yard-sign.svg"],
					combinations: [],
				},
			],
		},

		// 5. Comfort Colors 美式水洗复古 T 恤 (Comfort Colors Heritage Tee)
		{
			id: "prod-vintage-tee",
			slug: "comfort-colors-vintage-garment-dyed-tee",
			name: "Comfort Colors® 1717 Vintage Wash Heritage Tee",
			description:
				"The gold standard in American vintage heavyweight t-shirts. 100% ring-spun cotton (6.1 oz) garment-dyed in rich Spruce Forest Green for that authentically broken-in, relaxed feel from day one. Soft-hand screen-printed woodcut illustration that softens with every wash.",
			tagline: "100% Cotton • Garment-Dyed Spruce Green",
			images: ["/images/products/comfort-colors-preview.png", "/images/products/vintage-tee.svg", "/images/grow-tomatoes-transparent.png"],
			category: "Apparel",
			variants: [
				{
					id: "var-tee-m",
					name: "Medium / Spruce Forest Green",
					price: "3299",
					stock: 25,
					images: ["/images/products/comfort-colors-preview.png"],
					combinations: [],
				},
				{
					id: "var-tee-l",
					name: "Large / Spruce Forest Green",
					price: "3299",
					stock: 30,
					images: ["/images/products/comfort-colors-preview.png"],
					combinations: [],
				},
				{
					id: "var-tee-xl",
					name: "XL / Spruce Forest Green",
					price: "3299",
					stock: 28,
					images: ["/images/products/comfort-colors-preview.png"],
					combinations: [],
				},
				{
					id: "var-tee-2xl",
					name: "2XL / Spruce Forest Green",
					price: "3499",
					stock: 15,
					images: ["/images/products/comfort-colors-preview.png"],
					combinations: [],
				},
			],
		},

		// 7. 经典抗议加厚连帽卫衣 (Gildan 18500 Protest Hoodie)
		{
			id: "prod-hoodie",
			slug: "gildan-heavy-blend-protest-hoodie",
			name: "Gildan 18500 Official \"Grow Tomatoes, Not Data Centers\" Heavyweight Hoodie",
			description:
				"The official heavy-duty protest hoodie for chilly morning rallies, town hall hearings, and open-field standoffs. Crafted from 50% US cotton and 50% polyester (8.0 oz/yd²) with a double-lined hood, color-matched drawcord, and deep front pouch pocket. High-density screen-printed with the Tomato Raccoon defender linocut that never cracks or peels.",
			tagline: "8.0 oz Heavyweight Fleece • Kangaroo Pouch • Double-Lined Hood",
			images: ["/images/grow-tomatoes-transparent.png", "/images/products/comfort-colors-preview.png"],
			category: "Apparel",
			variants: [
				{
					id: "var-hoodie-m",
					name: "Medium / Forest Green",
					price: "4899",
					stock: 20,
					images: ["/images/grow-tomatoes-transparent.png"],
					combinations: [],
				},
				{
					id: "var-hoodie-l",
					name: "Large / Forest Green",
					price: "4899",
					stock: 25,
					images: ["/images/grow-tomatoes-transparent.png"],
					combinations: [],
				},
				{
					id: "var-hoodie-xl",
					name: "XL / Forest Green",
					price: "4899",
					stock: 20,
					images: ["/images/grow-tomatoes-transparent.png"],
					combinations: [],
				},
				{
					id: "var-hoodie-2xl",
					name: "2XL / Forest Green",
					price: "5299",
					stock: 12,
					images: ["/images/grow-tomatoes-transparent.png"],
					combinations: [],
				},
			],
		},

		// 6. 复古水洗做旧棒球帽 (Unstructured Dad Hat)
		{
			id: "prod-dad-hat",
			slug: "unstructured-vintage-washed-dad-hat",
			name: "Unstructured Washed Cotton Dad Hat (Embroidered)",
			description:
				"Classic low-profile 6-panel cap crafted from 100% bio-washed cotton chino twill. Direct high-density embroidery of the Tomato Raccoon emblem. Pre-curved visor, self-fabric strap with antique brass tri-glide buckle closure. Breathable, durable, and comfortable for all-day farm and market wear.",
			tagline: "Low-Profile 6-Panel • Antique Brass Buckle",
			images: ["/images/products/dad-hat.svg", "/images/raccoon-tomato.svg"],
			category: "Apparel",
			variants: [
				{
					id: "var-hat-spruce",
					name: "One Size / Washed Forest Green",
					price: "2699",
					stock: 35,
					images: ["/images/products/dad-hat.svg"],
					combinations: [],
				},
			],
		},
	].map((item) => ({
		...item,
		subscriptionPlanProducts: [],
		volumePricingTiers: [],
		summary: item.tagline,
		content: null,
		seo: {
			title: `${item.name} | Tomato Raccoon Supply Co.`,
			description: item.description,
		},
		variants: item.variants.map((v) => ({
			...v,
			sku: v.id,
			combinations: [],
			omnibusPrice: null,
		})),
	}));
}
