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

	if (!(await isStoreToolEnabled("contactForm"))) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={contactJsonLd} />

			{/* 页面头部 */}
			<div className="mb-10">
				<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">Contact Us</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">Contact Us</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we
					can.
				</p>
			</div>

			{/* 联系表单 */}
			<ContactForm />

			{/* 常见问题 (FAQ) 链接 */}
			<p className="mt-10 text-sm text-muted-foreground">
				Looking for a quick answer? Check our{" "}
				<Link href="/faq" className="font-medium text-foreground hover:underline">
					frequently asked questions
				</Link>
				.
			</p>
		</div>
	);
}
