"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Search,
	Truck,
	CheckCircle2,
	AlertCircle,
	ArrowLeft,
	ExternalLink,
	ShieldCheck,
} from "lucide-react";

type TrackingResult = {
	orderNumber: string;
	customerName: string;
	status: "in_transit" | "delivered" | "processing";
	carrier: string;
	trackingNumber: string;
	carrierUrl: string;
	estimatedDelivery: string;
	timeline: {
		title: string;
		time: string;
		description: string;
		completed: boolean;
		current?: boolean;
	}[];
	items: {
		name: string;
		quantity: number;
		image?: string;
	}[];
};

export default function TrackOrderPage() {
	const [orderNumber, setOrderNumber] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<TrackingResult | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderNumber.trim()) {
			setError("Please enter a valid order number (e.g. AI-678413 or ORD-1001)");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/orders/track", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "Order not found");
			}

			setResult(data.data);
		} catch (err: any) {
			setError(err.message || "Failed to locate order. Please verify your order number.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white text-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-8">
				{/* 页面头部区域 */}
				<div>
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Store
					</Link>
					<div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
						<Truck className="w-4 h-4 text-neutral-700" />
						<span>Live Logistics Tracker</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
						Track Your Package
					</h1>
					<p className="mt-2 text-sm sm:text-base text-neutral-500">
						Enter your order number to track custom handcrafting and USPS express transit in real time.
					</p>
				</div>

				{/* 订单查询搜索表单 */}
				<form
					onSubmit={handleSearch}
					className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-4"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-1.5">
								Order Number <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								placeholder="e.g. AI-678413"
								value={orderNumber}
								onChange={(e) => setOrderNumber(e.target.value)}
								className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-1.5">
								Order Email (Optional verification)
							</label>
							<input
								type="email"
								placeholder="developer@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
							/>
						</div>
					</div>

					{error && (
						<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
							<AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
							<span>{error}</span>
						</div>
					)}

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
						>
							<Search className="w-4 h-4" />
							{loading ? "Searching..." : "Track Package"}
						</button>
					</div>
				</form>

				{/* 查询结果展示卡片 */}
				{result && (
					<div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 bg-white shadow-xs space-y-8 animate-in fade-in duration-300">
						{/* 订单概览头部信息 */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
							<div>
								<div className="flex items-center gap-2">
									<span className="text-xl font-semibold text-neutral-900 font-mono">{result.orderNumber}</span>
									<span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
										{result.status === "in_transit"
											? "In Transit"
											: result.status === "delivered"
												? "Delivered"
												: "Processing / Crafting"}
									</span>
								</div>
								<p className="text-xs text-neutral-500 mt-1">Recipient: {result.customerName}</p>
							</div>

							<div className="sm:text-right">
								<p className="text-xs text-neutral-500">USPS / YunExpress Tracking Number</p>
								<div className="flex items-center sm:justify-end gap-2 mt-1">
									<span className="font-mono text-neutral-900 font-semibold text-sm">
										{result.trackingNumber}
									</span>
									<a
										href={result.carrierUrl}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium"
									>
										Track on USPS <ExternalLink className="w-3 h-3" />
									</a>
								</div>
							</div>
						</div>

						{/* 物流节点进度条可视化 */}
						<div className="space-y-4">
							<h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
								Shipment Milestone Timeline
							</h3>
							<div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
								{result.timeline.map((step, idx) => (
									<div key={idx} className="relative">
										<div
											className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
												step.completed
													? "bg-black border-black text-white"
													: step.current
														? "bg-white border-blue-600 ring-4 ring-blue-50"
														: "bg-white border-neutral-300"
											}`}
										>
											{step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
										</div>
										<div className="space-y-0.5">
											<div className="flex items-center gap-2">
												<span
													className={`text-sm font-medium ${
														step.current
															? "text-blue-600 font-semibold"
															: step.completed
																? "text-neutral-900"
																: "text-neutral-400"
													}`}
												>
													{step.title}
												</span>
												<span className="text-[11px] font-mono text-neutral-400">{step.time}</span>
											</div>
											<p className="text-xs text-neutral-500 leading-relaxed">{step.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 包裹内商品清单 */}
						<div className="pt-6 border-t border-neutral-200 space-y-3">
							<h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
								Package Contents
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{result.items.map((item, idx) => (
									<div
										key={idx}
										className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F5F7] border border-neutral-200/60"
									>
										<div className="relative w-12 h-12 rounded-xl bg-white border border-neutral-200 shrink-0 overflow-hidden">
											<Image
												src={item.image || "/images/characters/whale-chan-full.png"}
												alt={item.name}
												fill
												className="object-contain p-1"
											/>
										</div>
										<div className="min-w-0">
											<p className="text-xs font-medium text-neutral-900 truncate">{item.name}</p>
											<p className="text-[11px] font-mono text-neutral-500">Qty: {item.quantity}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 售后极客换新入口引导 */}
						<div className="p-4 rounded-2xl bg-[#F5F5F7] border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
							<div className="flex items-center gap-2 text-neutral-700">
								<ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
								<span>Issue with your delivery or standee arrived cracked?</span>
							</div>
							<Link
								href={`/returns?orderNumber=${encodeURIComponent(result.orderNumber)}`}
								className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
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
