import type { Metadata } from "next";
import Link from "next/link";
import { Package, RotateCcw, HelpCircle, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
	title: "Support — AI-Chan Studio",
	description: "Track orders, request replacements, or read care guides for your AI-Chan acrylic standees.",
	alternates: { canonical: "/support" },
};

/**
 * 苹果风格一站式支持中心 (Support Hub)
 * 聚合订单追踪、换新保障、常见问题与联系客服
 */
export default function SupportPage() {
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			{/* 顶栏标题区 */}
			<div className="text-center max-w-2xl mx-auto space-y-4">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600 tracking-wide uppercase">
					<ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
					<span>Official Customer Care</span>
				</div>
				<h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-neutral-900">
					Support. <span className="text-neutral-400">We're here for you.</span>
				</h1>
				<p className="text-sm sm:text-base text-neutral-500 font-normal leading-relaxed">
					Need help with shipping, assembly, or an existing order? Choose a category below for immediate assistance.
				</p>
			</div>

			{/* 核心卡片网格 (Apple Bento Grid) */}
			<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
				{/* 1. 物流追踪 */}
				<Link
					href="/track-order"
					className="group p-8 rounded-3xl bg-[#F5F5F7] hover:bg-[#EBEBF0] transition-all flex flex-col justify-between border border-transparent hover:border-neutral-200"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-neutral-900 group-hover:scale-105 transition-transform">
							<Package className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-medium text-neutral-900">Track Your Order</h2>
							<p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
								Look up real-time shipping milestones, customs clearance, and USPS delivery tracking.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
						<span>Track package</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 2. 30天免费换新 */}
				<Link
					href="/returns"
					className="group p-8 rounded-3xl bg-[#F5F5F7] hover:bg-[#EBEBF0] transition-all flex flex-col justify-between border border-transparent hover:border-neutral-200"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-neutral-900 group-hover:scale-105 transition-transform">
							<RotateCcw className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-medium text-neutral-900">30-Day Free Replacement</h2>
							<p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
								Received a damaged acrylic piece or cracked base during transit? Submit a photo and we'll ship a replacement free.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
						<span>Start a return or replacement</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 3. 开箱与保养常见问题 */}
				<Link
					href="/faq"
					className="group p-8 rounded-3xl bg-[#F5F5F7] hover:bg-[#EBEBF0] transition-all flex flex-col justify-between border border-transparent hover:border-neutral-200"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-neutral-900 group-hover:scale-105 transition-transform">
							<HelpCircle className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-medium text-neutral-900">Unboxing & Care FAQ</h2>
							<p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
								Instructions on peeling the double-sided protective scratch film, dusting acrylic surfaces, and assembly tips.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
						<span>Read FAQ</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>

				{/* 4. 联系客服 */}
				<Link
					href="/contact"
					className="group p-8 rounded-3xl bg-[#F5F5F7] hover:bg-[#EBEBF0] transition-all flex flex-col justify-between border border-transparent hover:border-neutral-200"
				>
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-neutral-900 group-hover:scale-105 transition-transform">
							<Mail className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-medium text-neutral-900">Contact Team</h2>
							<p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
								Have custom commission requests, bulk orders, or developer partnership questions? Drop us a line.
							</p>
						</div>
					</div>
					<div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
						<span>Send a message</span>
						<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</Link>
			</div>
		</div>
	);
}
