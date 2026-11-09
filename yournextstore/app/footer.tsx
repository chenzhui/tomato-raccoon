import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { ShieldCheck, Terminal } from "lucide-react";

async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-white/10 bg-black text-neutral-400">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* 品牌介绍 */}
					<div className="space-y-4">
						<Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold text-white tracking-tight">
							<span className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center text-[10px] font-black">
								AI
							</span>
							<span>AI-Chan Studio</span>
						</Link>
						<p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
							Stop Coding Alone. Bring your favorite LLM companions to your desk. High-end optical acrylic collectibles for developers.
						</p>
						<div className="flex items-center gap-2 text-xs text-neutral-300">
							<ShieldCheck className="w-4 h-4 text-neutral-400" />
							<span>100% Trademark Compliant Parody Merch</span>
						</div>
					</div>

					{/* 黄金 5 大模型角色 */}
					<div>
						<h3 className="text-xs font-semibold text-white uppercase tracking-wider">Lineup</h3>
						<ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
							<li>
								<Link href="/product/whale-chan-r1-standee" className="hover:text-white transition-colors">
									Whale-Chan (R1 Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/sonnet-tan-35-standee" className="hover:text-white transition-colors">
									Sonnet-Tan (3.5 Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/omni-chan-4o-standee" className="hover:text-white transition-colors">
									Omni-Chan (4o Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/rebel-tan-x-standee" className="hover:text-white transition-colors">
									Rebel-Tan (X Edition)
								</Link>
							</li>
							<li>
								<Link href="/product/twinstar-chan-standee" className="hover:text-white transition-colors">
									TwinStar-Chan (2M Edition)
								</Link>
							</li>
						</ul>
					</div>

					{/* 客户服务与支持 */}
					<div>
						<h3 className="text-xs font-semibold text-white uppercase tracking-wider">Support</h3>
						<ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
							<li>
								<Link href="/track-order" className="text-white hover:text-neutral-300 font-medium transition-colors">
									Track Package (USPS Direct)
								</Link>
							</li>
							<li>
								<Link href="/returns" className="text-white hover:text-neutral-300 font-medium transition-colors">
									30-Day Free Replacement
								</Link>
							</li>
							<li>
								<Link href="/faq" className="hover:text-white transition-colors">
									Unboxing & Care FAQ
								</Link>
							</li>
							<li>
								<span className="text-neutral-500">Transit: 7-12 Days to US/EU</span>
							</li>
							<li>
								<span className="text-neutral-500">Contact: support@aichan-merch.com</span>
							</li>
						</ul>
					</div>

					{/* 法律合规与政策 */}
					<div>
						<h3 className="text-xs font-semibold text-white uppercase tracking-wider">Legal</h3>
						<ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
							<li>
								<Link href="/privacy-policy" className="hover:text-white transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/terms-of-service" className="hover:text-white transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/shipping-policy" className="hover:text-white transition-colors">
									Shipping Policy
								</Link>
							</li>
							<li>
								<Link href="/refund-policy" className="hover:text-white transition-colors">
									Refund & Return Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* 底部版权与支付信息栏 */}
				<div className="py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
					<p>&copy; {year} AI-Chan Studio. All rights reserved. Handcrafted for developers worldwide.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
