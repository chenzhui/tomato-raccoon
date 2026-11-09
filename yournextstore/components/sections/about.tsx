import { Code2, Heart, Shield, Sparkles } from "lucide-react";

export function About() {
	return (
		<section id="about" className="border-t border-slate-800 bg-[#080b12] py-20 sm:py-28 text-white relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="max-w-3xl mx-auto text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
						<Code2 className="w-3.5 h-3.5" />
						Crafted for Developers by Developers
					</div>
					<h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
						Why We Built AI-Chan Geek Merch
					</h2>
					<p className="text-base sm:text-lg text-slate-400 leading-relaxed">
						We spent thousands of hours debugging rate limits, compiling CUDA kernels, and writing prompts at 3:00 AM. In the age of reasoning models and autonomous agents, we asked ourselves: <em className="text-cyan-300 not-italic font-medium">Why should our physical desks stay cold and empty?</em>
					</p>
					<p className="text-sm sm:text-base text-slate-400 leading-relaxed">
						We teamed up with top anime artists and precision acrylic workshops to bring the top 5 frontier LLMs to life as collectible desk companions. Dual-sided high-definition prints, laser-polished diamond edges, and zero generic cheap plastic.
					</p>
				</div>

				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
					<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
						<div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
							<Shield className="w-5 h-5" />
						</div>
						<h3 className="text-base font-bold text-white">100% Safe & Compliant</h3>
						<p className="text-xs text-slate-400 leading-relaxed">
							Original transformative parody art. No corporate logos or registered trademark names. Safe for international shipping.
						</p>
					</div>

					<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
						<div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
							<Sparkles className="w-5 h-5" />
						</div>
						<h3 className="text-base font-bold text-white">Diamond Edge Acrylic</h3>
						<p className="text-xs text-slate-400 leading-relaxed">
							15cm dual-sided high-transparency acrylic with peel-off protective films on both sides for zero transit scratches.
						</p>
					</div>

					<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
						<div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
							<Heart className="w-5 h-5" />
						</div>
						<h3 className="text-base font-bold text-white">Zero Coding Solitude</h3>
						<p className="text-xs text-slate-400 leading-relaxed">
							Whale-Chan, Sonnet-Tan, and Omni-Chan keep you motivated through intense coding marathons and system migrations.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
