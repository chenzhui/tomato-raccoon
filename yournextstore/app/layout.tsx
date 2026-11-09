import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { SearchInput } from "@/components/search/search-input";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// 仅在聊天和代码块中渲染，因此按需加载，避免阻塞首次绘制。
	preload: false,
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "Your next e-commerce store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";
	// 平台的 favicon 为上传的原始图片（此处为 500x500 PNG）。通过
	// 图像优化器路由，使浏览器从同源仅获取几 KB 的体积，而不是直接请求 blob 主机。
	const iconUrl = (size: number) =>
		getImageProps({ src: faviconUrl, width: size, height: size, alt: "" }).props.src;
	const storeLogo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || storeLogo || "/logo.svg";

	return {
		title: {
			default: storeName,
			template: `%s — ${storeName}`,
		},
		description: storeDescription,
		applicationName: storeName,
		// 特意不在此处设置 alternates.canonical：Next.js 会将其继承到每个未单独设置 canonical 的页面中，
		// 这会静默地将这些页面声明为首页的重复副本。首页的 canonical 链接已在 app/page.tsx 中单独设置。
		openGraph: {
			type: "website",
			siteName: storeName,
			title: storeName,
			description: storeDescription,
			url: "/",
			images: [{ url: ogImage, alt: storeName }],
		},
		twitter: {
			card: "summary_large_image",
			title: storeName,
			description: storeDescription,
			images: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		icons: {
			// 不指定 type：URL 是管理员上传的资源且优化器会自动协商格式，
			// 若对 PNG 声明 image/svg+xml 会导致 Chrome 丢弃图标。
			icon: [{ url: iconUrl(64), sizes: "64x64" }],
			// iOS 在此处需要 PNG 格式（优化器会协商成 WebP），因此保留原始地址供主屏幕图标使用。
			apple: [{ url: faviconUrl, sizes: "180x180" }],
		},
		manifest: "/manifest.webmanifest",
	};
}

export async function generateMetadata(): Promise<Metadata> {
	const metadata = await getStoreMetadata();
	// URL 实例无法跨越 "use cache" 的序列化边界，
	// 因此 metadataBase 附着在缓存作用域外部（仅依赖环境变量，无 I/O 操作）。
	return { ...metadata, metadataBase: new URL(getCanonicalUrl()) };
}

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	// 遵循苹果极简美学：顶栏仅保留核心业务入口（Products 与 Support）
	// 主页由左侧品牌 Logo 直达，其余细项统一归整于 Support 中心与页脚
	return [
		{ href: "/products", label: "Products" },
		{ href: "/support", label: "Support" },
	];
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// 此处仅进行带缓存的读取操作。等待任何请求时数据（cookies、headers）都会导致
	// 页头、导航和页脚脱离预渲染外壳（shell），在服务器响应前页面将保持空白；
	// CartProvider 会在浏览器端加载购物车。规则的另一部分：该组件外部也绝不能包裹
	// <Suspense> —— 边界本身会将外壳框架流式推送到 shell 之外，无论其内部是否有请求时数据。
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col bg-white text-neutral-900">
					{/* 苹果风格极简悬浮毛玻璃顶栏（纯净白底高透） */}
					<header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="relative flex items-center justify-between h-12 sm:h-14">
								<div className="flex items-center gap-3">
									<Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity">
										<span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm">
											AI
										</span>
										<span className="text-neutral-900 text-sm font-semibold tracking-tight">
											AI-Chan <span className="text-neutral-500 font-normal text-xs ml-0.5">Studio</span>
										</span>
									</Link>
									<Navbar links={links} />
								</div>
								<div className="flex items-center gap-1.5 sm:gap-2">
									<Suspense>
										<SearchInput />
									</Suspense>
									<CartButton />
								</div>
							</div>
						</div>
					</header>
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
				<CartSidebar />
			</CartProvider>
		</StoreConfigProvider>
	);
}

// 店铺语言由平台决定：启用后为默认语言，否则为店铺自身语言。
async function getHtmlLang(): Promise<string> {
	const { locale } = await getStoreConfig();
	return locale.split("-")[0] || "en";
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// 在非 Vercel 环境下 VERCEL_ENV 未设置，因此回退到 NODE_ENV：自托管的生产构建绝不能包含 builder 开发工具。
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
	const lang = await getHtmlLang();

	return (
		// suppressHydrationWarning：next-themes 在水合前就会在 <html> 上设置主题类名。
		<html lang={lang} suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Toaster richColors position="top-center" />
				</ThemeProvider>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
			</body>
		</html>
	);
}
