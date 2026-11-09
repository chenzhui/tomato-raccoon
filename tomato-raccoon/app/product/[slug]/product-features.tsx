import { ShieldCheck, Truck, Sparkles, Sprout, Heart, Droplets, Layers, CheckCircle2 } from "lucide-react";

type ProductFeaturesProps = {
	category?: string;
};

/**
 * 番茄浣熊运动周边工艺与规格特性组件
 * 根据商品品类（帆布袋、毛绒玩偶、户外车贴、草坪插牌、复古服饰）自适应展示真实环保工艺
 */
export function ProductFeatures({ category = "Totes" }: ProductFeaturesProps) {
	const catLower = category.toLowerCase();

	const isPlush = catLower.includes("plush");
	const isTote = catLower.includes("tote");
	const isSticker = catLower.includes("sticker");
	const isSign = catLower.includes("sign");
	const isApparel = catLower.includes("apparel");

	let title = "Crafted for Everyday Advocacy";
	let subtitle = "Handcrafted grassroots goods built to defend local Virginia farmland and clean water.";
	let features = [
		{
			icon: Sprout,
			title: "100% Plastic-Free Packaging",
			description: "Shipped exclusively in biodegradable recycled kraft paper mailers and corrugated cardboard.",
		},
		{
			icon: Droplets,
			title: "Water Over Watts",
			description: "Every item champions regional aquifer conservation over massive data center cooling consumption.",
		},
		{
			icon: ShieldCheck,
			title: "30-Day Defend the Soil Guarantee",
			description: "If your gear is damaged in transit or doesn't bring joy, we reship free or issue a 100% refund.",
		},
	];

	if (isPlush) {
		title = "Huggable Mascot Craftsmanship";
		subtitle = "Squeezable softness reminding us of the simple joys of homegrown food.";
		features = [
			{
				icon: Sparkles,
				title: "Crystal Soft Velvet Fur",
				description: "Ultra-plush fibers with baby-soft hand feel. Completely hypoallergenic, safe, and lint-free.",
			},
			{
				icon: Heart,
				title: "Springy PP Cotton Filling",
				description: "High-elasticity cotton core. Squeeze Whale-Chan when feeling stressed; bounces back into shape instantly.",
			},
			{
				icon: ShieldCheck,
				title: "Stitched Hanover Farm Tag",
				description: "Authentic embroidered leaf paw tag celebrating Hanover County's legendary agricultural heritage.",
			},
		];
	} else if (isTote) {
		title = "Heavy-Duty Farmers Market Standard";
		subtitle = "Built to haul 40+ lbs of heirloom tomatoes, farm fresh eggs, and sourdough.";
		features = [
			{
				icon: Sprout,
				title: "12oz Certified Organic Cotton",
				description: "Heavyweight natural unbleached cotton duck canvas. Thicker and more durable than typical 6oz totes.",
			},
			{
				icon: Layers,
				title: "Reinforced Spruce Webbing Handles",
				description: "Cross-stitched box seams along handles ensure zero tearing under heavy produce weight.",
			},
			{
				icon: CheckCircle2,
				title: "Eco Water-Based Screen Print",
				description: "Hand-printed with non-toxic, water-based inks that won't crack or peel after repeated washing.",
			},
		];
	} else if (isSticker) {
		title = "All-Weather Highway Vinyl";
		subtitle = "Built to survive highway road trips, Virginia thunderstorms, and automatic car washes.";
		features = [
			{
				icon: Droplets,
				title: "100% Waterproof & Dishwasher Safe",
				description: "Thick 6-mil vinyl with waterproof adhesive. Hand-wash or top-rack dishwasher safe on tumblers.",
			},
			{
				icon: Sparkles,
				title: "UV-Resistant Matte Finish",
				description: "Protective matte laminate shields against scorching summer sun and highway salt without fading.",
			},
			{
				icon: ShieldCheck,
				title: "Residue-Free Clean Peel",
				description: "Strong permanent tack on glass, bumpers, and coolers, but leaves zero sticky residue when removed.",
			},
		];
	} else if (isSign) {
		title = "Statewide Grassroots Standard";
		subtitle = "Double-sided weatherproof coroplast designed to stand tall on your lawn.";
		features = [
			{
				icon: Layers,
				title: "Double-Sided 24\"x18\" Coroplast",
				description: "Heavy-duty 4mm fluted corrugated plastic engineered to withstand high wind gusts and rain.",
			},
			{
				icon: ShieldCheck,
				title: "Heavy-Gauge Galvanized H-Stake",
				description: "Includes heavy steel wire ground frame. Easily inserts into lawn soil without bending.",
			},
			{
				icon: Sparkles,
				title: "Vivid Outdoor UV Inks",
				description: "High-contrast tomato red and forest green screen-printed inks visible from passing roadside vehicles.",
			},
		];
	} else if (isApparel) {
		title = "Comfort Colors Vintage Heavyweight";
		subtitle = "The gold standard of American vintage streetwear that gets softer with every wash.";
		features = [
			{
				icon: Sprout,
				title: "100% Ring-Spun Cotton (6.1 oz)",
				description: "Heavyweight vintage garment-dyed fabric with a relaxed, lived-in feel right out of the package.",
			},
			{
				icon: Layers,
				title: "Soft-Hand Discharge Print",
				description: "Breathable screen-printing that dyes the fabric directly rather than laying rubbery plastic on top.",
			},
			{
				icon: CheckCircle2,
				title: "Pre-Shrunk Heritage Fit",
				description: "Double-needle collar and armholes for timeless American workwear durability.",
			},
		];
	}

	return (
		<section className="mt-20 border-t border-[#D9CDB8] pt-16 font-serif">
			<div className="text-center max-w-2xl mx-auto mb-12">
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E3F20]">{title}</h2>
				<p className="mt-2 text-xs sm:text-sm text-[#524B42] font-normal leading-relaxed">{subtitle}</p>
			</div>
			<div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
				{features.map((feature) => {
					const Icon = feature.icon;
					return (
						<div
							key={feature.title}
							className="group p-6 rounded-3xl bg-[#FDFBF7] border border-[#E5DDD0] hover:border-[#1E3F20]/40 transition-all flex flex-col items-center text-center shadow-2xs"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4EFE6] text-[#1E3F20] group-hover:scale-105 transition-transform shadow-xs">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mb-1.5 text-base font-bold text-[#1E1D1B]">{feature.title}</h3>
							<p className="text-xs text-[#524B42] leading-relaxed font-normal">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
