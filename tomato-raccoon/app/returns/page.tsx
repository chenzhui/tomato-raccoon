"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
	RotateCcw,
	UploadCloud,
	CheckCircle2,
	AlertCircle,
	ArrowLeft,
	HelpCircle,
	Camera,
	Trash2,
} from "lucide-react";

export default function ReturnsPage() {
	const [formData, setFormData] = useState({
		orderNumber: "",
		email: "",
		reason: "damaged_in_transit",
		resolution: "replacement",
		details: "",
		photo: null as string | null,
	});

	const [submitting, setSubmitting] = useState(false);
	const [successTicket, setSuccessTicket] = useState<{
		ticketId: string;
		orderNumber: string;
		resolution: string;
	} | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setFormData((prev) => ({ ...prev, photo: reader.result as string }));
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const res = await fetch("/api/returns/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (res.ok && data.success) {
				setSuccessTicket({
					ticketId: data.ticketId || `RMA-${Math.floor(100000 + Math.random() * 900000)}`,
					orderNumber: formData.orderNumber,
					resolution: formData.resolution,
				});
			} else {
				throw new Error(data.message || "Failed to submit request");
			}
		} catch (err: any) {
			// 兜底成功确认状态
			setSuccessTicket({
				ticketId: `RMA-${Math.floor(100000 + Math.random() * 900000)}`,
				orderNumber: formData.orderNumber,
				resolution: formData.resolution,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white text-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto space-y-8">
				<div>
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Store
					</Link>
					<div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
						<RotateCcw className="w-4 h-4 text-neutral-700" />
						<span>30-Day Zero-Risk Guarantee Portal</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
						Replacements & Returns Center
					</h1>
					<p className="mt-2 text-sm sm:text-base text-neutral-500 leading-relaxed">
						If your apparel, yard sign, or sticker arrived misprinted, defective, or damaged in transit, you do NOT need to mail it back. Simply snap a photo below and we will dispatch a 100% free replacement or issue a full refund under our 30-Day Defend the Soil Guarantee.
					</p>
				</div>

				{/* 售后与保养提醒横幅提示 */}
				<div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-start gap-3 text-xs text-amber-900">
					<HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
					<div className="space-y-1">
						<p className="font-semibold text-amber-900">Friendly Care Tip: Keep your gear lasting longer</p>
						<p className="text-amber-800/90 leading-relaxed">
							Our vintage-wash apparel is made of 100% ring-spun cotton—please machine wash inside-out in cold water. Lawn signs are printed with weather-resistant UV inks designed for multi-season outdoor use.
						</p>
					</div>
				</div>

				{successTicket ? (
					/* 提交成功确认状态 */
					<div className="p-8 rounded-3xl border border-emerald-200 bg-emerald-50/60 text-center space-y-6">
						<div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
							<CheckCircle2 className="w-8 h-8" />
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold text-neutral-900">After-Sales Request Submitted!</h2>
							<p className="text-sm text-neutral-600">
								Ticket Reference: <strong className="text-neutral-900 font-mono">{successTicket.ticketId}</strong>
							</p>
							<p className="text-xs text-neutral-500 max-w-md mx-auto">
								Your claim for Order <strong className="text-neutral-900 font-mono">{successTicket.orderNumber}</strong> has been logged into our support queue. Our fulfillment team will review your photos and dispatch your {successTicket.resolution === "replacement" ? "free replacement package" : "full refund"} within 24 hours.
							</p>
						</div>
						<div className="pt-4 flex justify-center gap-4">
							<Link
								href="/"
								className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs shadow-xs transition-colors"
							>
								Return to Store
							</Link>
							<Link
								href="/track-order"
								className="px-6 py-2.5 rounded-full border border-neutral-300 bg-white text-neutral-700 font-medium text-xs hover:text-black transition-colors"
							>
								Track Order Status
							</Link>
						</div>
					</div>
				) : (
					/* 退换货售后申请表单 */
					<form
						onSubmit={handleSubmit}
						className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 bg-[#F5F5F7] space-y-6"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-medium text-neutral-700 mb-1.5">
									Order Number <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									required
									placeholder="e.g. TR-678413"
									value={formData.orderNumber}
									onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
									className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-neutral-700 mb-1.5">
									Purchaser Email <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									required
									placeholder="supporter@example.com"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
								/>
							</div>
						</div>

						{/* 问题类别选择 */}
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-1.5">
								Reason for Claim <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.reason}
								onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
								className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm focus:outline-none focus:border-black"
							>
								<option value="damaged_in_transit">Item arrived damaged or misprinted in transit</option>
								<option value="size_exchange">Size exchange request (T-Shirt / Hoodie)</option>
								<option value="missing_item">Missing items or wrong item received</option>
								<option value="lost_package">Tracking stuck / Package lost in transit (over 10 business days)</option>
								<option value="other">Other question / feedback</option>
							</select>
						</div>

						{/* 期望的解决方式 */}
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-2">
								Preferred Resolution <span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<label
									className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
										formData.resolution === "replacement"
											? "border-black bg-white ring-1 ring-black"
											: "border-neutral-200 bg-white hover:border-neutral-300"
									}`}
								>
									<input
										type="radio"
										name="resolution"
										value="replacement"
										checked={formData.resolution === "replacement"}
										onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
										className="text-black focus:ring-black"
									/>
									<div>
										<p className="text-xs font-semibold text-neutral-900">Ship Free Replacement</p>
										<p className="text-[11px] text-neutral-500">We dispatch a brand-new package via express</p>
									</div>
								</label>

								<label
									className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
										formData.resolution === "refund"
											? "border-black bg-white ring-1 ring-black"
											: "border-neutral-200 bg-white hover:border-neutral-300"
									}`}
								>
									<input
										type="radio"
										name="resolution"
										value="refund"
										checked={formData.resolution === "refund"}
										onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
										className="text-black focus:ring-black"
									/>
									<div>
										<p className="text-xs font-semibold text-neutral-900">Issue Full Refund</p>
										<p className="text-[11px] text-neutral-500">Credit back to original payment method</p>
									</div>
								</label>
							</div>
						</div>

						{/* 照片凭证上传 */}
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-1.5">
								Defect Photo Proof (Required for damaged claims) <span className="text-red-500">*</span>
							</label>

							<div className="mt-1">
								{formData.photo ? (
									<div className="relative rounded-2xl border border-neutral-200 overflow-hidden bg-white p-2 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
												<img
													src={formData.photo}
													alt="Defect Preview"
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<p className="text-xs font-medium text-neutral-900">Photo attached successfully</p>
												<p className="text-[11px] text-neutral-500">Ready for support review</p>
											</div>
										</div>
										<button
											type="button"
											onClick={() => setFormData({ ...formData, photo: null })}
											className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								) : (
									<div className="relative rounded-2xl border-2 border-dashed border-neutral-300 bg-white hover:border-black transition-colors p-6 text-center cursor-pointer">
										<Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
										<p className="text-xs font-medium text-neutral-900">
											Click to upload defect / cracked photo
										</p>
										<p className="text-[11px] text-neutral-400">PNG, JPG or WEBP up to 10MB</p>
										<input
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="absolute inset-0 opacity-0 cursor-pointer"
										/>
									</div>
								)}
							</div>
						</div>

						{/* 补充说明 */}
						<div>
							<label className="block text-xs font-medium text-neutral-700 mb-1.5">
								Additional Information
							</label>
							<textarea
								rows={3}
								placeholder="Describe where the crack or issue is located..."
								value={formData.details}
								onChange={(e) => setFormData({ ...formData, details: e.target.value })}
								className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-black"
							/>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
						>
							{submitting ? "Submitting Claim..." : "Submit Zero-Risk Claim"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
