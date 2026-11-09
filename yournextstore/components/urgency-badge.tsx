"use client";

import { useEffect, useState } from "react";
import { Flame, Clock, Eye, ShieldCheck, Truck, Sparkles } from "lucide-react";

export function UrgencyBadge({ stock = 4 }: { stock?: number }) {
	const [viewersCount, setViewersCount] = useState<number>(18);
	const [stockLeft, setStockLeft] = useState<number>(stock > 0 ? stock : 4);

	useEffect(() => {
		// 在 14 到 26 之间轻微波动在线人数以模拟真实的实时流量
		const interval = setInterval(() => {
			const jitter = Math.floor(14 + Math.random() * 12);
			setViewersCount(jitter);
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="space-y-3 my-4">
			{/* 实时观看人数指示器 */}
			<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs font-medium">
				<Flame className="w-4 h-4 text-orange-400 animate-pulse" />
				<span>
					<strong className="text-white font-mono">{viewersCount} geeks</strong> are viewing this right now
				</span>
			</div>

			{/* 库存紧张提示 */}
			<div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
				<div className="flex items-center gap-2 text-slate-300">
					<Clock className="w-4 h-4 text-amber-400 shrink-0" />
					<span>
						Current batch: <strong className="text-amber-400 font-mono">Only {stockLeft} left</strong> in stock
					</span>
				</div>
				<span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
					Dispatches in 24h
				</span>
			</div>
		</div>
	);
}

export function VolumeUpsellSelector({
	currentPrice = 16.99,
	onSelectTier,
}: {
	currentPrice?: number;
	onSelectTier?: (tier: string) => void;
}) {
	const [selectedTier, setSelectedTier] = useState<"single" | "trio" | "bundle">("bundle");

	const handleSelect = (tier: "single" | "trio" | "bundle") => {
		setSelectedTier(tier);
		onSelectTier?.(tier);
	};

	return (
		<div className="my-6 space-y-3">
			<div className="flex items-center justify-between">
				<label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
					<Sparkles className="w-3.5 h-3.5 text-cyan-400" />
					Bundle & Save (Volume Pricing)
				</label>
				<span className="text-[11px] text-emerald-400 font-medium">Free US/EU Shipping on 3+</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
				{/* 档位 1：单件 */}
				<div
					onClick={() => handleSelect("single")}
					className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
						selectedTier === "single"
							? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
							: "border-slate-800 bg-slate-900/50 hover:border-slate-700"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold text-white">
						<span>Single (1x)</span>
						<span className="font-mono">${currentPrice.toFixed(2)}</span>
					</div>
					<p className="text-[11px] text-slate-400 mt-1">Standard 15cm standee</p>
				</div>

				{/* 档位 2：3 件装 */}
				<div
					onClick={() => handleSelect("trio")}
					className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
						selectedTier === "trio"
							? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
							: "border-slate-800 bg-slate-900/50 hover:border-slate-700"
					}`}
				>
					<span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono">
						SAVE $8
					</span>
					<div className="flex items-center justify-between text-xs font-semibold text-white">
						<span>Pick Any 3</span>
						<span className="font-mono text-cyan-300">$42.99</span>
					</div>
					<p className="text-[11px] text-emerald-400 mt-1">✓ Free Express Shipping</p>
				</div>

				{/* 档位 3：5 件全套捆绑包 */}
				<div
					onClick={() => handleSelect("bundle")}
					className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
						selectedTier === "bundle"
							? "border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(0,242,254,0.25)] ring-1 ring-cyan-400"
							: "border-slate-800 bg-slate-900/50 hover:border-slate-700"
					}`}
				>
					<span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-md bg-linear-to-r from-orange-500 to-pink-500 text-white text-[10px] font-extrabold font-mono shadow-sm">
						BEST VALUE (SAVE 30%)
					</span>
					<div className="flex items-center justify-between text-xs font-semibold text-white">
						<span>All 5 Set</span>
						<span className="font-mono text-cyan-300 font-bold">$59.99</span>
					</div>
					<p className="text-[11px] text-slate-300 mt-1 leading-snug">
						Free Shipping + <strong className="text-cyan-300">Free Sticker Pack</strong>
					</p>
				</div>
			</div>
		</div>
	);
}
