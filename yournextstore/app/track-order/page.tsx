"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Search,
	Truck,
	CheckCircle2,
	Clock,
	PackageCheck,
	ArrowLeft,
	ExternalLink,
	AlertCircle,
	Sparkles,
	ShieldCheck,
} from "lucide-react";

interface TrackResult {
	orderNumber: string;
	customerName: string;
	trackingNumber: string;
	carrier: string;
	status: "processing" | "crafted" | "in_transit" | "delivered";
	carrierUrl: string;
	estimatedDelivery: string;
	createdAt: string;
	items: Array<{
		name: string;
		quantity: number;
		image: string;
	}>;
	timeline: Array<{
		title: string;
		description: string;
		time: string;
		completed: boolean;
		current: boolean;
	}>;
}

export default function TrackOrderPage() {
	const [orderNumber, setOrderNumber] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<TrackResult | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderNumber.trim()) {
			setError("Please enter your Order Number (e.g., AI-678413)");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
			const data = await res.json();
			if (data.success && data.order) {
				setResult(data.order);
			} else {
				throw new Error(data.message || "Order not found. Please verify your order number.");
			}
		} catch (err: any) {
			setError(err.message || "Unable to fetch order status. Please check your order number.");
			setResult(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#07090f] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-8">
				{/* 页面头部区域 */}
				<div>
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Store
					</Link>
					<div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
						<Truck className="w-4 h-4" />
						<span>Live Logistics Tracker</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
						Track Your Package
					</h1>
					<p className="mt-2 text-sm sm:text-base text-slate-400">
						Enter your order number to track custom handcrafting and USPS express transit in real time.
					</p>
				</div>

				{/* 订单查询搜索表单 */}
				<form
					onSubmit={handleSearch}
					className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-slate-300 mb-1.5">
								Order Number <span className="text-cyan-400">*</span>
							</label>
							<input
								type="text"
								placeholder="e.g. AI-678413"
								value={orderNumber}
								onChange={(e) => setOrderNumber(e.target.value)}
								className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-slate-300 mb-1.5">
								Order Email (Optional verification)
							</label>
							<input
								type="email"
								placeholder="developer@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
							/>
						</div>
					</div>

					{error && (
						<div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
							<span>{error}</span>
						</div>
					)}

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer disabled:opacity-50"
						>
							<Search className="w-4 h-4" />
							{loading ? "Searching..." : "Track Package"}
						</button>
					</div>
				</form>

				{/* 查询结果展示卡片 */}
				{result && (
					<div className="p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-[#090d16] shadow-2xl space-y-8 animate-in fade-in duration-300">
						{/* 订单概览头部信息 */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
							<div>
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold text-white font-mono">{result.orderNumber}</span>
									<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-500/50 text-emerald-400">
										{result.status === "in_transit"
											? "In Transit"
											: result.status === "delivered"
												? "Delivered"
												: "Processing / Crafting"}
									</span>
								</div>
								<p className="text-xs text-slate-400 mt-1">Recipient: {result.customerName}</p>
							</div>

							<div className="sm:text-right">
								<p className="text-xs text-slate-400">USPS / YunExpress Tracking Number</p>
								<div className="flex items-center sm:justify-end gap-2 mt-1">
									<span className="font-mono text-cyan-300 font-bold text-sm">
										{result.trackingNumber}
									</span>
									<a
										href={result.carrierUrl}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
									>
										Track on USPS <ExternalLink className="w-3 h-3" />
									</a>
								</div>
							</div>
						</div>

						{/* 物流节点进度条可视化 */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-white uppercase tracking-wider">
								Shipment Milestone Timeline
							</h3>
							<div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
								{result.timeline.map((step, idx) => (
									<div key={idx} className="relative">
										<div
											className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
												step.completed
													? "bg-cyan-500 border-cyan-400 text-slate-950"
													: step.current
														? "bg-slate-950 border-cyan-400 ring-4 ring-cyan-500/20"
														: "bg-slate-900 border-slate-700"
											}`}
										>
											{step.completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
										</div>
										<div className="space-y-0.5">
											<div className="flex items-center gap-2">
												<span
													className={`text-sm font-semibold ${
														step.current
															? "text-cyan-300"
															: step.completed
																? "text-white"
																: "text-slate-500"
													}`}
												>
													{step.title}
												</span>
												<span className="text-[11px] font-mono text-slate-500">{step.time}</span>
											</div>
											<p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 包裹内商品清单 */}
						<div className="pt-6 border-t border-slate-800 space-y-3">
							<h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Package Contents
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{result.items.map((item, idx) => (
									<div
										key={idx}
										className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
									>
										<div className="relative w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 shrink-0 overflow-hidden">
											<Image
												src={item.image || "/images/characters/whale-chan-full.png"}
												alt={item.name}
												fill
												className="object-contain p-1"
											/>
										</div>
										<div className="min-w-0">
											<p className="text-xs font-medium text-white truncate">{item.name}</p>
											<p className="text-[11px] font-mono text-slate-400">Qty: {item.quantity}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 售后极客换新入口引导 */}
						<div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
							<div className="flex items-center gap-2 text-slate-300">
								<ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
								<span>Issue with your delivery or standee arrived cracked?</span>
							</div>
							<Link
								href={`/returns?orderNumber=${encodeURIComponent(result.orderNumber)}`}
								className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
							>
								Submit Free Replacement Request →
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
