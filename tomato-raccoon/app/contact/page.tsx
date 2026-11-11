"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function ContactPage() {
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* 页面头部 */}
			<div className="mb-10">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-3">
					★ Direct Community Support
				</div>
				<h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3F20]">
					Contact Us
				</h1>
				<p className="mt-3 text-base sm:text-lg text-[#524B42] leading-relaxed">
					Have a question about your order, yard sign placement, sizing, or our mission to protect Virginia farmland? Send us a note below and a local team member will reply within 24 business hours.
				</p>
			</div>

			{/* 联系表单 */}
			{submitted ? (
				<div className="rounded-3xl border border-[#E5DDD0] bg-white p-8 text-center shadow-2xs">
					<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0E7] text-[#1E3F20]">
						<Check className="h-6 w-6" />
					</div>
					<h2 className="text-2xl font-bold tracking-tight text-[#1E3F20]">Message sent</h2>
					<p className="mt-2 text-sm text-[#524B42]">
						Thanks for reaching out! We&apos;ll get back to you within 24 business hours.
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-2xs">
					<div>
						<label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#1E1D1B]">
							Email
						</label>
						<input
							id="contact-email"
							type="email"
							name="email"
							placeholder="your@email.com"
							required
							className="mt-2 h-11 w-full rounded-xl border border-[#D9CDB8] bg-[#FAF7F0] px-4 text-sm text-[#1E1D1B] outline-none transition-all focus:bg-white focus:border-[#1E3F20]"
						/>
					</div>
					<div>
						<label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-[#1E1D1B]">
							Message
						</label>
						<textarea
							id="contact-message"
							name="message"
							placeholder="How can we help?"
							required
							rows={6}
							className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-[#FAF7F0] px-4 py-3 text-sm text-[#1E1D1B] outline-none transition-all focus:bg-white focus:border-[#1E3F20]"
						/>
					</div>
					<button
						type="submit"
						className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1E3F20] px-8 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#2D5A27] cursor-pointer"
					>
						<span>Send message</span>
						<ArrowRight className="h-4 w-4" />
					</button>
				</form>
			)}

			{/* 常见问题 (FAQ) 链接与直接联系信息 */}
			<div className="mt-12 pt-8 border-t border-[#E5DDD0] space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#524B42]">
					<div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E5DDD0]">
						<div className="font-bold text-[#1E3F20] mb-1">Direct Email Support</div>
						<p className="text-xs text-[#7C5335]">growtomatoes.service@outlook.com</p>
					</div>
					<div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E5DDD0]">
						<div className="font-bold text-[#1E3F20] mb-1">Response Guarantee</div>
						<p className="text-xs text-[#7C5335]">Within 24 hours (Mon - Fri)</p>
					</div>
				</div>

				<p className="text-sm text-[#524B42]">
					Looking for a quick answer? Check our{" "}
					<Link href="/faq" className="font-bold text-[#D93829] hover:underline">
						frequently asked questions
					</Link>{" "}
					or track your package at our{" "}
					<Link href="/track-order" className="font-bold text-[#D93829] hover:underline">
						order tracker
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
