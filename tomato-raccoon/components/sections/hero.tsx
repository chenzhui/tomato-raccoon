import { ArrowRight, Droplets, Heart, ShieldCheck, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#FAF7F0] text-[#1E1D1B] pt-8 pb-20 sm:pb-28 border-b border-[#E5DDD0]">
			{/* 暖调复古纸张纹理与轻柔农场漫射光 */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(217,56,41,0.06),rgba(250,247,240,0))] pointer-events-none" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* 1. 草根运动主宣告区 */}
				<div className="text-center max-w-4xl mx-auto pt-4 sm:pt-8">
					{/* 顶栏徽章 */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9CDB8] bg-[#F3ECE0] text-[#1E3F20] text-xs tracking-wider mb-6 shadow-xs">
						<span className="text-sm">🦝</span>
						<span className="font-bold">BORN IN HANOVER COUNTY, VIRGINIA</span>
						<span className="text-[#8C5A2B]">★</span>
						<span className="text-[#D93829] font-semibold">100% GRASSROOTS ADVOCACY</span>
					</div>

					<h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1E3F20] mb-6 leading-[1.08]">
						Grow Tomatoes. <br />
						<span className="text-[#D93829]">Not Data Centers.</span>
					</h1>

					<p className="text-lg sm:text-xl lg:text-2xl text-[#524B42] max-w-2xl mx-auto mb-4 leading-relaxed">
						Big Tech wants millions of gallons of groundwater for another server farm. We’d rather keep our sweet heirloom tomatoes, open skies, and clean aquifers.
					</p>

					<p className="text-xs sm:text-sm font-medium text-[#7C5335] mb-8 tracking-wide">
						Handcrafted yard signs, organic heavy-duty totes, weatherproof vinyl stickers &amp; squeezable mascot plushies.
					</p>

					{/* 暖调复古按钮组 */}
					<div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
						<Link
							href="/products"
							className="px-8 py-3.5 rounded-full bg-[#1E3F20] text-[#FAF7F0] font-bold hover:bg-[#2D5A27] transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
						>
							<span>Shop Movement Goods</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
						<Link
							href="/about"
							className="px-7 py-3.5 rounded-full bg-[#F3ECE0] border border-[#D9CDB8] text-[#1E3F20] font-semibold hover:bg-[#EAE2D2] transition-colors"
						>
							Read The Story
						</Link>
					</div>
				</div>

				{/* 2. 居中双主角画报展台 (吉祥物木刻徽章 + 农场守护者小浣熊) */}
				<div className="relative mt-12 sm:mt-16 max-w-3xl mx-auto">
					{/* 展台阴影 */}
					<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-14 bg-[#1E3F20]/10 blur-2xl rounded-full pointer-events-none" />

					<div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#E5DDD0] shadow-sm">
						{/* 左侧：官方木刻版画大勋章 */}
						<div className="relative aspect-square w-full max-w-[280px] mx-auto flex items-center justify-center">
							<Image
								src="/images/logo-1-raccoon-slogan.svg"
								alt="Official Grow Tomatoes, Not Data Centers Badge"
								fill
								priority
								sizes="(max-width: 768px) 260px, 280px"
								className="object-contain filter hover:scale-105 transition-transform duration-500"
							/>
						</div>

						{/* 右侧：守护者小浣熊公仔速览卡 */}
						<div className="space-y-4 text-left">
							<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D93829]/10 text-[#D93829] text-[11px] font-bold uppercase tracking-wider">
								★ Most Loved Plushie
							</div>
							<h3 className="text-2xl font-bold text-[#1E1D1B]">
								"The Farm Defender" Plush Raccoon
							</h3>
							<p className="text-xs sm:text-sm text-[#524B42] leading-relaxed">
								Clutching a ripe heirloom tomato with both soft paws. Huggable, squeezable, and crafted from baby-soft velvet to remind everyone what truly matters: local soil and clean water.
							</p>
							<div className="pt-2 flex items-baseline gap-3">
								<span className="text-2xl font-bold text-[#1E3F20]">$38.00</span>
								<span className="text-sm text-[#8C5A2B] line-through">$45.00</span>
								<span className="text-xs font-semibold text-[#D93829]">Save $7 · In Stock</span>
							</div>
							<Link
								href="/product/the-farm-defender-raccoon-plush"
								className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D93829] hover:underline"
							>
								<span>Adopt your farm defender</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</Link>
						</div>
					</div>
				</div>

				{/* 3. 核心社会价值卡片群 (The 3 Grassroots Pillars) */}
				<div className="mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{/* 柱石 1 */}
					<div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DDD0] space-y-3">
						<div className="w-10 h-10 rounded-xl bg-[#E8F0E7] text-[#1E3F20] flex items-center justify-center">
							<Droplets className="w-5 h-5 text-[#2E86AB]" />
						</div>
						<h4 className="font-bold text-base text-[#1E1D1B]">
							Water Over Watts
						</h4>
						<p className="text-xs text-[#524B42] leading-relaxed">
							A single data center cooling facility can consume upwards of 1 million gallons of water every single day. We stand for local groundwater preservation.
						</p>
					</div>

					{/* 柱石 2 */}
					<div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DDD0] space-y-3">
						<div className="w-10 h-10 rounded-xl bg-[#F7ECE8] text-[#D93829] flex items-center justify-center">
							<Sprout className="w-5 h-5 text-[#D93829]" />
						</div>
						<h4 className="font-bold text-base text-[#1E1D1B]">
							100% Organic &amp; Plastic-Free
						</h4>
						<p className="text-xs text-[#524B42] leading-relaxed">
							Our market totes use 12oz certified organic duck canvas. Shipped in 100% recyclable unbleached kraft paper mailers. Zero single-use plastic waste.
						</p>
					</div>

					{/* 柱石 3 */}
					<div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DDD0] space-y-3">
						<div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#7C5335] flex items-center justify-center">
							<Heart className="w-5 h-5 text-[#7C5335]" />
						</div>
						<h4 className="font-bold text-base text-[#1E1D1B]">
							Community Powered
						</h4>
						<p className="text-xs text-[#524B42] leading-relaxed">
							Born from a humble wooden yard sign in Hanover County. Every yard sign planted and bumper sticker shared helps spark conversations across neighborhoods.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
