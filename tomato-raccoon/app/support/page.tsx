import type { Metadata } from "next";
import Link from "next/link";
import { Package, RotateCcw, HelpCircle, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
	title: "Support & Care — Tomato Raccoon Supply Co.",
	description:
		"Track your USPS order, view lawn sign setup instructions, or request a free replacement under our 30-Day Defend the Soil Guarantee.",
	alternates: { canonical: "/support" },
};

/**
 * 美式复古田园风格支持中心 (Support Hub)
 */
export default function SupportPage() {
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			{/* 顶栏标题区 */}
			<div className="text-center max-w-2xl mx-auto space-y-4">
				<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] text-xs font-serif font-bold tracking-wider uppercase">
					<ShieldCheck className="w-3.5 h-3.5 text-[#D93829]" />
					<span>Grassroots Community Care</span>
				</div>
				<h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1E3F20]">
					Support. <span className="text-[#8C5A2B]">We're here for neighbors.</span>
				</h1>
				<p className="text-sm sm:text-base font-serif text-[#524B42] leading-relaxed">
					Need help tracking your shipment, setting up your lawn yard sign, or have questions about our movement? We're here to help.
				</p>
			</div>

			{/* 核心卡片网格 (Heritage Bento Grid) */}
			<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
				{/* 1. 物流追踪 */}
				<Link
					href="/track-order"
					className="group p-8 rounded-3xl bg-[#FDFBF7] hover:bg-[#F4EFE6] transition-all flex flex-col justify-between border border-[#E5DDD0] hover:border-[#1E3F20]/40 shadow-2xs"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-[#E8F0E7] flex items-center justify-center text-[#1E3F20] group-hover:scale-105 transition-transform shadow-xs">
							<Package className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-serif font-bold text-[#1E1D1B]">Track Your Package</h2>
							<p className="mt-1.5 text-xs sm:text-sm font-serif text-[#524B42] leading-relaxed">
								Look up real-time USPS tracking for your organic totes, vinyl sticker packs, and yard signs.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-serif font-bold text-[#1E3F20] group-hover:text-[#D93829] transition-colors">
						<span>Track shipment</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 2. 30天安心换新 */}
				<Link
					href="/returns"
					className="group p-8 rounded-3xl bg-[#FDFBF7] hover:bg-[#F4EFE6] transition-all flex flex-col justify-between border border-[#E5DDD0] hover:border-[#1E3F20]/40 shadow-2xs"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-[#F7ECE8] flex items-center justify-center text-[#D93829] group-hover:scale-105 transition-transform shadow-xs">
							<RotateCcw className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-serif font-bold text-[#1E1D1B]">30-Day Defend the Soil Guarantee</h2>
							<p className="mt-1.5 text-xs sm:text-sm font-serif text-[#524B42] leading-relaxed">
								Bent sign stake or damaged print during transit? Email a quick photo and we'll immediately ship a brand-new one free of charge.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-serif font-bold text-[#1E3F20] group-hover:text-[#D93829] transition-colors">
						<span>Request free replacement</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 3. 常见问题与护理指引 */}
				<Link
					href="/faq"
					className="group p-8 rounded-3xl bg-[#FDFBF7] hover:bg-[#F4EFE6] transition-all flex flex-col justify-between border border-[#E5DDD0] hover:border-[#1E3F20]/40 shadow-2xs"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center text-[#7C5335] group-hover:scale-105 transition-transform shadow-xs">
							<HelpCircle className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-serif font-bold text-[#1E1D1B]">Lawn Sign &amp; Gear FAQ</h2>
							<p className="mt-1.5 text-xs sm:text-sm font-serif text-[#524B42] leading-relaxed">
								Instructions on inserting metal H-wire stakes into firm soil, washing 12oz duck canvas, and dishwasher tips for vinyl stickers.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-serif font-bold text-[#1E3F20] group-hover:text-[#D93829] transition-colors">
						<span>Read care FAQ</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 4. 联系我们 */}
				<Link
					href="/contact"
					className="group p-8 rounded-3xl bg-[#FDFBF7] hover:bg-[#F4EFE6] transition-all flex flex-col justify-between border border-[#E5DDD0] hover:border-[#1E3F20]/40 shadow-2xs"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-[#EAE4D7] flex items-center justify-center text-[#1E1D1B] group-hover:scale-105 transition-transform shadow-xs">
							<Mail className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-serif font-bold text-[#1E1D1B]">Community Contact</h2>
							<p className="mt-1.5 text-xs sm:text-sm font-serif text-[#524B42] leading-relaxed">
								Organizing a local neighborhood meeting or farm market event? Drop a line to our Virginia volunteer coordination team.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-serif font-bold text-[#1E3F20] group-hover:text-[#D93829] transition-colors">
						<span>Drop us a note</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>
			</div>
		</div>
	);
}
