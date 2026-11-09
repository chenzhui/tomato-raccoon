"use client";

import { useEffect, useState } from "react";
import { Flame, Clock, Sparkles } from "lucide-react";

export function UrgencyBadge({ stock = 4 }: { stock?: number }) {
	const [viewersCount, setViewersCount] = useState<number>(18);
	const [stockLeft] = useState<number>(stock > 0 ? stock : 4);

	useEffect(() => {
		// 在 14 到 26 之间轻微波动在线人数以模拟真实的实时流量
		const interval = setInterval(() => {
			const jitter = Math.floor(14 + Math.random() * 12);
			setViewersCount(jitter);
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="space-y-2.5 my-4">
			{/* 实时观看人数指示器 */}
			<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium">
				<Flame className="w-3.5 h-3.5 text-neutral-900 animate-pulse" />
				<span>
					<strong className="text-neutral-900 font-mono">{viewersCount} developers</strong> viewing this item
				</span>
			</div>

			{/* 库存紧张提示 */}
			<div className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5F7] border border-neutral-200/80 text-xs text-neutral-700">
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-neutral-600 shrink-0" />
					<span>
						Current batch: <strong className="text-neutral-900 font-mono">Only {stockLeft} left</strong> in stock
					</span>
				</div>
				<span className="text-[11px] font-mono text-neutral-700 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200">
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
				<label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
					<Sparkles className="w-3.5 h-3.5 text-neutral-700" />
					Bundle & Save
				</label>
				<span className="text-[11px] text-emerald-700 font-medium">Free Shipping on 3+ Standees</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
				{/* 档位 1：单件 */}
				<div
					onClick={() => handleSelect("single")}
					className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
						selectedTier === "single"
							? "border-black bg-white ring-1 ring-black shadow-xs"
							: "border-neutral-200 bg-[#F5F5F7] hover:border-neutral-300"
					}`}
				>
					<div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
						<span>Single (1x)</span>
						<span className="font-mono">${currentPrice.toFixed(2)}</span>
					</div>
					<p className="text-[11px] text-neutral-500 mt-1">Standard 15cm standee</p>
				</div>

				{/* 档位 2：3 件装 */}
				<div
					onClick={() => handleSelect("trio")}
					className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
						selectedTier === "trio"
							? "border-black bg-white ring-1 ring-black shadow-xs"
							: "border-neutral-200 bg-[#F5F5F7] hover:border-neutral-300"
					}`}
				>
					<span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-md bg-black text-white text-[10px] font-bold font-mono">
						SAVE $8
					</span>
					<div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
						<span>Pick Any 3</span>
						<span className="font-mono font-bold">$42.99</span>
					</div>
					<p className="text-[11px] text-emerald-700 mt-1">✓ Free Express Shipping</p>
				</div>

				{/* 档位 3：5 件全套捆绑包 */}
				<div
					onClick={() => handleSelect("bundle")}
					className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
						selectedTier === "bundle"
							? "border-black bg-white ring-1 ring-black shadow-xs"
							: "border-neutral-200 bg-[#F5F5F7] hover:border-neutral-300"
					}`}
				>
					<span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold font-mono">
						SAVE 30%
					</span>
					<div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
						<span>All 5 Set</span>
						<span className="font-mono font-bold">$59.99</span>
					</div>
					<p className="text-[11px] text-neutral-600 mt-1 leading-snug">
						Free Express + Stickers
					</p>
				</div>
			</div>
		</div>
	);
}
