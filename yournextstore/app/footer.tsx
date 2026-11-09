import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { ShieldCheck } from "lucide-react";

/**
 * YouTube 矢量图标
 */
function YouTubeIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
		</svg>
	);
}

/**
 * TikTok 矢量图标
 */
function TikTokIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
		</svg>
	);
}

async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-neutral-200 bg-[#F5F5F7] text-neutral-600">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* 品牌介绍 */}
					<div className="space-y-4">
						<Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold text-neutral-900 tracking-tight">
							<span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">
								AI
							</span>
							<span>AI-Chan Studio</span>
						</Link>
						<p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
							Stop Coding Alone. Bring your favorite LLM companions to your desk. High-end optical acrylic collectibles for developers.
						</p>
						<div className="flex items-center gap-2 text-xs text-neutral-600">
							<ShieldCheck className="w-4 h-4 text-neutral-500" />
							<span>100% Trademark Compliant Parody Merch</span>
						</div>
					</div>

					{/* 客户服务与条款 (Support & Legal) */}
					<div className="space-y-6">
						<div>
							<h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Support</h3>
							<ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
								<li>
									<Link href="/track-order" className="text-neutral-900 hover:text-blue-600 font-medium transition-colors">
										Track Package (USPS Direct)
									</Link>
								</li>
								<li>
									<Link href="/returns" className="text-neutral-900 hover:text-blue-600 font-medium transition-colors">
										30-Day Free Replacement
									</Link>
								</li>
								<li>
									<Link href="/faq" className="hover:text-black transition-colors">
										Unboxing & Care FAQ
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Legal</h3>
							<ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
								<li>
									<Link href="/privacy-policy" className="hover:text-black transition-colors">
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link href="/terms-of-service" className="hover:text-black transition-colors">
										Terms of Service
									</Link>
								</li>
								<li>
									<Link href="/shipping-policy" className="hover:text-black transition-colors">
										Shipping Policy
									</Link>
								</li>
								<li>
									<Link href="/refund-policy" className="hover:text-black transition-colors">
										Refund & Return Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* 关注我们 (Follow Us) */}
					<div>
						<h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Follow Us</h3>
						<p className="mt-1.5 text-xs text-neutral-500">
							Watch setups, unboxings & sneak peeks.
						</p>
						<ul className="mt-4 space-y-3 text-xs sm:text-sm">
							<li>
								<a
									href="https://youtube.com"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-neutral-700 hover:text-red-600 transition-colors group p-2 -mx-2 rounded-xl hover:bg-neutral-200/50"
								>
									<div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-xs group-hover:border-red-200 transition-colors">
										<YouTubeIcon className="w-4 h-4 text-neutral-800 group-hover:text-red-600 transition-colors" />
									</div>
									<div>
										<div className="font-medium text-neutral-900 group-hover:text-red-600 transition-colors">YouTube</div>
										<div className="text-[11px] text-neutral-400">@aichan_studio</div>
									</div>
								</a>
							</li>
							<li>
								<a
									href="https://tiktok.com"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-neutral-700 hover:text-black transition-colors group p-2 -mx-2 rounded-xl hover:bg-neutral-200/50"
								>
									<div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-xs group-hover:border-neutral-400 transition-colors">
										<TikTokIcon className="w-4 h-4 text-neutral-800 group-hover:text-black transition-colors" />
									</div>
									<div>
										<div className="font-medium text-neutral-900 group-hover:text-black transition-colors">TikTok</div>
										<div className="text-[11px] text-neutral-400">@aichan_merch</div>
									</div>
								</a>
							</li>
						</ul>
					</div>

					{/* 邮件订阅 (Newsletter - 独占最右侧) */}
					<div>
						<h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Newsletter</h3>
						<p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
							Subscribe to get early notifications on limited batch drops & secret discounts.
						</p>
						<FooterNewsletter />
					</div>
				</div>

				{/* 底部版权与支付信息栏 */}
				<div className="py-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
					<p>&copy; {year} AI-Chan Studio. All rights reserved. Handcrafted for developers worldwide.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
