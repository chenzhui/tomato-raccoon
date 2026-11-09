import { ChevronRight, Cpu, Layers, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeskSimulator } from "@/components/desk-simulator";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-black text-white pt-12 pb-24 sm:pb-32">
			{/* 苹果经典顶层环境微光（柔和的暗紫冷灰径向散斑，拒绝刺眼高饱和霓虹） */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,119,198,0.18),rgba(0,0,0,0))] pointer-events-none" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* 1. 苹果 Keynote 风格巨幕发布主标题区 */}
				<div className="text-center max-w-4xl mx-auto pt-6 sm:pt-10">
					{/* 顶栏规格宣告 */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs font-mono tracking-wide mb-6">
						<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
						<span className="text-neutral-300">2026 Hardware Release</span>
						<span className="text-neutral-600">/</span>
						<span>Compliant Transformative Art</span>
					</div>

					<h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-6">
						Whale-Chan R1.
					</h1>

					<p className="text-xl sm:text-2xl lg:text-3xl font-normal text-neutral-400 tracking-tight max-w-2xl mx-auto mb-4">
						Deep thinking. Beautifully embodied on your desk.
					</p>

					<p className="text-sm font-medium text-neutral-500 mb-8">
						From $24.99 · Worldwide Tracked Shipping · 30-Day Zero-Risk Guarantee
					</p>

					{/* 苹果标准双按钮组：白底主按钮 + 优雅箭头文字链 */}
					<div className="flex flex-wrap items-center justify-center gap-5 text-sm">
						<Link
							href="/product/whale-chan-r1-standee"
							className="px-7 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95"
						>
							Order Now
						</Link>
						<a
							href="#simulator"
							className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium transition-colors group"
						>
							Customize in Simulator
							<ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
						</a>
					</div>
				</div>

				{/* 2. 居中单品悬浮舞台（苹果展台质感：无杂乱边框，纯净大图 + 桌面倒影） */}
				<div className="relative mt-12 sm:mt-16 max-w-2xl mx-auto">
					{/* 底部舞台聚光灯光晕 */}
					<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

					<div className="relative aspect-4/5 sm:aspect-square w-full max-w-[420px] mx-auto flex items-center justify-center">
						<Image
							src="/images/characters/whale-chan-full.png"
							alt="Whale-Chan R1 Standee"
							fill
							priority
							sizes="(max-width: 768px) 340px, 420px"
							className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] filter hover:scale-102 transition-transform duration-500"
						/>
					</div>

					{/* 底部水平玻璃反射台 */}
					<div className="h-0.5 w-48 sm:w-64 mx-auto bg-linear-to-r from-transparent via-white/20 to-transparent" />
				</div>

				{/* 3. 苹果风格便当盒特性解析区（Bento Grid） */}
				<div className="mt-28 sm:mt-36">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
							Industrial Craftsmanship
						</h2>
						<p className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
							Engineered like hardware. <br />
							Not cheap plastic.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Bento 1: 光学级亚克力（大卡片，跨 2 列） */}
						<div className="md:col-span-2 p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all">
							<div className="space-y-4 max-w-lg z-10">
								<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
									<Layers className="w-5 h-5 text-neutral-200" />
								</div>
								<h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
									4mm Optical-Grade Cast Acrylic.
								</h3>
								<p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
									Custom formulated cast acrylic with 92% light transmittance. Catches the warm ambient glow of your monitor at night with pure crystal transparency and zero yellowing over years of coding.
								</p>
							</div>
							<div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-neutral-400 font-mono">
								<span>+92% Transmittance</span>
								<span>·</span>
								<span>UV-Stabilized</span>
								<span>·</span>
								<span>Double Protective Film</span>
							</div>
						</div>

						{/* Bento 2: 显微级 UV 双面喷绘 */}
						<div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl flex flex-col justify-between group hover:border-white/20 transition-all">
							<div className="space-y-4">
								<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
									<Sparkles className="w-5 h-5 text-neutral-200" />
								</div>
								<h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
									1200 DPI Sub-micron UV.
								</h3>
								<p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
									Industrial Japanese micro-piezo printing heads. Dual-layer sandwich coating protects artwork from desk coffee spills and daily scratches.
								</p>
							</div>
							<div className="mt-8 pt-6 border-t border-white/10 text-xs text-neutral-400 font-mono">
								Fluid Scratch Resistance
							</div>
						</div>

						{/* Bento 3: 钻石 CNC 45度倒角 */}
						<div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl flex flex-col justify-between group hover:border-white/20 transition-all">
							<div className="space-y-4">
								<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
									<Wand2 className="w-5 h-5 text-neutral-200" />
								</div>
								<h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
									45° Chamfered Edges.
								</h3>
								<p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
									CNC diamond cut edges with flame polishing. Smooth and rounded to the touch with zero burrs when rearranging keyboard space.
								</p>
							</div>
							<div className="mt-8 pt-6 border-t border-white/10 text-xs text-neutral-400 font-mono">
								Flame-Polished Perimeter
							</div>
						</div>

						{/* Bento 4: 黄金五大模型阵容（大卡片，跨 2 列） */}
						<div className="md:col-span-2 p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl flex flex-col justify-between group hover:border-white/20 transition-all">
							<div className="space-y-4 max-w-lg">
								<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
									<Cpu className="w-5 h-5 text-neutral-200" />
								</div>
								<h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
									The Golden 5 Roster.
								</h3>
								<p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
									DeepSeek (Whale-Chan), Claude (Sonnet-Tan), ChatGPT (Omni-Chan), Gemini (TwinStar-Chan), and Grok (Rebel-Tan). Five unique personalities to accompany your late-night deploys.
								</p>
							</div>
							{/* 5 位角色极简圆形徽章展示 */}
							<div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
								{[
									{ name: "Whale-Chan", badge: "/images/characters/whale-chan-badge.png" },
									{ name: "Sonnet-Tan", badge: "/images/characters/sonnet-tan-badge.png" },
									{ name: "Omni-Chan", badge: "/images/characters/omni-chan-badge.png" },
									{ name: "TwinStar-Chan", badge: "/images/characters/twinstar-chan-badge.png" },
									{ name: "Rebel-Tan", badge: "/images/characters/rebel-tan-badge.png" },
								].map((char) => (
									<div key={char.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
										<div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
											<Image src={char.badge} alt={char.name} fill className="object-cover" />
										</div>
										<span className="text-xs text-neutral-300 font-medium">{char.name}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* 4. 苹果 Studio 配置器风格：桌面搭建模拟器 */}
				<div id="simulator" className="mt-28 sm:mt-36 scroll-mt-20">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
							Interactive Configurator
						</h2>
						<p className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
							Desk Setup Studio.
						</p>
						<p className="text-neutral-400 text-sm sm:text-base">
							Stage, drag, and test audio reactions for your favorite LLM companions in real time.
						</p>
					</div>
					<DeskSimulator />
				</div>
			</div>
		</section>
	);
}
