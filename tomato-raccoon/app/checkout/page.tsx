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
	AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

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
		subtotalCents = 5999; // $59.99 典藏全套
	}

	const isFreeShipping = subtotalCents >= 5000;
	const shippingCents = isFreeShipping ? 0 : 499;
	const totalCents = subtotalCents + shippingCents;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmitOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			const customerFullName = `${formData.firstName} ${formData.lastName}`.trim() || "Valued Supporter";
			const res = await fetch("/api/checkout/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customer: {
						email: formData.email,
						name: customerFullName,
					},
					email: formData.email,
					customerName: customerFullName,
					shippingAddress: {
						name: customerFullName,
						address1: formData.address1,
						address2: formData.address2,
						line1: formData.address1,
						line2: formData.address2,
						city: formData.city,
						state: formData.state,
						postalCode: formData.postalCode,
						zip: formData.postalCode,
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
										variantId: "73203",
										name: "Comfort Colors® 1717 Unisex Garment-Dyed T-Shirt",
										quantity: 1,
										price: "3200",
										images: ["/images/products/vintage-tee.svg"],
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
				throw new Error(data.message || data.error || "Order processing failed");
			}
		} catch (err: any) {
			console.error("Order submit failed:", err);
			setError(err.message || "Payment or order processing failed. Please check your card and address.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* 页面头部 */}
				<div className="flex items-center justify-between pb-8 mb-8 border-b border-neutral-200">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors">
						<ArrowLeft className="w-4 h-4" />
						Return to Store
					</Link>
					<div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
						<Lock className="w-3.5 h-3.5 text-emerald-600" />
						<span>256-Bit SSL Encrypted Checkout</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* 左侧：配送与支付表单 */}
					<div className="lg:col-span-7 space-y-8">
						<form onSubmit={handleSubmitOrder} className="space-y-8">
							{/* 联系信息 */}
							<div className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-4">
								<h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
									<span>1. Contact Information</span>
								</h2>
								<div>
									<label className="block text-xs font-medium text-neutral-600 mb-1">Email Address (for USPS Tracking updates)</label>
									<input
										type="email"
										name="email"
										required
										placeholder="developer@terminal.com"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
									/>
								</div>
							</div>

							{/* 配送地址 */}
							<div className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-4">
								<h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
									<span>2. Shipping Address</span>
								</h2>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-neutral-600 mb-1">First Name</label>
										<input
											type="text"
											name="firstName"
											required
											placeholder="Ada"
											value={formData.firstName}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-neutral-600 mb-1">Last Name</label>
										<input
											type="text"
											name="lastName"
											required
											placeholder="Lovelace"
											value={formData.lastName}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-600 mb-1">Street Address</label>
									<input
										type="text"
										name="address1"
										required
										placeholder="1 Infinite Loop"
										value={formData.address1}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-600 mb-1">Apt, Suite, Unit (Optional)</label>
									<input
										type="text"
										name="address2"
										placeholder="Apt 404"
										value={formData.address2}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
									/>
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div>
										<label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
										<input
											type="text"
											name="city"
											required
											placeholder="Cupertino"
											value={formData.city}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-neutral-600 mb-1">State / Province</label>
										<input
											type="text"
											name="state"
											required
											placeholder="CA"
											value={formData.state}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-neutral-600 mb-1">Postal Code</label>
										<input
											type="text"
											name="postalCode"
											required
											placeholder="95014"
											value={formData.postalCode}
											onChange={handleInputChange}
											className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black text-sm"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-medium text-neutral-600 mb-1">Country / Region</label>
									<select
										name="country"
										value={formData.country}
										onChange={handleInputChange}
										className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-black text-sm"
									>
										<option value="United States">United States (USPS Air Express)</option>
										<option value="Canada">Canada (Canada Post Expedited)</option>
										<option value="United Kingdom">United Kingdom (Royal Mail)</option>
										<option value="Germany">Germany (DHL Express)</option>
										<option value="France">France (La Poste Direct)</option>
										<option value="Japan">Japan (Japan Post / Sagawa)</option>
										<option value="Australia">Australia (Australia Post)</option>
									</select>
								</div>
							</div>

							{/* 支付方式 */}
							<div className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-4">
								<h2 className="text-base font-semibold text-neutral-900 flex items-center justify-between">
									<span>3. Payment Gateway</span>
									<span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Stripe Sandbox / Test Active</span>
								</h2>

								<div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
									<div className="flex items-center justify-between text-xs font-medium text-neutral-700">
										<div className="flex items-center gap-2">
											<CreditCard className="w-4 h-4 text-neutral-800" />
											<span>Credit / Debit Card Simulation</span>
										</div>
										<span className="text-neutral-400">Visa / Mastercard / Amex</span>
									</div>
									<div className="grid grid-cols-3 gap-2">
										<input
											type="text"
											readOnly
											value="4242 •••• •••• 4242"
											className="col-span-2 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800"
										/>
										<input
											type="text"
											readOnly
											value="12/28 · 888"
											className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800"
										/>
									</div>
									<p className="text-[11px] text-neutral-500 leading-tight">
										✓ Your test order will immediately sync to PostgreSQL backend with tracking generation simulation.
									</p>
								</div>
							</div>

							{error && (
								<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
									<AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
									<span>{error}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={submitting}
								className="w-full py-3.5 px-8 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-sm tracking-wide disabled:opacity-50 transition-all cursor-pointer shadow-sm"
							>
								{submitting ? "Processing Order..." : `Pay $${(totalCents / 100).toFixed(2)} — Complete Order`}
							</button>
						</form>
					</div>

					{/* 右侧：订单摘要侧边栏 */}
					<div className="lg:col-span-5 space-y-6">
						<div className="p-6 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] sticky top-24 space-y-6">
							<h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-4 border-b border-neutral-200">
								Order Summary
							</h3>

							{/* 商品清单 */}
							<div className="space-y-4 max-h-80 overflow-y-auto pr-1">
								{items.length > 0 ? (
									items.map((item, idx) => (
										<div key={item.productVariant.id || idx} className="flex items-center gap-3">
											<div className="relative w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
												<Image
													src={item.productVariant.images[0] || "/logo.svg"}
													alt={item.productVariant.product.name}
													fill
													className="object-contain p-1"
												/>
												<span className="absolute top-0 right-0 w-4 h-4 rounded-bl-md bg-black text-white text-[10px] font-bold flex items-center justify-center">
													{item.quantity}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium text-neutral-900 truncate">{item.productVariant.product.name}</p>
												<p className="text-[11px] font-mono text-neutral-600">
													${(Number(item.productVariant.price) / 100).toFixed(2)}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="flex items-center gap-3">
										<div className="relative w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
											<Image
												src="/logo.svg"
												alt="Protest Apparel"
												fill
												className="object-contain p-1"
											/>
											<span className="absolute top-0 right-0 w-4 h-4 rounded-bl-md bg-black text-white text-[10px] font-bold flex items-center justify-center">
												1
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-neutral-900 truncate">
												The Ultimate Desk Waifu Bundle (5-Pack)
											</p>
											<p className="text-[11px] font-mono text-neutral-600">$59.99</p>
										</div>
									</div>
								)}
							</div>

							{/* 费用明细结算 */}
							<div className="space-y-2 pt-4 border-t border-neutral-200 text-xs">
								<div className="flex justify-between text-neutral-600">
									<span>Subtotal</span>
									<span className="font-mono text-neutral-900 font-medium">${(subtotalCents / 100).toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-neutral-600">
									<span className="flex items-center gap-1">
										<Truck className="w-3.5 h-3.5 text-neutral-700" />
										<span>YunExpress / USPS Air Express</span>
									</span>
									<span className="font-mono text-emerald-700 font-semibold">
										{isFreeShipping ? "FREE" : "$4.99"}
									</span>
								</div>
								<div className="flex justify-between text-base font-semibold text-neutral-900 pt-3 border-t border-neutral-200">
									<span>Total Due</span>
									<span className="text-neutral-900 font-mono">${(totalCents / 100).toFixed(2)} USD</span>
								</div>
							</div>

							{/* 信任与保障承诺 */}
							<div className="p-3.5 rounded-2xl bg-white border border-neutral-200 space-y-2 text-[11px] text-neutral-600">
								<div className="flex items-center gap-2 text-neutral-900 font-medium">
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
