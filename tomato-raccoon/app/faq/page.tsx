import { Mail, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";

export const metadata: Metadata = {
	title: "FAQ — Tomato Raccoon Supply Co.",
	description: "Frequently asked questions about orders, payments, shipping, and returns at Tomato Raccoon Supply Co.",
	alternates: { canonical: "/faq" },
};

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="rounded-full border border-[#D9CDB8] bg-white px-4 py-2 text-xs font-bold text-[#524B42] transition-colors hover:border-[#1E3F20] hover:text-[#1E3F20]"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="scroll-mt-24">
			<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E3F20] mb-4">{category.title}</h2>
			<div className="divide-y divide-[#E5DDD0] rounded-2xl border border-[#E5DDD0] bg-white px-6">
				{category.questions.map((item, index) => (
					<details key={`${category.id}-${index}`} className="group py-4">
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#1E1D1B] hover:text-[#D93829] transition-colors">
							<span>{item.question}</span>
							<ChevronDown className="h-4 w-4 shrink-0 text-[#7C5335] transition-transform duration-200 group-open:rotate-180" />
						</summary>
						<p className="mt-3 text-xs sm:text-sm text-[#524B42] leading-relaxed">{item.answer}</p>
					</details>
				))}
			</div>
		</section>
	);
}

function ContactCard() {
	return (
		<div className="rounded-3xl border border-[#E5DDD0] bg-[#F4EFE6] p-8 text-center">
			<h2 className="text-2xl font-bold tracking-tight text-[#1E3F20]">Still have questions?</h2>
			<p className="mt-2 text-sm text-[#524B42]">
				We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
			</p>
			<div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#D93829]">
				<Mail className="h-4 w-4" />
				<a href="mailto:growtomatoes.service@outlook.com" className="hover:underline">
					growtomatoes.service@outlook.com
				</a>
			</div>
		</div>
	);
}

export default function FAQPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* 页面头部 */}
			<div className="mb-10">
				<Link href="/support" className="text-xs font-bold text-[#7C5335] hover:text-[#1E3F20] transition-colors">
					Support
				</Link>
				<span className="mx-2 text-xs text-[#7C5335]">/</span>
				<span className="text-xs font-bold text-[#1E3F20]">FAQ</span>
				<h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#1E3F20]">Frequently Asked Questions</h1>
				<p className="mt-3 text-sm sm:text-base text-[#524B42]">
					Find answers to the most common questions about your orders, payments, shipping, and more.
				</p>
			</div>

			{/* 分类导航 */}
			<div className="mb-10">
				<CategoryNav categories={faqCategories} />
			</div>

			{/* 常见问题解答区域 */}
			<div className="space-y-12">
				{faqCategories.map((category) => (
					<FAQSection key={category.id} category={category} />
				))}
			</div>

			{/* 联系卡片 */}
			<div className="mt-16">
				<ContactCard />
			</div>
		</div>
	);
}
