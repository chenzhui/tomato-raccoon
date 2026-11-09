import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ProductGrid } from "@/components/sections/product-grid";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCollections, slugParams } from "@/lib/catalog-paths";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

const COLLECTION_PRODUCTS_LIMIT = 100;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const { storeName } = await getStoreSeo();
	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;
	const canonical = `/collection/${collection.slug}`;

	return {
		title: collection.name,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: collection.name,
			description,
			url: canonical,
			images: collection.image ? [{ url: collection.image, alt: collection.name }] : undefined,
		},
		twitter: {
			card: collection.image ? "summary_large_image" : "summary",
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 lg:py-20">
					<div className="max-w-2xl">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
							{collection.name}
						</h1>
						{/* API 会返回富文本格式（TipTap）；旧版本负载中为普通纯字符串。 */}
						{typeof collection.description === "string" ? (
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">{collection.description}</p>
						) : collection.description ? (
							<div className="prose mt-4 max-w-none text-lg text-muted-foreground leading-relaxed tiptap-content">
								<TiptapRenderer content={collection.description} />
							</div>
						) : null}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<YNSMedia
						src={collection.image}
						alt={collection.name}
						fill
						sizes="50vw"
						className="object-cover opacity-30"
						priority
						fetchPriority="high"
					/>
					<div className="absolute inset-0 bg-linear-to-r from-secondary/30 to-transparent" />
				</div>
			)}
		</section>
	);
}

// 平台负责解析合集内容：手动挑选的合集解析其成员商品，自动化合集按其规则解析，均按照
// 商家设置的排序顺序排列。该页面没有分页，因此渲染一整页；100 为 API 的最大限制。
async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.request<APIProductsBrowseResult>(
		`/collections/${encodeURIComponent(collection.slug)}/products`,
		{ query: { limit: COLLECTION_PRODUCTS_LIMIT } },
	);
	return data;
}

async function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = await getCollectionProducts(collection);

	return (
		<ProductGrid
			title={`${collection.name} Collection`}
			description={`${products.length} products`}
			products={products}
			showViewAll={false}
		/>
	);
}

// 所有已知地址都完整预渲染；后续新增的地址在首次访问时渲染（参见 lib/catalog-paths.ts）。
export const generateStaticParams = () => slugParams(getAllCollections(), (collection) => collection.slug);

// 尽管 SDK 标注了 | null 类型，但在 404 时实际上会抛出异常。如果不捕获并转为 null，
// !collection 分支将永远不会执行，未知的 slug 会带着错误页面返回 200 状态码。
const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

// 在构建后新增的地址会在首次请求时完整渲染后再发送内容，因此不存在的页面
// 会在布局内返回 404 状态码及未找到页面，而不是在已发送的外壳后返回 200 响应（参见 AGENTS.md）。
export const ensureStatic = "navigation";

// 已列出的地址完整预渲染：边界在构建时解析，因此绝不显示 fallback。
export default function CollectionPage(props: Parameters<typeof CollectionPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<CollectionPageContent {...props} />
		</Suspense>
	);
}

async function CollectionPageContent({ params }: { params: PageProps<"/collection/[slug]">["params"] }) {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{collection.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<CollectionHeader collection={collection} />
			<CollectionProducts collection={collection} />
		</>
	);
}
