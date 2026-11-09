import { cacheLife } from "next/cache";
import Image from "next/image";
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
		<footer className="border-t border-[#E5DDD0] bg-[#F4EFE6] text-[#524B42]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-8">
					{/* 第 1 列：品牌介绍 */}
					<div className="space-y-4">
						<Link href="/" className="inline-flex items-center gap-2.5 text-sm font-serif font-bold text-[#1E3F20] tracking-tight">
							<span className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#D9CDB8] flex items-center justify-center p-0.5 shadow-xs shrink-0 overflow-hidden">
								<Image
									src="/images/raccoon-tomato.svg"
									alt="Tomato Raccoon"
									width={32}
									height={32}
									className="w-full h-full object-contain"
								/>
							</span>
							<span className="text-base font-serif font-black">Tomato Raccoon Co.</span>
						</Link>
						<p className="text-xs sm:text-sm text-[#524B42] leading-relaxed font-serif">
							Grow Tomatoes, Not Data Centers. Handcrafted goods defending Virginia farmland, clean aquifers, and independent community growers.
						</p>
						<div className="flex items-center gap-2 text-xs text-[#1E3F20] font-serif font-medium">
							<ShieldCheck className="w-4 h-4 text-[#D93829]" />
							<span>100% Grassroots Advocacy</span>
						</div>
					</div>

					{/* 第 2 列：客户服务 (Support) */}
					<div>
						<h3 className="text-xs font-serif font-bold text-[#1E3F20] uppercase tracking-wider">Support & Care</h3>
						<ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-serif">
							<li>
								<Link href="/track-order" className="text-[#1E1D1B] hover:text-[#D93829] font-medium transition-colors">
									Track Package (USPS)
								</Link>
							</li>
							<li>
								<Link href="/returns" className="text-[#1E1D1B] hover:text-[#D93829] font-medium transition-colors">
									30-Day Defend the Soil Guarantee
								</Link>
							</li>
							<li>
								<Link href="/faq" className="hover:text-[#D93829] transition-colors">
									Lawn Sign &amp; Care FAQ
								</Link>
							</li>
							<li>
								<Link href="/about" className="hover:text-[#D93829] transition-colors">
									The Hanover Movement
								</Link>
							</li>
						</ul>
					</div>

					{/* 第 3 列：法律条款 (Legal) */}
					<div>
						<h3 className="text-xs font-serif font-bold text-[#1E3F20] uppercase tracking-wider">Community Trust</h3>
						<ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-serif">
							<li>
								<Link href="/privacy-policy" className="hover:text-[#D93829] transition-colors">
									Privacy (Zero Data Brokers)
								</Link>
							</li>
							<li>
								<Link href="/terms-of-service" className="hover:text-[#D93829] transition-colors">
									Terms of Advocacy
								</Link>
							</li>
							<li>
								<Link href="/shipping-policy" className="hover:text-[#D93829] transition-colors">
									Plastic-Free Eco Shipping
								</Link>
							</li>
							<li>
								<Link href="/refund-policy" className="hover:text-[#D93829] transition-colors">
									Refund &amp; Return Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* 第 4 列：关注我们 (Follow Us) */}
					<div>
						<h3 className="text-xs font-serif font-bold text-[#1E3F20] uppercase tracking-wider">The Movement</h3>
						<p className="mt-1.5 text-xs text-[#7C5335] font-serif">
							Join neighbors spreading the word:
						</p>
						<ul className="mt-3.5 space-y-2 text-xs sm:text-sm">
							<li>
								<a
									href="https://tiktok.com"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2.5 text-[#1E1D1B] hover:text-[#D93829] transition-colors group p-1.5 -mx-1.5 rounded-xl hover:bg-[#EAE4D7]"
								>
									<div className="w-7 h-7 rounded-full bg-white border border-[#D9CDB8] flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#D93829] transition-colors">
										<TikTokIcon className="w-3.5 h-3.5 text-[#1E3F20] group-hover:text-[#D93829] transition-colors" />
									</div>
									<div>
										<div className="font-serif font-bold text-[#1E1D1B] group-hover:text-[#D93829] transition-colors text-xs">TikTok</div>
										<div className="text-[10px] text-[#7C5335]">#growtomatoesnotdatacenters</div>
									</div>
								</a>
							</li>
							<li>
								<a
									href="https://youtube.com"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2.5 text-[#1E1D1B] hover:text-[#D93829] transition-colors group p-1.5 -mx-1.5 rounded-xl hover:bg-[#EAE4D7]"
								>
									<div className="w-7 h-7 rounded-full bg-white border border-[#D9CDB8] flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#D93829] transition-colors">
										<YouTubeIcon className="w-3.5 h-3.5 text-[#1E3F20] group-hover:text-[#D93829] transition-colors" />
									</div>
									<div>
										<div className="font-serif font-bold text-[#1E1D1B] group-hover:text-[#D93829] transition-colors text-xs">YouTube</div>
										<div className="text-[10px] text-[#7C5335]">Hanover Farm Stories</div>
									</div>
								</a>
							</li>
						</ul>
					</div>

					{/* 第 5 列：邮件订阅 (Newsletter - 独占最右侧) */}
					<div>
						<h3 className="text-xs font-serif font-bold text-[#1E3F20] uppercase tracking-wider">Farm Dispatch</h3>
						<p className="mt-1.5 text-xs text-[#524B42] leading-relaxed font-serif">
							Join 15,000+ neighbors protecting local soil. Get grassroots updates &amp; restock alerts.
						</p>
						<FooterNewsletter />
					</div>
				</div>

				{/* 底部版权与支付信息栏 */}
				<div className="py-8 border-t border-[#D9CDB8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C5335] font-serif">
					<p>&copy; {year} Tomato Raccoon Supply Co. Born in Hanover County, VA. Defending local soil and clean water.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
