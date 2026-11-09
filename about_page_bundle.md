This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: tomato-raccoon/app/about/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
tomato-raccoon/
  app/
    about/
      page.tsx
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="tomato-raccoon/app/about/page.tsx">
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Droplets, Sprout } from "lucide-react";

export const metadata: Metadata = {
	title: "About Us — Tomato Raccoon Supply Co.",
	description:
		"An independent design studio inspired by Virginia's countryside humor and the movement to protect farmland and clean water.",
	alternates: { canonical: "/about" },
};

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			{/* 面包屑导航 */}
			<div className="mb-8 flex items-center gap-2 text-xs text-[#7C5335]">
				<Link href="/" className="hover:text-[#1E3F20] transition-colors">
					Home
				</Link>
				<span>/</span>
				<span className="font-bold text-[#1E3F20]">About</span>
			</div>

			{/* 标题宣言 */}
			<div className="space-y-4 mb-16">
				<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] text-xs font-bold uppercase tracking-wider">
					🦝 Independent Design &amp; Merch Studio
				</div>
				<h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1E3F20] leading-tight">
					Grow Tomatoes. <br />
					<span className="text-[#D93829]">Not Data Centers.</span>
				</h1>
				<p className="text-lg sm:text-xl text-[#524B42] leading-relaxed">
					Inspired by a hand-painted roadside sign in Virginia, we turn grassroots countryside humor into everyday gear for anyone who prefers fresh air and farmland over server farms.
				</p>
			</div>

			{/* 核心大图展示 */}
			<div className="relative aspect-16/9 w-full rounded-3xl bg-[#F4EFE6] border border-[#D9CDB8] overflow-hidden mb-16 flex items-center justify-center p-8 shadow-xs">
				<div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center">
					<Image
						src="/images/logo-1-raccoon-slogan.svg"
						alt="Tomato Raccoon Official Movement Badge"
						fill
						className="object-contain"
					/>
				</div>
			</div>

			{/* 深度故事段落 */}
			<div className="space-y-14 text-[#1E1D1B] leading-relaxed text-base sm:text-lg">
				{/* 篇章 1 */}
				<section className="space-y-4 border-t border-[#D9CDB8] pt-10">
					<span className="text-xs font-bold uppercase tracking-widest text-[#D93829]">Chapter 01</span>
					<h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
						The Soil That Feeds Virginia
					</h2>
					<p className="text-[#524B42]">
						For generations, Hanover County, Virginia has been famous for one thing above all: its summer heirloom tomatoes. Sweet, juicy, and sun-ripened in fertile Piedmont dirt, they are celebrated at annual festivals and enjoyed at kitchen tables across the Commonwealth.
					</p>
					<p className="text-[#524B42]">
						Then came the data centers. Virginia quietly became the data center capital of the world, housing over 35% of all hyperscale cloud infrastructure on Earth. But when the tech giants ran out of room in Northern Virginia, their bulldozers turned south toward Hanover's agricultural heartland.
					</p>
				</section>

				{/* 篇章 2 */}
				<section className="space-y-4 border-t border-[#D9CDB8] pt-10">
					<span className="text-xs font-bold uppercase tracking-widest text-[#D93829]">Chapter 02</span>
					<h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
						1,000,000 Gallons a Day
					</h2>
					<p className="text-[#524B42]">
						A single modern data center campus can consume upwards of <strong>one million gallons of water every single day</strong> simply to cool server racks running AI models. That is precious groundwater drawn straight from local regional aquifers — the very same water that irrigates family crops and fills residential well water for local homes.
					</p>
					<p className="text-[#524B42]">
						Along with massive high-voltage transmission lines cutting across timberlands and soaring residential electric rates to fund corporate substations, neighbors realized something vital was being traded away for corporate server farms.
					</p>
				</section>

				{/* 篇章 3 */}
				<section className="space-y-4 border-t border-[#D9CDB8] pt-10">
					<span className="text-xs font-bold uppercase tracking-widest text-[#D93829]">Chapter 03</span>
					<h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
						Enter The Raccoon
					</h2>
					<p className="text-[#524B42]">
						Faced with corporate lobby presentations and zoning hearings, one local family put up a hand-painted wooden sign along the roadside. It depicted the countryside's most resilient nighttime neighbor — a little trash panda raccoon — holding on fiercely to a giant, ripe Hanover tomato.
					</p>
					<p className="text-[#524B42]">
						Below it was a phrase that captured the humor, grit, and clarity of the countryside: <strong className="text-[#1E3F20]">"GROW TOMATOES, NOT DATA CENTERS."</strong>
					</p>
					<p className="text-[#524B42]">
						Photos of the sign exploded on local forums, Reddit, and community garden boards. Neighbors asked for their own signs. Truck drivers honked in approval. A movement was born.
					</p>
				</section>

				{/* 篇章 4：安全且高转化的品牌定位 */}
				<section className="p-8 sm:p-10 rounded-3xl bg-[#F4EFE6] border border-[#D9CDB8] space-y-6">
					<h3 className="text-2xl font-bold text-[#1E3F20]">
						Wear the Message. Keep It Real.
					</h3>
					<p className="text-sm sm:text-base text-[#524B42]">
						We’re an independent design studio inspired by the folks standing up for rural land and local food systems. Whether you're in Virginia or watching data centers pop up in your own backyard, our goal is simple: make tough, comfortable, sustainably-made gear that starts a conversation wherever you go.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pt-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 font-bold text-[#1E1D1B]">
								<Sprout className="w-4 h-4 text-[#1E3F20]" />
								<span>Heavy-Duty &amp; Eco-Minded</span>
							</div>
							<p className="text-[#524B42]">
								Printed to order to eliminate warehouse waste. We use certified organic cotton canvas totes and Comfort Colors ring-spun cotton tees.
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2 font-bold text-[#1E1D1B]">
								<Droplets className="w-4 h-4 text-[#2E86AB]" />
								<span>Spark the Conversation</span>
							</div>
							<p className="text-[#524B42]">
								Every sticker on a tailgate and every tee at the farmers market helps spread awareness about protecting rural water and soil.
							</p>
						</div>
					</div>
					<div className="pt-4 border-t border-[#D9CDB8]">
						<Link
							href="/products"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E3F20] text-[#FAF7F0] font-bold text-sm hover:bg-[#2D5A27] transition-all"
						>
							<span>Shop the Collection</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
</file>

</files>
