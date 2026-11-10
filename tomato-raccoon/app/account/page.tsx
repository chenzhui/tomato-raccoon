"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
	User,
	Package,
	RotateCcw,
	HelpCircle,
	ArrowLeft,
	Search,
	ShieldCheck,
	Clock,
	ExternalLink,
} from "lucide-react";

export default function AccountPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState<any[] | null>(null);
	const [searched, setSearched] = useState(false);

	const handleSearchOrders = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		setLoading(true);
		setSearched(true);

		try {
			// 复用订单追踪 API
			const res = await fetch("/api/orders/track", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim(), orderNumber: "" }),
			});
			const data = await res.json();
			if (res.ok && data.data) {
				setOrders([data.data]);
			} else {
				setOrders([]);
			}
		} catch (err) {
			setOrders([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white text-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-10">
				{/* 顶栏返回 */}
				<div>
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Store
					</Link>
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
								<User className="w-6 h-6" />
							</div>
							<div>
								<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
									Customer Account
								</h1>
								<p className="text-xs text-neutral-500 font-mono">Guest Session Active · Fast Express Orders</p>
							</div>
						</div>
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-600">
							<ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
							<span>Zero-Risk Buyer Protection</span>
						</div>
					</div>
				</div>

				{/* 核心快捷服务网格（Bento Grid） */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Link
						href="/track-order"
						className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] hover:border-neutral-300 transition-all group block"
					>
						<div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 shadow-2xs group-hover:scale-105 transition-transform">
							<Package className="w-5 h-5" />
						</div>
						<h3 className="text-base font-semibold text-neutral-900 mb-1">Track Orders</h3>
						<p className="text-xs text-neutral-500 leading-relaxed">
							Locate real-time USPS & YunExpress flight transit by order number.
						</p>
					</Link>

					<Link
						href="/returns"
						className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] hover:border-neutral-300 transition-all group block"
					>
						<div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 shadow-2xs group-hover:scale-105 transition-transform">
							<RotateCcw className="w-5 h-5" />
						</div>
						<h3 className="text-base font-semibold text-neutral-900 mb-1">30-Day Guarantee</h3>
						<p className="text-xs text-neutral-500 leading-relaxed">
							Snap a photo of cracked or defective standees for 100% free reshipment.
						</p>
					</Link>

					<Link
						href="/faq"
						className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] hover:border-neutral-300 transition-all group block"
					>
						<div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 shadow-2xs group-hover:scale-105 transition-transform">
							<HelpCircle className="w-5 h-5" />
						</div>
						<h3 className="text-base font-semibold text-neutral-900 mb-1">Unboxing Guide</h3>
						<p className="text-xs text-neutral-500 leading-relaxed">
							Acrylic peel-film tips, alcohol damage cautions & cleaning instructions.
						</p>
					</Link>
				</div>

				{/* 订单自助检索区 */}
				<div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-6">
					<div>
						<h2 className="text-lg font-semibold text-neutral-900">Find Your Order History</h2>
						<p className="text-xs sm:text-sm text-neutral-500 mt-1">
							Enter the email address used during checkout to retrieve recent orders and package tracking details.
						</p>
					</div>

					<form onSubmit={handleSearchOrders} className="flex flex-col sm:flex-row gap-3">
						<input
							type="email"
							required
							placeholder="e.g. developer@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
						/>
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
						>
							<Search className="w-4 h-4" />
							{loading ? "Searching..." : "Lookup Orders"}
						</button>
					</form>

					{/* 检索结果展示 */}
					{searched && (
						<div className="pt-4 border-t border-neutral-200">
							{orders && orders.length > 0 ? (
								<div className="space-y-4">
									{orders.map((ord, idx) => (
										<div
											key={idx}
											className="p-4 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
										>
											<div>
												<div className="flex items-center gap-2">
													<span className="font-mono font-semibold text-neutral-900 text-sm">{ord.orderNumber}</span>
													<span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
														{ord.status === "in_transit" ? "In Transit" : "Processing"}
													</span>
												</div>
												<p className="text-xs text-neutral-500 mt-1">Recipient: {ord.customerName}</p>
											</div>

											<div className="flex items-center gap-3">
												<Link
													href={`/track-order?orderNumber=${encodeURIComponent(ord.orderNumber)}`}
													className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
												>
													View Timeline <ExternalLink className="w-3.5 h-3.5" />
												</Link>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-neutral-500 text-xs">
									<Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
									<p>No orders found for this email address.</p>
									<p className="text-neutral-400 mt-1">
										If you recently placed an order, it may take 1-2 minutes to synchronize.
									</p>
								</div>
							)}
						</div>
					)}
				</div>

				{/* 账户设置与支持说明 */}
				<div className="p-6 rounded-3xl border border-neutral-200/80 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
					<div>
						<p className="font-medium text-neutral-900">Need personal assistance with your order?</p>
						<p className="mt-0.5">Our fulfillment engineers reply within 12 hours.</p>
					</div>
					<a
						href="mailto:growtomatoes.service@outlook.com"
						className="px-5 py-2 rounded-full border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-colors font-medium"
					>
						growtomatoes.service@outlook.com
					</a>
				</div>
			</div>
		</div>
	);
}
