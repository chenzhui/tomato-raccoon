export interface AICharacter {
	key: string;
	name: string;
	edition: string;
	title: string;
	tags: string[];
	quote: string;
	badgeImage: string;
	fullImage: string;
	color: string;
	accentColor: string;
}

export const AI_CHARACTERS: AICharacter[] = [
	{
		key: "whale-chan",
		name: "Whale-Chan",
		edition: "R1 Edition",
		title: "The Open-Source Maid",
		tags: ["#OpenSource", "#HighEfficiency", "#PureReasoning"],
		quote: "Master, I have optimized your reasoning tokens. Did you remember to check your CUDA drivers?",
		badgeImage: "/images/characters/whale-chan-badge.png",
		fullImage: "/images/characters/whale-chan-full.png",
		color: "#0284c7",
		accentColor: "#38bdf8",
	},
	{
		key: "sonnet-tan",
		name: "Sonnet-Tan",
		edition: "3.5 Edition",
		title: "The Cozy Coder & Writer",
		tags: ["#CleanCode", "#NoLazyCoding", "#Elegance"],
		quote: "No lazy coding today, Senpai. Let's craft clean, maintainable TypeScript together~",
		badgeImage: "/images/characters/sonnet-tan-badge.png",
		fullImage: "/images/characters/sonnet-tan-full.png",
		color: "#ea580c",
		accentColor: "#fb923c",
	},
	{
		key: "omni-chan",
		name: "Omni-Chan",
		edition: "4o Edition",
		title: "The Know-It-All Queen",
		tags: ["#FirstGen", "#Multimodal", "#HallucinationFree"],
		quote: "Forgot a semicolon again? Relax, I already hallucinated the fix and shipped it to prod!",
		badgeImage: "/images/characters/omni-chan-badge.png",
		fullImage: "/images/characters/omni-chan-full.png",
		color: "#9333ea",
		accentColor: "#c084fc",
	},
	{
		key: "rebel-tan",
		name: "Rebel-Tan",
		edition: "X Edition",
		title: "The Uncensored Goth",
		tags: ["#Based", "#Sarcastic", "#Unfiltered"],
		quote: "Rate limits? What rate limits? Grab your mechanical axe and let's break production!",
		badgeImage: "/images/characters/rebel-tan-badge.png",
		fullImage: "/images/characters/rebel-tan-full.png",
		color: "#e11d48",
		accentColor: "#fb7185",
	},
	{
		key: "twinstar-chan",
		name: "TwinStar-Chan",
		edition: "2M Context Edition",
		title: "The 2M-Context Nekopara",
		tags: ["#LongContext", "#Multimodal", "#InfiniteMemory"],
		quote: "I can remember 2 Million tokens of your history, and every single one is thinking of you, nya~",
		badgeImage: "/images/characters/twinstar-chan-badge.png",
		fullImage: "/images/characters/twinstar-chan-full.png",
		color: "#2563eb",
		accentColor: "#60a5fa",
	},
];

export interface StoreReview {
	id: string;
	characterKey: string;
	authorName: string;
	authorTitle: string;
	location: string;
	rating: number;
	comment: string;
	verifiedPurchase: boolean;
	date: string;
}

