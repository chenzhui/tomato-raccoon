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
			"Wore the Comfort Colors tee to the farmer's market and everyone was pointing and cheering! High quality fabric, soft feel, and stands up for clean water over data centers.",
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
			"Our county is getting paved over by data centers at an alarming speed. This heavyweight hoodie and the lawn sign have become our town hall uniform. Incredibly warm and meaningful.",
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
			"Slapped the bumper sticker on my tailgate and the kiss-cut sticker on my Hydroflask. Hand-washed through dozens of cycles, not a single peeling edge. Water over watts forever.",
		verifiedPurchase: true,
		date: "3 weeks ago",
	},
];

export function getMockProducts() {
	return [
		// 1. Comfort Colors 美式水洗复古 T 恤 (Comfort Colors Heritage Tee)
		// Printify Product ID: 6af1e37a0d44c7beaa022065
		{
			id: "6af1e37a0d44c7beaa022065",
			legacyId: "prod-vintage-tee",
			printifyProductId: "6af1e37a0d44c7beaa022065",
			slug: "comfort-colors-vintage-garment-dyed-tee",
			name: "Comfort Colors® 1717 Unisex Garment-Dyed T-Shirt",
			description:
				"The gold standard in American vintage heavyweight t-shirts. 100% ring-spun cotton (6.1 oz) garment-dyed in clean crisp white featuring the official 'Grow Tomatoes, Not Data Centers' linocut artwork. Pre-shrunk, soft-washed, with double-needle stitched neckline and hem for enduring comfort at rallies, town halls, and farm markets.",
			tagline: "100% Ring-Spun Cotton • Vintage Wash • Relaxed Fit",
			images: [
				"https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front",
				"https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98446/unisex-garment-dyed-t-shirt.jpg?camera_label=back",
				"https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/100629/unisex-garment-dyed-t-shirt.jpg?camera_label=folded",
				"https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/110132/unisex-garment-dyed-t-shirt.jpg?camera_label=size-chart",
			],
			category: "Apparel",
			variants: [
				{
					id: "73199",
					printifyVariantId: 73199,
					name: "Small / White",
					price: "3200",
					stock: 50,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-s",
								value: "S",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "73203",
					printifyVariantId: 73203,
					name: "Medium / White",
					price: "3200",
					stock: 50,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-m",
								value: "M",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "73207",
					printifyVariantId: 73207,
					name: "Large / White",
					price: "3200",
					stock: 50,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-l",
								value: "L",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "73211",
					printifyVariantId: 73211,
					name: "XL / White",
					price: "3200",
					stock: 50,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-xl",
								value: "XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "73215",
					printifyVariantId: 73215,
					name: "2XL / White",
					price: "3400",
					stock: 30,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-2xl",
								value: "2XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "79169",
					printifyVariantId: 79169,
					name: "3XL / White",
					price: "3600",
					stock: 20,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-3xl",
								value: "3XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "101476",
					printifyVariantId: 101476,
					name: "4XL / White",
					price: "3800",
					stock: 15,
					images: ["https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-4xl",
								value: "4XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
			],
		},

		// 2. 经典抗议加厚连帽卫衣 (Gildan 18500 Protest Hoodie)
		// Printify Product ID: 6af1e5c85225a301c209b517
		{
			id: "6af1e5c85225a301c209b517",
			legacyId: "prod-hoodie",
			printifyProductId: "6af1e5c85225a301c209b517",
			slug: "gildan-heavy-blend-protest-hoodie",
			name: "Gildan 18500 Official \"Grow Tomatoes, Not Data Centers\" Heavyweight Hoodie",
			description:
				"The official heavyweight protest hoodie for crisp Virginia mornings and outdoor rallies. Crafted from a durable 50/50 polyester and cotton blend (8.0 oz/yd²) that delivers plush warmth and zero scratchiness. Features a double-lined drawstring hood, kangaroo front pouch pocket, and high-definition screen printing of the Tomato Raccoon defender emblem.",
			tagline: "8.0 oz Heavyweight Fleece • Kangaroo Pouch • Double-Lined Hood",
			images: [
				"https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
				"https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98425/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=back",
				"https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98432/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=folded",
				"https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/110151/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=size-chart",
			],
			category: "Apparel",
			variants: [
				{
					id: "32910",
					printifyVariantId: 32910,
					name: "Small / White",
					price: "4800",
					stock: 40,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-s",
								value: "S",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32911",
					printifyVariantId: 32911,
					name: "Medium / White",
					price: "4800",
					stock: 40,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-m",
								value: "M",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32912",
					printifyVariantId: 32912,
					name: "Large / White",
					price: "4800",
					stock: 40,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-l",
								value: "L",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32913",
					printifyVariantId: 32913,
					name: "XL / White",
					price: "4800",
					stock: 40,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-xl",
								value: "XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32914",
					printifyVariantId: 32914,
					name: "2XL / White",
					price: "5200",
					stock: 25,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-2xl",
								value: "2XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32915",
					printifyVariantId: 32915,
					name: "3XL / White",
					price: "5400",
					stock: 20,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-3xl",
								value: "3XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32916",
					printifyVariantId: 32916,
					name: "4XL / White",
					price: "5600",
					stock: 15,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-4xl",
								value: "4XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
				{
					id: "32917",
					printifyVariantId: 32917,
					name: "5XL / White",
					price: "5800",
					stock: 10,
					images: ["https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "size-hoodie-5xl",
								value: "5XL",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
			],
		},

		// 3. 经典庭院草坪抗议插牌 (Official Lawn Yard Sign)
		// Printify Product ID: 6af1eb2dd339bef3b00c5a47
		{
			id: "6af1eb2dd339bef3b00c5a47",
			legacyId: "prod-yard-sign",
			printifyProductId: "6af1eb2dd339bef3b00c5a47",
			slug: "official-lawn-yard-sign-with-metal-stake",
			name: "Official \"Grow Tomatoes, Not Data Centers\" Lawn Yard Sign",
			description:
				"The iconic yard sign that sparked community conversations across Hanover County, Virginia. Double-sided high-contrast print on durable 4mm fluted corrugated plastic. Includes heavy-duty galvanized metal H-stake for easy front yard installation. UV-resistant inks stand strong through heavy thunderstorms, road dust, and blazing summer sun.",
			tagline: "Double-Sided 18\"x12\" Coroplast • Weatherproof H-Stake",
			images: [
				"https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/64793/plastic-yard-sign.jpg?camera_label=front",
				"https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69652/plastic-yard-sign.jpg?camera_label=front-with-stand",
				"https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69658/plastic-yard-sign.jpg?camera_label=full-size",
				"https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69667/plastic-yard-sign.jpg?camera_label=close-up",
			],
			category: "Signs",
			variants: [
				{
					id: "92131",
					printifyVariantId: 92131,
					name: "18″ x 12″ (Horizontal) + Stake",
					price: "2800",
					stock: 75,
					images: ["https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/64793/plastic-yard-sign.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "dim-sign-18x12",
								value: "18″ x 12″",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
			],
		},

		// 4. 防水黑胶车贴与水壶贴纸 (Weatherproof Vinyl Stickers)
		// Printify Product ID: 6af1eb4dab0419501e05b289
		{
			id: "6af1eb4dab0419501e05b289",
			legacyId: "prod-bumper-stickers",
			printifyProductId: "6af1eb4dab0419501e05b289",
			slug: "weatherproof-vinyl-bumper-sticker-pack",
			name: "Weatherproof Outdoor Vinyl Bumper Stickers (11\" × 3\")",
			description:
				"Engineered to brave heavy highway rain, blazing summer sun, and automatic car washes. Thick outdoor-grade vinyl with premium UV-resistant laminate coating. Features bold 'Grow Tomatoes, Not Data Centers' lettering and the Tomato Raccoon emblem. Perfect for car bumpers, pickup tailgates, RVs, and trailer panels.",
			tagline: "Heavy-Duty UV-Resistant Vinyl • 11\" x 3\" Bumper Decal",
			images: [
				"https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12828/bumper-stickers.jpg?camera_label=front",
				"https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12819/bumper-stickers.jpg?camera_label=context",
				"https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12808/bumper-stickers.jpg?camera_label=context-2",
			],
			category: "Stickers",
			variants: [
				{
					id: "71930",
					printifyVariantId: 71930,
					name: "11\" × 3\" / Rectangle / White",
					price: "1200",
					stock: 150,
					images: ["https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12828/bumper-stickers.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "dim-sticker-11x3",
								value: "11″ x 3″",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
				},
			],
		},

		// 5. 模切高光水壶防水贴纸 (Tomato Defender Kiss-Cut Die-Cut Vinyl Stickers)
		// Printify Product ID: 6af1e70011c6bff63904cffc
		{
			id: "6af1e70011c6bff63904cffc",
			legacyId: "prod-kiss-cut-sticker",
			printifyProductId: "6af1e70011c6bff63904cffc",
			slug: "kiss-cut-sticker-tomato-defender",
			name: "Tomato Defender Die-Cut High-Gloss Vinyl Sticker (3\" × 3\")",
			description:
				"Precision kiss-cut die-cut vinyl sticker showcasing our beloved farm defender raccoon clutching his ripe heirloom tomato. Peel-and-stick backing makes application effortless on Hydroflasks, Yeti mugs, laptops, iPad covers, and notebooks. Water-resistant, scratch-resistant, and dishwasher-durable.",
			tagline: "Ultra-Durable Kiss-Cut Vinyl • Scratch & Water Resistant",
			images: [
				"https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/16655/kiss-cut-stickers.jpg?camera_label=front",
				"https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/2176/kiss-cut-stickers.jpg?camera_label=context-1",
				"https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/20546/kiss-cut-stickers.jpg?camera_label=context-2",
			],
			category: "Stickers",
			variants: [
				{
					id: "45750",
					printifyVariantId: 45750,
					name: "3\" × 3\" / White",
					price: "800",
					stock: 200,
					images: ["https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/16655/kiss-cut-stickers.jpg?camera_label=front"],
					combinations: [
						{
							variantValue: {
								id: "dim-sticker-3x3",
								value: "3″ x 3″",
								colorValue: null,
								variantType: { id: "type-size", type: "string" as const, label: "Size" },
							},
						},
					],
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
			combinations: v.combinations || [],
			omnibusPrice: null,
		})),
	}));
}
