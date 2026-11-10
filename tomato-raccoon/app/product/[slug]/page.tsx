import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { sortVariantsByOptions } from "@/app/product/[slug]/variant-order";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { blurPreview } from "@/lib/blur-placeholder";
import { getAllProducts, slugParams } from "@/lib/catalog-paths";
import { commerce, meGetCached, productGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={cn("h-4 w-4", i < rounded ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")}
				/>
			))}
		</span>
	);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const product = await productGetCached(slug);

	if (!product) {
		return { title: "Product Not Found", robots: { index: false, follow: true } };
	}

	const seoTitle = product.seo?.title || product.name;
	const seoDescription = product.seo?.description || product.summary || undefined;
	const canonical = product.seo?.canonical || `/product/${product.slug}`;
	const image = product.images?.[0];

	return {
		title: seoTitle,
		description: seoDescription,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: seoTitle,
			description: seoDescription,
			url: canonical,
			images: image ? [{ url: image, alt: product.name }] : undefined,
		},
		twitter: {
			card: image ? "summary_large_image" : "summary",
			title: seoTitle,
			description: seoDescription,
			images: image ? [image] : undefined,
		},
	};
}

// 所有已知地址都完整预渲染；后续新增的地址在首次访问时渲染（参见 lib/catalog-paths.ts）。
export const generateStaticParams = () => slugParams(getAllProducts(), (product) => product.slug);

const getProductPageData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");

	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;
	const restockNotificationsEnabled = me?.store.settings?.enabledTools?.restockNotifications ?? false;
	const [product, reviews] = await Promise.all([
		productGetCached(slug),
		reviewsEnabled
			? commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }).catch(() => null)
			: Promise.resolve(null),
	]);
	// SDK 仅向商品下发 brand id；未激活的品牌不予展示。
	const brand = product?.brandId
		? await commerce.brandGet({ idOrSlug: product.brandId }).catch(() => null)
		: null;

	return {
		product,
		reviews,
		restockNotificationsEnabled,
		brand: brand?.active ? { name: brand.name, slug: brand.slug } : null,
	};
};

// 在构建后新增的地址会在首次请求时完整渲染后再发送内容，因此不存在的商品
// 会在布局内返回 404 状态码及未找到页面，而不是在已发送的外壳后返回 200 响应（参见 AGENTS.md）。
export const ensureStatic = "navigation";

// 已列出的地址完整预渲染：边界在构建时解析，因此绝不显示 fallback。
export default function ProductPage(props: Parameters<typeof ProductPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<ProductPageContent {...props} />
		</Suspense>
	);
}