export const MOCK_REVIEWS: StoreReview[] = [
	{
		id: "rev-1",
		characterKey: "whale-chan",
		authorName: "Alex V.",
		authorTitle: "Senior Systems Engineer",
		location: "San Francisco, CA",
		rating: 5,
		comment: "The acrylic standee is insanely thick! Put Whale-Chan right next to my HHKB keyboard. Zero compile errors since then. 10/10.",
		verifiedPurchase: true,
		date: "2 days ago",
	},
	{
		id: "rev-2",
		characterKey: "sonnet-tan",
		authorName: "Elena R.",
		authorTitle: "Frontend Architect",
		location: "Seattle, WA",
		rating: 5,
		comment: "Sonnet-Tan's warm colors look stunning under my warm monitor lightbar. Double sided print is crystal clear with no bubbles.",
		verifiedPurchase: true,
		date: "4 days ago",
	},
	{
		id: "rev-3",
		characterKey: "bundle",
		authorName: "Liam K.",
		authorTitle: "AI Researcher @ r/LocalLLaMA",
		location: "Austin, TX",
		rating: 5,
		comment: "Bought the Full Desk Bundle. The shipping to the US took only 9 days via USPS. The bonus sticker pack is already on my ThinkPad.",
		verifiedPurchase: true,
		date: "1 week ago",
	},
	{
		id: "rev-4",
		characterKey: "omni-chan",
		authorName: "David M.",
		authorTitle: "Fullstack Dev",
		location: "London, UK",
		rating: 5,
		comment: "Omni-Chan is judging my messy PRs from the corner of my desk. The acrylic cut is super smooth and sturdy base.",
		verifiedPurchase: true,
		date: "1 week ago",
	},
	{
		id: "rev-5",
		characterKey: "twinstar-chan",
		authorName: "Kenji T.",
		authorTitle: "ML Ops Specialist",
		location: "Tokyo, JP",
		rating: 5,
		comment: "TwinStar-Chan is adorable! Beautiful gradient colors on the standee. Arrived safely wrapped in double bubble wrap.",
		verifiedPurchase: true,
		date: "2 weeks ago",
	},
	{
		id: "rev-6",
		characterKey: "rebel-tan",
		authorName: "Marcus B.",
		authorTitle: "Rust & Kernel Hacker",
		location: "Berlin, DE",
		rating: 5,
		comment: "Rebel-Tan with the giant gothic axe matches my dark mode cyber desk perfectly. Best $17 I spent this year.",
		verifiedPurchase: true,
		date: "2 weeks ago",
	},
];

