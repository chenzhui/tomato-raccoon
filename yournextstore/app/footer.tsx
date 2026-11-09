import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { ShieldCheck, Sparkles, Terminal } from "lucide-react";

async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-slate-800 bg-[#06080e] text-slate-400">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* 品牌介绍 */}
					<div className="space-y-4">
						<Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white tracking-tight">
							<Terminal className="w-5 h-5 text-cyan-400" />
							<span>AI-Chan Geek Merch</span>
						</Link>
						<p className="text-sm text-slate-400 leading-relaxed">
							Stop Coding Alone. Bring Your Favorite LLM Waifu to Your Desk. High-end acrylic standees and collectibles for developers.
						</p>
						<div className="flex items-center gap-2 text-xs text-cyan-400">
							<ShieldCheck className="w-4 h-4" />
							<span>100% Trademark Compliant Parody Merch</span>
						</div>
					</div>

					{/* 黄金 5 大模型角色 */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Golden 5 Models</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link href="/product/whale-chan-r1-standee" className="hover:text-cyan-400 transition-colors">
									Whale-Chan (R1 Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/sonnet-tan-35-standee" className="hover:text-cyan-400 transition-colors">
									Sonnet-Tan (3.5 Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/omni-chan-4o-standee" className="hover:text-cyan-400 transition-colors">
									Omni-Chan (4o Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/rebel-tan-x-standee" className="hover:text-cyan-400 transition-colors">
									Rebel-Tan (X Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/twinstar-chan-standee" className="hover:text-cyan-400 transition-colors">
									TwinStar-Chan (2M Context)
								</Link>
							</li>
						</ul>
					</div>

					{/* 客户服务与支持 */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Customer Care</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link href="/track-order" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
									📦 Track Package (USPS)
								</Link>
							</li>
							<li>
								<Link href="/returns" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
									🛡️ 30-Day Free Replacement
								</Link>
							</li>
							<li>
								<Link href="/faq" className="hover:text-cyan-400 transition-colors">
									❓ Unboxing & Care FAQ
								</Link>
							</li>
							<li>
								<span className="text-slate-400">Delivery: 7-12 Days to US/EU</span>
							</li>
							<li>
								<span className="text-slate-400">Email: support@aichan-merch.com</span>
							</li>
						</ul>
					</div>

					{/* 法律合规与政策 */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider">Trust & Policies</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link href="/privacy-policy" className="hover:text-cyan-400 transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/terms-of-service" className="hover:text-cyan-400 transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/shipping-policy" className="hover:text-cyan-400 transition-colors">
									Shipping Policy
								</Link>
							</li>
							<li>
								<Link href="/refund-policy" className="hover:text-cyan-400 transition-colors">
									Refund & Return Policy (30 Days)
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* 底部版权与支付信息栏 */}
				<div className="py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
					<p>&copy; {year} AI-Chan Geek Merch. All rights reserved. Built for developers worldwide.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
