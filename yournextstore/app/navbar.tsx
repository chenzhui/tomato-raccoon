"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* 移动端汉堡菜单触发器 */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					aria-label="Open menu"
					className="-order-1 rounded-full p-2 transition-colors hover:bg-white/10 lg:hidden text-neutral-400 hover:text-white"
				>
					<Menu className="h-5 w-5" />
				</SheetTrigger>
				<SheetContent side="left" className="gap-0 overflow-y-auto p-6 bg-black/95 border-r border-white/10 text-white">
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="mt-4">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-6 flex flex-col gap-1">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:text-white hover:bg-white/5"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>

			{/* 苹果官网风格：居中悬浮极简导航链接 */}
			<nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 items-center gap-7">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="text-xs font-normal text-neutral-400 hover:text-white transition-colors tracking-tight whitespace-nowrap"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
