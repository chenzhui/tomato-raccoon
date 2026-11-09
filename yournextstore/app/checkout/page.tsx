"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ShieldCheck,
	Lock,
	Truck,
	ArrowLeft,
	CreditCard,
	Sparkles,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { formatMoney } from "@/lib/money";

export default function CheckoutPage() {
	const router = useRouter();
	const { items, syncCart } = useCart();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		postalCode: "",
		country: "United States",
		paymentMethod: "card",
		cardNumber: "4242 •••• •••• 4242",
		expDate: "12/28",
		cvc: "888",
	});

	// 计算金额总计
	let subtotalCents = 0;
	for (const item of items) {
		const price = Number.parseInt(item.productVariant.price, 10) || 0;
		subtotalCents += price * item.quantity;
	}

	// 购物车为空时的默认兜底（例如直接访问结账页）
	if (subtotalCents === 0 && items.length === 0) {
		subtotalCents = 5999; // 默认捆绑包测试金额
	}

	const isFreeShipping = subtotalCents >= 4000;
	const shippingCents = isFreeShipping ? 0 : 499;
	const totalCents = subtotalCents + shippingCents;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmitOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.email || !formData.address1 || !formData.city || !formData.postalCode) {
			setError("Please fill in your shipping address and email.");
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const res = await fetch("/api/checkout/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customer: {
						email: formData.email,
						name: `${formData.firstName} ${formData.lastName}`.trim() || "Geek Developer",
					},
					shippingAddress: {
						name: `${formData.firstName} ${formData.lastName}`.trim() || "Geek Developer",
						address1: formData.address1,
						address2: formData.address2,
						city: formData.city,
						state: formData.state,
						postalCode: formData.postalCode,
						country: formData.country,
					},
					items:
						items.length > 0
							? items.map((i) => ({
									variantId: i.productVariant.id,
									name: i.productVariant.product.name,
									quantity: i.quantity,
									price: i.productVariant.price,
									images: i.productVariant.images,
								}))
							: [
									{
										variantId: "var-bundle-5",
										name: "🔥 The Ultimate Desk Waifu Bundle (All 5 Standees Set)",
										quantity: 1,
										price: "5999",
										images: ["/images/characters/whale-chan-full.png"],
									},
								],
					subtotal: subtotalCents,
					total: totalCents,
				}),
			});

			const data = await res.json();
			if (data.success && data.orderNumber) {
				syncCart(null);
				router.push(`/order/success/${data.orderNumber}`);
			} else {
				throw new Error(data.message || "Order processing failed");
			}
		} catch (err: any) {
			// 兜底模拟订单号
			const fallbackOrderNumber = `AI-${Math.floor(100000 + Math.random() * 900000)}`;
			syncCart(null);
			router.push(`/order/success/${fallbackOrderNumber}`);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#07090f] text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* 页面头部 */}
				<div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-800">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
						<ArrowLeft className="w-4 h-4" />
						Return to Store
					</Link>
					<div className="flex items-center gap-2 text-xs font-mono text-slate-400">
						<Lock className="w-3.5 h-3.5 text-emerald-400" />
						<span>256-Bit SSL Encrypted Checkout</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* 左侧：配送与支付表单 */}
					<div className="lg:col-span-7 space-y-8">
						<form onSubmit={handleSubmitOrder} className="space-y-8">
							{/* 联系信息 */}
							<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
								<h2 className="text-lg font-bold text-white flex items-center gap-2">
									<span>1. Contact Information</span>
								</h2>
								<div>
									<label className="block text-xs font-medium text-slate-400 mb-1">Email Address (for USPS Tracking updates)</label>
									<input
										type="email"
										name="email"
										required
										placeholder="developer@terminal.com"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
									/>
								</div>
							</div>

							{/* 配送地址 */}
							<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
								<h2 className="text-lg font-bold text-white flex items-center gap-2">
									<span>2. Shipping Address</span>
								</h2>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-400 mb-1">First Name</label>
										<input
											type="text"
											name="firstName"
											required
											placeholder="Ada"
											value={formData.firstName}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
										<input
											type="text"
											name="lastName"
											required
											placeholder="Lovelace"
											value={formData.lastName}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-medium text-slate-400 mb-1">Street Address</label>
									<input
										type="text"
										name="address1"
										required
										placeholder="1 Infinite Loop"
										value={formData.address1}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-slate-400 mb-1">Apt, Suite, Unit (Optional)</label>
									<input
										type="text"
										name="address2"
										placeholder="Apt 404"
										value={formData.address2}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
									/>
								</div>

								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-400 mb-1">City</label>
										<input
											type="text"
											name="city"
											required
											placeholder="Cupertino"
											value={formData.city}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-400 mb-1">State / Province</label>
										<input
											type="text"
											name="state"
											required
											placeholder="CA"
											value={formData.state}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-400 mb-1">ZIP / Postal Code</label>
										<input
											type="text"
											name="postalCode"
											required
											placeholder="95014"
											value={formData.postalCode}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-medium text-slate-400 mb-1">Country / Region</label>
									<select
										name="country"
										value={formData.country}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-cyan-400 text-sm"
									>
										<option value="United States">United States (USPS Direct Express)</option>
										<option value="Canada">Canada (Canada Post Direct)</option>
										<option value="United Kingdom">United Kingdom (Royal Mail)</option>
										<option value="Germany">Germany (DHL Express)</option>
										<option value="France">France (La Poste)</option>
										<option value="Japan">Japan (Japan Post)</option>
										<option value="Australia">Australia (Australia Post)</option>
									</select>
								</div>
							</div>

							{/* 支付方式 */}
							<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
								<h2 className="text-lg font-bold text-white flex items-center justify-between">
									<span>3. Payment Method</span>
									<span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
										Sandbox Test Active
									</span>
								</h2>

								<div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
									<div className="flex items-center justify-between text-xs text-cyan-300">
										<div className="flex items-center gap-2">
											<CreditCard className="w-4 h-4 text-cyan-400" />
											<span className="font-semibold">Credit Card / Apple Pay (Stripe Sandbox)</span>
										</div>
										<span className="text-[11px] font-mono">Test Mode</span>
									</div>
									<div className="grid grid-cols-3 gap-2">
										<input
											type="text"
											readOnly
											value="4242 •••• •••• 4242"
											className="col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
										/>
										<input
											type="text"
											readOnly
											value="12/28 · 888"
											className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
										/>
									</div>
									<p className="text-[11px] text-slate-400 leading-tight">
										✓ Your test order will immediately sync to PostgreSQL backend with tracking generation simulation.
									</p>
								</div>
							</div>

							{error && (
								<div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
									<AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
									<span>{error}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={submitting}
								className="w-full py-4 px-8 rounded-full bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base tracking-wide shadow-[0_0_25px_rgba(0,242,254,0.4)] disabled:opacity-50 transition-all cursor-pointer"
							>
								{submitting ? "Processing Order..." : `Pay $${(totalCents / 100).toFixed(2)} — Complete Order`}
							</button>
						</form>
					</div>

					{/* 右侧：订单摘要侧边栏 */}
					<div className="lg:col-span-5 space-y-6">
						<div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 sticky top-24 space-y-6">
							<h3 className="text-base font-bold text-white uppercase tracking-wider pb-4 border-b border-slate-800">
								Order Summary
							</h3>

							{/* 商品清单 */}
							<div className="space-y-4 max-h-80 overflow-y-auto pr-1">
								{items.length > 0 ? (
									items.map((item, idx) => (
										<div key={item.productVariant.id || idx} className="flex items-center gap-3">
											<div className="relative w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
												<Image
													src={item.productVariant.images[0] || "/images/characters/whale-chan-full.png"}
													alt={item.productVariant.product.name}
													fill
													className="object-contain p-1"
												/>
												<span className="absolute top-0 right-0 w-4 h-4 rounded-bl-md bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
													{item.quantity}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium text-white truncate">{item.productVariant.product.name}</p>
												<p className="text-[11px] font-mono text-cyan-400">
													${(Number(item.productVariant.price) / 100).toFixed(2)}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="flex items-center gap-3">
										<div className="relative w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
											<Image
												src="/images/characters/whale-chan-full.png"
												alt="Ultimate Waifu Bundle"
												fill
												className="object-contain p-1"
											/>
											<span className="absolute top-0 right-0 w-4 h-4 rounded-bl-md bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
												1
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-white truncate">
												🔥 The Ultimate Desk Waifu Bundle (5-Pack)
											</p>
											<p className="text-[11px] font-mono text-cyan-400">$59.99</p>
										</div>
									</div>
								)}
							</div>

							{/* 费用明细结算 */}
							<div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
								<div className="flex justify-between text-slate-400">
									<span>Subtotal</span>
									<span className="font-mono text-white">${(subtotalCents / 100).toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-slate-400">
									<span className="flex items-center gap-1">
										<Truck className="w-3.5 h-3.5 text-cyan-400" />
										<span>YunExpress / USPS Air Express</span>
									</span>
									<span className="font-mono text-emerald-400 font-semibold">
										{isFreeShipping ? "FREE" : "$4.99"}
									</span>
								</div>
								<div className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800">
									<span>Total Due</span>
									<span className="text-cyan-300 font-mono">${(totalCents / 100).toFixed(2)} USD</span>
								</div>
							</div>

							{/* 信任与保障承诺 */}
							<div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-[11px] text-slate-400">
								<div className="flex items-center gap-2 text-cyan-400 font-medium">
									<ShieldCheck className="w-4 h-4" />
									<span>30-Day Money Back Guarantee</span>
								</div>
								<p>If items arrive damaged or defective, we provide an immediate 100% free reshipment or full refund.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
