import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContactForm } from "@/app/contact/contact-form";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { isStoreToolEnabled } from "@/lib/store-tools";

// `next dev` 和 `next build` 在此路由按请求实时渲染任何内容时都会报错（参见 AGENTS.md）。
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const description = `Get in touch with the ${storeName} team. Questions about orders, products, or anything else — we're here to help.`;

	return {
		title: "Contact Us",
		description,
		alternates: { canonical: "/contact" },
		openGraph: {
			type: "website",
			title: "Contact Us",
			description,
			url: "/contact",
		},
	};
}

const contactJsonLd = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Us",
	description: "Get in touch with our team. Questions about orders, products, or anything else.",
};

// 已列出的地址仍会完整预渲染（边界在构建时解析，因此不显示 fallback）。后续新增的地址
// 会在预渲染的外壳后以流式加载，因此其 notFound() 会在布局内渲染 404 页面，
// 而不是渲染空白的纯文本错误文档。
export default function ContactPage() {
	return (
		<Suspense fallback={null}>
			<ContactPageContent />
		</Suspense>
	);
}

async function ContactPageContent() {
	"use cache";
	cacheLife("minutes");

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={contactJsonLd} />

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
			<ContactForm />

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
					</Link>
					{" "}or track your package at our{" "}
					<Link href="/track-order" className="font-bold text-[#D93829] hover:underline">
						order tracker
					</Link>.
				</p>
			</div>
		</div>
	);
}