async function ProductPageContent({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled, brand } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;
	const variants = sortVariantsByOptions(product.variants);

	// 顾客可选择的订阅方案，按商家设定的顺序排列。productGet 也会返回未激活方案，
	// 购物车接口会拒绝未激活的方案。
	const plans = (product.subscriptionPlanProducts ?? [])
		.map(({ subscriptionPlan }) => subscriptionPlan)
		.filter((plan) => plan.active)
		.sort((a, b) => a.position - b.position)
		.map(({ id, name, discountPercent, benefits }) => ({ id, name, discountPercent, benefits }));

	const allImages = [
		...product.images,
		...variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const [productJsonLd, preview] = await Promise.all([
		buildProductJsonLd(product, reviews, brand?.name ?? null),
		blurPreview(allImages[0]),
	]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{variants[0] && <TrackProductView variant={variants[0]} name={product.name} />}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/products" />}>Products</BreadcrumbLink>
					</BreadcrumbItem>
					{product.category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href={`/category/${product.category.slug}`} />}>
									{product.category.name}
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				{/* 左侧：图片画廊（桌面端粘性吸顶） */}
				<MediaGallery images={allImages} productName={product.name} variants={variants} preview={preview} />

				{/* 右侧：商品详情信息 */}
				<div className="mt-8 lg:mt-0 space-y-8">
					{/* 标题与评价概览 */}
					<div className="space-y-3">
						{brand && (
							<Link
								href={`/products?brand=${encodeURIComponent(brand.slug)}`}
								className="inline-flex min-h-6 items-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
							>
								{brand.name}
							</Link>
						)}
						<h1 className="text-4xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
							{product.name}
						</h1>
						{reviewSummary && reviewSummary.reviewCount > 0 && (
							<a
								href="#reviews"
								className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
							>
								<StarRow rating={reviewSummary.averageRating} />
								<span className="font-medium">{reviewSummary.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground underline-offset-4 hover:underline">
									({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
								</span>
							</a>
						)}
					</div>

					{/* 可配置捆绑包 → 分组构建器；否则使用标准变体加购按钮。
					    仅对捆绑包商品渲染，因此在常规商品店铺中保持静默。 */}
					{product.type === "bundle" && product.bundle?.groups?.length ? (
						<BundleBuilder
							bundleId={product.id}
							bundle={product.bundle}
							pricing={{
								mode: product.bundlePriceMode,
								fixedPriceAmount: product.bundleFixedPriceAmount,
								fixedPriceAmountGross: product.bundleFixedPriceAmountGross,
								amountOffAmount: product.bundleAmountOffAmount,
								amountOffAmountGross: product.bundleAmountOffAmountGross,
							}}
						/>
					) : (
						<AddToCartButton
							variants={variants}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images,
							}}
							summary={product.summary}
							volumePricingTiers={product.volumePricingTiers}
							restockNotificationsEnabled={restockNotificationsEnabled}
							subscriptionMode={product.subscriptionMode}
							plans={plans}
						/>
					)}

					{/* 购买信任与安心售后微徽章 (Trust Badges) */}
					<div className="pt-4 border-t border-[#E5DDD0] space-y-2.5 text-xs text-[#524B42] ">
						<div className="flex items-center gap-2.5">
							<span className="w-5 h-5 rounded-full bg-[#E8F0E7] flex items-center justify-center text-[#1E3F20] shrink-0 text-xs">🚚</span>
							<span><strong className="text-[#1E1D1B] font-bold">Fast USPS Priority:</strong> 3-5 business days across US in 100% recyclable paper mailers.</span>
						</div>
						<div className="flex items-center gap-2.5">
							<span className="w-5 h-5 rounded-full bg-[#F7ECE8] flex items-center justify-center text-[#D93829] shrink-0 text-xs">🛡️</span>
							<span><strong className="text-[#1E1D1B] font-bold">30-Day Soil Guarantee:</strong> Transit damage or missing stake? Instant free reship.</span>
						</div>
						<div className="flex items-center gap-2.5">
							<span className="w-5 h-5 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#7C5335] shrink-0 text-xs">🔒</span>
							<span><strong className="text-[#1E1D1B] font-bold">Safe Checkout:</strong> 256-bit encrypted checkout with Apple Pay &amp; Stripe.</span>
						</div>
					</div>
				</div>
			</div>

			{/* 详细描述（首屏下方，全宽展开） */}
			{product.content && (
				<section className="mt-16 border-t border-border pt-12">
					<h2 className="mb-6 text-2xl font-medium tracking-tight">Product details</h2>
					<div className="prose prose-sm max-w-none text-neutral-600">
						{typeof product.content === "string" ? (
							<div dangerouslySetInnerHTML={{ __html: product.content }} />
						) : (
							<p>{product.summary}</p>
						)}
					</div>
				</section>
			)}

			{/* 商品评价区域 */}
			{reviews && <ProductReviews reviews={reviews} productId={product.id} />}

			{/* 商品特色区域（下方全宽展示，自适应品类工艺） */}
			<ProductFeatures
				category={
					product.category && typeof product.category === "object"
						? product.category.name
						: typeof product.category === "string"
							? product.category
							: "Apparel"
				}
			/>

			{/* 推荐关联商品（已关闭以保持美式精品极简调性） */}
		</div>
	);
}
