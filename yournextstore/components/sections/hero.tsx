import { ArrowRightIcon, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { DeskSimulator } from "@/components/desk-simulator";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#07090f] text-white pt-10 pb-16 sm:pb-24">
			{/* Cyberpunk Neon Glow Effects */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-linear-to-b from-cyan-500/10 via-violet-600/10 to-transparent blur-[140px] pointer-events-none" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Top Announcement Pill */}
				<div className="flex justify-center mb-6">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(0,242,254,0.2)]">
						<Terminal className="w-3.5 h-3.5 text-cyan-400" />
						<span>2026 Golden 5 Model Merch Pool is Live</span>
						<span className="text-slate-500">|</span>
						<span className="text-emerald-400">Zero Brand Logo · 100% Compliant</span>
					</div>
				</div>

				{/* Main Hero Header */}
				<div className="text-center max-w-4xl mx-auto mb-10">
					<h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-cyan-300">
						Stop Coding Alone. <br />
						<span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-violet-400">
							Bring Your Favorite LLM Waifu to Your Desk.
						</span>
					</h1>
					<p className="mt-6 text-base sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
						Premium dual-sided acrylic standees, squishy plush dangos, and desk mats. Handcrafted for Silicon Valley engineers, Reddit geeks, and tech weebs.
					</p>

					{/* Fast Action Buttons */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Link
							href="#products"
							className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-full text-base font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all hover:scale-105"
						>
							Explore Collection
							<ArrowRightIcon className="h-4 w-4" />
						</Link>
						<Link
							href="#simulator"
							className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-full text-base font-medium transition-colors"
						>
							<Sparkles className="w-4 h-4 text-cyan-400" />
							Try Desk Simulator
						</Link>
					</div>

					{/* Quick Highlights */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
						<div className="flex items-center gap-1.5">
							<CheckCircle2 className="w-4 h-4 text-cyan-400" />
							<span>15cm Scratch-Free Double Layer Acrylic</span>
						</div>
						<div className="flex items-center gap-1.5">
							<CheckCircle2 className="w-4 h-4 text-cyan-400" />
							<span>Worldwide USPS/YunExpress Direct Tracking</span>
						</div>
						<div className="flex items-center gap-1.5">
							<CheckCircle2 className="w-4 h-4 text-cyan-400" />
							<span>30-Day Money Back Guarantee</span>
						</div>
					</div>
				</div>

				{/* Core Differentiating Interactive Feature: Desk Setup Simulator */}
				<div id="simulator" className="mt-8 scroll-mt-20">
					<DeskSimulator />
				</div>
			</div>
		</section>
	);
}