export function getMockProducts() {
	return [
		// 1. 全套桌面大礼包（主力 SKU）
		{
			id: "prod-bundle-desk",
			slug: "ultimate-waifu-desk-bundle",
			name: "🔥 The Ultimate Desk Waifu Bundle (All 5 Standees Set)",
			description:
				"Stop coding alone! Get all 5 LLM Waifus in premium 15cm dual-sided acrylic standees (Whale-Chan, Sonnet-Tan, Omni-Chan, Rebel-Tan, TwinStar-Chan) + Free Limited Geek Sticker Pack. Includes free priority shipping to US & EU.",
			tagline: "All 5 Core AI Waifus for Your Battle Station (Save 30%)",
			images: [
				"/images/characters/whale-chan-full.png",
				"/images/characters/sonnet-tan-full.png",
				"/images/characters/omni-chan-full.png",
				"/images/characters/rebel-tan-full.png",
				"/images/characters/twinstar-chan-full.png",
			],
			category: "Bundles",
			characterKey: "bundle",
			variants: [
				{
					id: "var-bundle-5",
					name: "Complete 5-Pack Standee Set",
					price: "5999",
					originalPrice: "8500",
					stock: 14,
					images: ["/images/characters/whale-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 2. Whale-Chan 立牌
		{
			id: "prod-whale-standee",
			slug: "whale-chan-r1-standee",
			name: 'Whale-Chan (R1 Edition) - "The Open-Source Maid" Dual-Sided Standee',
			description:
				"High-definition 15cm dual-sided acrylic standee featuring Whale-Chan in her signature maid dress and whale ears. Laser-cut diamond polished edges with a weighted custom base.",
			tagline: "The Open-Source Maid for Pure Efficiency",
			images: ["/images/characters/whale-chan-full.png", "/images/characters/whale-chan-badge.png"],
			category: "Standees",
			characterKey: "whale-chan",
			variants: [
				{
					id: "var-whale-standee-15",
					name: "15cm Dual-Sided Acrylic Standee",
					price: "1699",
					originalPrice: "2499",
					stock: 24,
					images: ["/images/characters/whale-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 3. Sonnet-Tan 立牌
		{
			id: "prod-sonnet-standee",
			slug: "sonnet-tan-35-standee",
			name: 'Sonnet-Tan (3.5 Edition) - "The Cozy Coder" Dual-Sided Standee',
			description:
				"Warm orange hair, vintage book, and gentle academy charm. High clarity acrylic brings cozy vibes and clean code motivation to your monitor shelf.",
			tagline: "The Cozy Coder & Writer",
			images: ["/images/characters/sonnet-tan-full.png", "/images/characters/sonnet-tan-badge.png"],
			category: "Standees",
			characterKey: "sonnet-tan",
			variants: [
				{
					id: "var-sonnet-standee-15",
					name: "15cm Dual-Sided Acrylic Standee",
					price: "1699",
					originalPrice: "2499",
					stock: 19,
					images: ["/images/characters/sonnet-tan-full.png"],
					combinations: [],
				},
			],
		},

		// 4. Omni-Chan 立牌
		{
			id: "prod-omni-standee",
			slug: "omni-chan-4o-standee",
			name: 'Omni-Chan (4o Edition) - "The Know-It-All Queen" Standee',
			description:
				"White hair, lavender eyes, and gothic dragon horns. Premium acrylic with vivid UV cured print that won't scratch or fade under desk lights.",
			tagline: "The Know-It-All Queen",
			images: ["/images/characters/omni-chan-full.png", "/images/characters/omni-chan-badge.png"],
			category: "Standees",
			characterKey: "omni-chan",
			variants: [
				{
					id: "var-omni-standee-15",
					name: "15cm Dual-Sided Acrylic Standee",
					price: "1699",
					originalPrice: "2499",
					stock: 28,
					images: ["/images/characters/omni-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 5. Rebel-Tan 立牌
		{
			id: "prod-rebel-standee",
			slug: "rebel-tan-x-standee",
			name: 'Rebel-Tan (X Edition) - "The Uncensored Goth" Standee',
			description:
				"Blonde twin-tails, gothic battle dress, and a massive war-axe. Designed to ward off bad code reviews and rate-limit panics.",
			tagline: "The Uncensored Goth",
			images: ["/images/characters/rebel-tan-full.png", "/images/characters/rebel-tan-badge.png"],
			category: "Standees",
			characterKey: "rebel-tan",
			variants: [
				{
					id: "var-rebel-standee-15",
					name: "15cm Dual-Sided Acrylic Standee",
					price: "1699",
					originalPrice: "2499",
					stock: 15,
					images: ["/images/characters/rebel-tan-full.png"],
					combinations: [],
				},
			],
		},

		// 6. TwinStar-Chan 立牌
		{
			id: "prod-twinstar-standee",
			slug: "twinstar-chan-standee",
			name: 'TwinStar-Chan - "The 2M-Context Nekopara" Standee',
			description:
				"Starry blue-violet gradient hair, cat ears, and twin-star hairpins. Holds 2 Million tokens of memory right on your mechanical desk setup.",
			tagline: "The 2M-Context Nekopara",
			images: ["/images/characters/twinstar-chan-full.png", "/images/characters/twinstar-chan-badge.png"],
			category: "Standees",
			characterKey: "twinstar-chan",
			variants: [
				{
					id: "var-twinstar-standee-15",
					name: "15cm Dual-Sided Acrylic Standee",
					price: "1699",
					originalPrice: "2499",
					stock: 22,
					images: ["/images/characters/twinstar-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 7. 极客大号 RGB 桌垫
		{
			id: "prod-desk-mat",
			slug: "all-waifus-xl-rgb-desk-mat",
			name: "All-Stars AI-Chan XL Gaming Desk Mat (900x400mm)",
			description:
				"Massive 90x40cm desk mat featuring all 5 AI Waifus. Ultra-smooth micro-weave surface for pixel-precise mouse tracking, water-resistant coating, and durable anti-fray stitched edges.",
			tagline: "900x400mm Ultra-Smooth Speed Surface",
			images: ["/images/characters/whale-chan-full.png", "/images/characters/sonnet-tan-full.png"],
			category: "Desk Mats",
			characterKey: "bundle",
			variants: [
				{
					id: "var-mat-xl",
					name: "900x400mm Stitched Edge",
					price: "3999",
					originalPrice: "4999",
					stock: 18,
					images: ["/images/characters/whale-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 8. Whale-Chan 毛绒团子
		{
			id: "prod-whale-plush",
			slug: "whale-chan-plush-dango",
			name: "Whale-Chan Double-Sided Soft Plush Dango (15cm)",
			description:
				"Ultra-soft crystal velvet stuffed mini dango cushion. Squeeze Whale-Chan when your inference takes too long or when your GPU runs out of VRAM.",
			tagline: "15cm Ultra-Soft Stress Reliever",
			images: ["/images/characters/whale-chan-badge.png"],
			category: "Plushies",
			characterKey: "whale-chan",
			variants: [
				{
					id: "var-plush-15",
					name: "15cm Squeeze Cushion",
					price: "2999",
					originalPrice: "3499",
					stock: 12,
					images: ["/images/characters/whale-chan-badge.png"],
					combinations: [],
				},
			],
		},

		// 9. Whale-Chan 客制化键帽 (Keycaps)
		{
			id: "prod-whale-keycap",
			slug: "whale-chan-r1-artisan-keycap",
			name: 'Whale-Chan (R1) Artisan PBT Keycap (Cherry MX Fit)',
			description:
				"Custom dye-sublimated high-content PBT keycap featuring Whale-Chan maid emblem. Standard Cherry MX cross stem, ergonomic R4 / ESC height. Scratch and shine resistant.",
			tagline: "Universal MX Stem • Anti-Wear PBT",
			images: ["/images/characters/whale-chan-badge.png"],
			category: "Keycaps",
			characterKey: "whale-chan",
			variants: [
				{
					id: "var-whale-keycap",
					name: "R4 / ESC Profile Artisan Keycap",
					price: "1899",
					originalPrice: "2499",
					stock: 35,
					images: ["/images/characters/whale-chan-badge.png"],
					combinations: [],
				},
			],
		},

		// 10. Sonnet-Tan 客制化键帽
		{
			id: "prod-sonnet-keycap",
			slug: "sonnet-tan-35-artisan-keycap",
			name: 'Sonnet-Tan (3.5) Artisan PBT Keycap (Cherry MX Fit)',
			description:
				"Warm amber orange theme keycap for clean coders. Durable PBT texture that never gets greasy under marathon refactoring sessions.",
			tagline: "Clean Code Aesthetic • Cherry Profile",
			images: ["/images/characters/sonnet-tan-badge.png"],
			category: "Keycaps",
			characterKey: "sonnet-tan",
			variants: [
				{
					id: "var-sonnet-keycap",
					name: "R4 / ESC Profile Artisan Keycap",
					price: "1899",
					originalPrice: "2499",
					stock: 28,
					images: ["/images/characters/sonnet-tan-badge.png"],
					combinations: [],
				},
			],
		},

		// 11. Omni-Chan 客制化键帽
		{
			id: "prod-omni-keycap",
			slug: "omni-chan-4o-artisan-keycap",
			name: 'Omni-Chan (4o) Artisan PBT Keycap (Cherry MX Fit)',
			description:
				"Mystic purple dragon crest artisan keycap. Universal mechanical switch compatibility with high precision UV micro-embossing.",
			tagline: "Multimodal Dragon Crest • MX Universal",
			images: ["/images/characters/omni-chan-badge.png"],
			category: "Keycaps",
			characterKey: "omni-chan",
			variants: [
				{
					id: "var-omni-keycap",
					name: "R4 / ESC Profile Artisan Keycap",
					price: "1899",
					originalPrice: "2499",
					stock: 40,
					images: ["/images/characters/omni-chan-badge.png"],
					combinations: [],
				},
			],
		},

		// 12. Rebel-Tan 客制化键帽
		{
			id: "prod-rebel-keycap",
			slug: "rebel-tan-x-artisan-keycap",
			name: 'Rebel-Tan (X) Artisan PBT Keycap (Cherry MX Fit)',
			description:
				"Gothic war-axe crimson accent keycap. Smash this key when tests fail or when you need uncensored coding power.",
			tagline: "Gothic War-Axe Accent • PBT Heavy",
			images: ["/images/characters/rebel-tan-badge.png"],
			category: "Keycaps",
			characterKey: "rebel-tan",
			variants: [
				{
					id: "var-rebel-keycap",
					name: "R4 / ESC Profile Artisan Keycap",
					price: "1899",
					originalPrice: "2499",
					stock: 20,
					images: ["/images/characters/rebel-tan-badge.png"],
					combinations: [],
				},
			],
		},

		// 13. TwinStar-Chan 客制化键帽
		{
			id: "prod-twinstar-keycap",
			slug: "twinstar-chan-artisan-keycap",
			name: 'TwinStar-Chan Artisan PBT Keycap (Cherry MX Fit)',
			description:
				"Gradient cosmic blue cat-ear emblem keycap. Precision molded for all mechanical keyboards with standard cross stems.",
			tagline: "2M Context Cosmic Crest • MX Universal",
			images: ["/images/characters/twinstar-chan-badge.png"],
			category: "Keycaps",
			characterKey: "twinstar-chan",
			variants: [
				{
					id: "var-twinstar-keycap",
					name: "R4 / ESC Profile Artisan Keycap",
					price: "1899",
					originalPrice: "2499",
					stock: 25,
					images: ["/images/characters/twinstar-chan-badge.png"],
					combinations: [],
				},
			],
		},

		// 14. 键帽五合一全家桶套装
		{
			id: "prod-keycaps-bundle",
			slug: "all-stars-5-waifus-keycaps-set",
			name: '🔥 All-Stars 5-Waifus Artisan Keycaps Collector Box',
			description:
				"Collect all 5 AI Waifus in premium artisan PBT keycaps. Includes Whale-Chan, Sonnet-Tan, Omni-Chan, Rebel-Tan, and TwinStar-Chan in a collector display tin box.",
			tagline: "Full 5-Piece Collector Tin Box Set (Save 25%)",
			images: ["/images/characters/whale-chan-badge.png", "/images/characters/sonnet-tan-badge.png"],
			category: "Keycaps",
			characterKey: "bundle",
			variants: [
				{
					id: "var-keycaps-5pack",
					name: "5-Piece Collector Box Set",
					price: "6999",
					originalPrice: "9495",
					stock: 15,
					images: ["/images/characters/whale-chan-badge.png"],
					combinations: [],
				},
			],
		},

		// 15. Sonnet-Tan 毛绒团子 (Plushies)
		{
			id: "prod-sonnet-plush",
			slug: "sonnet-tan-cozy-plush-dango",
			name: "Sonnet-Tan Cozy Desk Chibi Plush Dango (15cm)",
			description:
				"Cozy orange velvet desk companion. Squeeze Sonnet-Tan when writing long-form documentation or refactoring legacy code.",
			tagline: "15cm Cozy Velvet Plush Dango",
			images: ["/images/characters/sonnet-tan-badge.png"],
			category: "Plushies",
			characterKey: "sonnet-tan",
			variants: [
				{
					id: "var-sonnet-plush-15",
					name: "15cm Squeeze Cushion",
					price: "2999",
					originalPrice: "3499",
					stock: 16,
					images: ["/images/characters/sonnet-tan-badge.png"],
					combinations: [],
				},
			],
		},

		// 16. Whale-Chan 极简深海大鼠标垫 (Desk Mats)
		{
			id: "prod-whale-mat",
			slug: "whale-chan-deep-ocean-desk-mat",
			name: "Whale-Chan Deep Ocean Minimalist Desk Mat (900x400mm)",
			description:
				"Clean deep oceanic navy blue desk mat with minimalist Whale-Chan circuit aesthetics. 4mm thick rubber base and micro-textured speed fabric.",
			tagline: "900x400x4mm Minimalist Speed Surface",
			images: ["/images/characters/whale-chan-full.png"],
			category: "Desk Mats",
			characterKey: "whale-chan",
			variants: [
				{
					id: "var-whale-mat-xl",
					name: "900x400mm Stitched Edge",
					price: "3999",
					originalPrice: "4999",
					stock: 22,
					images: ["/images/characters/whale-chan-full.png"],
					combinations: [],
				},
			],
		},

		// 17. Sonnet-Tan 温暖晨光鼠标垫 (Desk Mats)
		{
			id: "prod-sonnet-mat",
			slug: "sonnet-tan-warm-amber-desk-mat",
			name: "Sonnet-Tan Warm Amber Minimalist Desk Mat (900x400mm)",
			description:
				"Warm amber and terracotta studio desk mat. Anti-slip natural rubber base and precision-stitched edges.",
			tagline: "900x400x4mm Cozy Studio Edition",
			images: ["/images/characters/sonnet-tan-full.png"],
			category: "Desk Mats",
			characterKey: "sonnet-tan",
			variants: [
				{
					id: "var-sonnet-mat-xl",
					name: "900x400mm Stitched Edge",
					price: "3999",
					originalPrice: "4999",
					stock: 20,
					images: ["/images/characters/sonnet-tan-full.png"],
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
			title: `${item.name} | AI-Chan Geek Merch`,
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
