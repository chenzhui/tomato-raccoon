import { ShieldCheck, Truck, Sparkles, Layers, Cpu, CheckCircle2 } from "lucide-react";

type ProductFeaturesProps = {
	category?: string;
};

/**
 * 商品工艺与规格特性组件
 * 根据商品品类（亚克力立牌、客制化键帽、毛绒玩偶、鼠标垫）自适应展示硬核工艺特性
 */
export function ProductFeatures({ category = "Standees" }: ProductFeaturesProps) {
	const catLower = category.toLowerCase();

	const isKeycap = catLower.includes("keycap");
	const isPlush = catLower.includes("plush");
	const isMat = catLower.includes("mat");

	let title = "Crafted for Developer Desks";
	let subtitle = "Every piece is designed to bring inspiration and companionship to your battle station.";
	let features = [
		{
			icon: Layers,
			title: "4mm Optical Cast PMMA",
			description: "92%+ ultra-clear light transmittance. Crystal transparency that resists yellowing.",
		},
		{
			icon: Sparkles,
			title: "1200 DPI Dual-Sided UV",
			description: "High-definition micro-embossed printing with vibrant colors that never peel or fade.",
		},
		{
			icon: ShieldCheck,
			title: "45° Chamfered Edges",
			description: "Diamond-polished beveled edges for safe handling and a snug-fit weighted base.",
		},
	];

	if (isKeycap) {
		title = "Engineered for Mechanical Keyboards";
		subtitle = "PBT dye-sublimated craftsmanship designed for millions of keystrokes.";
		features = [
			{
				icon: Cpu,
				title: "Universal Cherry MX Stem",
				description: "Standard cross-stem fit. Compatible with Cherry, Gateron, Kailh, and all MX-clone switches.",
			},
			{
				icon: Sparkles,
				title: "Dye-Sublimated PBT",
				description: "High-purity PBT plastic with matte surface. Highly resistant to shine, skin oils, and wear.",
			},
			{
				icon: CheckCircle2,
				title: "Ergonomic R4 / ESC Profile",
				description: "Sculpted row profile for natural tactile feedback and satisfying mechanical bottom-out sound.",
			},
		];
	} else if (isPlush) {
		title = "Squishy Desk Companion Quality";
		subtitle = "Ultra-soft touch and high-elasticity filling to alleviate coding fatigue.";
		features = [
			{
				icon: Sparkles,
				title: "Crystal Soft Velvet",
				description: "Ultra-fine plush fibers with baby-soft hand feel. Completely lint-free and hypoallergenic.",
			},
			{
				icon: Layers,
				title: "High-Resilience PP Cotton",
				description: "Premium springy cotton filling. Squeeze to relieve stress; bounces back instantly.",
			},
			{
				icon: ShieldCheck,
				title: "Dense Embroidery Details",
				description: "High-stitch facial embroidery that won't warp or unravel after long-term desktop display.",
			},
		];
	} else if (isMat) {
		title = "Battle Station Speed & Precision";
		subtitle = "Engineered for low friction mouse glides and marathon development sessions.";
		features = [
			{
				icon: Sparkles,
				title: "Micro-Weave Speed Surface",
				description: "Ultra-smooth textile weave tuned for precise optical tracking and effortless glide.",
			},
			{
				icon: Layers,
				title: "Anti-Fray 360° Stitching",
				description: "Reinforced edge stitching prevents surface peeling and border fraying over years of use.",
			},
			{
				icon: ShieldCheck,
				title: "Water-Resistant & Non-Slip",
				description: "Liquids bead up for easy wiping. 4mm heavy-grip natural rubber base stays firmly in place.",
			},
		];
	}

	return (
		<section className="mt-20 border-t border-neutral-200 pt-16">
			<div className="text-center max-w-2xl mx-auto mb-12">
				<h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900">{title}</h2>
				<p className="mt-2 text-xs sm:text-sm text-neutral-500 font-normal">{subtitle}</p>
			</div>
			<div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
				{features.map((feature) => {
					const Icon = feature.icon;
					return (
						<div
							key={feature.title}
							className="group p-6 rounded-3xl bg-[#F5F5F7] border border-neutral-200/60 hover:border-neutral-300 transition-all flex flex-col items-center text-center"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-neutral-900 group-hover:scale-105 transition-transform">
								<Icon className="h-5 w-5 text-neutral-800" />
							</div>
							<h3 className="mb-1.5 text-base font-medium text-neutral-900">{feature.title}</h3>
							<p className="text-xs text-neutral-500 leading-relaxed font-normal">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
