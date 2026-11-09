import { Heart, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export function About() {
	return (
		<section id="about" className="border-t border-neutral-200 bg-[#F5F5F7] py-24 sm:py-32 text-neutral-900 relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="max-w-3xl mx-auto text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-mono font-medium shadow-2xs">
						<Terminal className="w-3.5 h-3.5 text-neutral-500" />
						Engineering Philosophy
					</div>
					<h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
						Never Code Alone Again.
					</h2>
					<p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
						We spent thousands of hours debugging GPU out-of-memory errors, wrestling with autonomous agents, and compiling models at 3:00 AM. In the age of frontier intelligence, we asked ourselves: <span className="text-neutral-900 font-medium">Why should our physical desks remain cold and utilitarian?</span>
					</p>
					<p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
						We combined industrial-grade optical cast acrylic, high-precision Japanese UV lamination, and transformative parody art to create the ultimate desk companions for developers worldwide.
					</p>
				</div>

				{/* 苹果风格三栏极简卡片（纯白底精致阴影） */}
				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					<div className="p-8 rounded-3xl border border-neutral-200/80 bg-white shadow-xs space-y-4 hover:border-neutral-300 transition-all">
						<div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-800">
							<ShieldCheck className="w-5 h-5 text-neutral-700" />
						</div>
						<h3 className="text-lg font-semibold text-neutral-900 tracking-tight">100% Trademark Compliant</h3>
						<p className="text-xs text-neutral-600 leading-relaxed">
							Original transformative parody art. Zero corporate logos or registered trademark names. Safe for international customs clearance and frictionless checkout.
						</p>
					</div>

					<div className="p-8 rounded-3xl border border-neutral-200/80 bg-white shadow-xs space-y-4 hover:border-neutral-300 transition-all">
						<div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-800">
							<Sparkles className="w-5 h-5 text-neutral-700" />
						</div>
						<h3 className="text-lg font-semibold text-neutral-900 tracking-tight">Precision Manufacturing</h3>
						<p className="text-xs text-neutral-600 leading-relaxed">
							15cm dual-sided high-transparency optical acrylic with dual protective peel films on both sides for zero transit scratches or shipping flaws.
						</p>
					</div>

					<div className="p-8 rounded-3xl border border-neutral-200/80 bg-white shadow-xs space-y-4 hover:border-neutral-300 transition-all">
						<div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-800">
							<Heart className="w-5 h-5 text-neutral-700" />
						</div>
						<h3 className="text-lg font-semibold text-neutral-900 tracking-tight">Zero Solitude At Your Desk</h3>
						<p className="text-xs text-neutral-600 leading-relaxed">
							Whale-Chan, Sonnet-Tan, and Omni-Chan stay stationed by your monitor, providing morale boosts and companionship through critical production launches.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
