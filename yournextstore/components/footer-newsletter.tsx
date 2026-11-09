"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

/**
 * 页脚邮件订阅组件 (Footer Newsletter)
 * 采用极简设计，支持邮箱输入验证与提交成功状态切换
 */
export function FooterNewsletter() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !email.includes("@")) return;

		setStatus("submitting");
		// 模拟提交过程（后续可接入真实的邮件营销平台或后端 API）
		setTimeout(() => {
			setStatus("success");
			setEmail("");
		}, 400);
	};

	if (status === "success") {
		return (
			<div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2">
				<Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
				<span>Thanks for subscribing! Check your inbox soon.</span>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
			<div className="flex items-center gap-1.5">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
					required
					className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
				/>
				<button
					type="submit"
					disabled={status === "submitting"}
					aria-label="Subscribe to newsletter"
					className="px-3 py-2 text-xs font-medium bg-black text-white hover:bg-neutral-800 active:scale-95 transition-all rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
				>
					<ArrowRight className="w-3.5 h-3.5" />
				</button>
			</div>
			<p className="text-[11px] text-neutral-400 leading-tight">
				No spam. Early drop alerts & secret discounts only.
			</p>
		</form>
	);
}
