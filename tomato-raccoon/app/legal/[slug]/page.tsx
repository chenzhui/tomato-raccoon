import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { getAllLegalPages, slugParams } from "@/lib/catalog-paths";
import { commerce, getStoreSeo } from "@/lib/commerce";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const { slug } = await params;
	const page = await getLegalPage(slug);

	if (!page) {
		return { title: "Page Not Found", robots: { index: false, follow: true } };
	}

	const canonical = `/legal${page.href}`;
	const { storeName } = await getStoreSeo();

	return {
		title: page.label,
		description: `Read the ${page.label} for ${storeName}.`,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title: page.label,
			url: canonical,
		},
	};
}

// 所有已知地址都完整预渲染；后续新增的地址在首次访问时渲染（参见 lib/catalog-paths.ts）。
export const generateStaticParams = () =>
	slugParams(getAllLegalPages(), (page) => page.path.split("/").filter(Boolean).at(-1) ?? "");

// SDK 在 404 时会抛出异常。如果不捕获并转为 null，!page 分支将永远
// 不会执行，未知的 slug 会带着错误页面返回 200 状态码。
const getLegalPage = async (slug: string) => {
	"use cache";
	cacheLife("hours");
	const [error, page] = await try_(commerce.legalPageGet(slug));
	return error ? null : page;
};

// 在构建后新增的地址会在首次请求时完整渲染后再发送内容，因此不存在的页面
// 会在布局内返回 404 状态码及未找到页面，而不是在已发送的外壳后返回 200 响应（参见 AGENTS.md）。
export const ensureStatic = "navigation";

// 已列出的地址完整预渲染：边界在构建时解析，因此绝不显示 fallback。
export default function LegalPage(props: Parameters<typeof LegalPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<LegalPageContent {...props} />
		</Suspense>
	);
}

async function LegalPageContent({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const page = await getLegalPage(slug);

	if (!page) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">{page.label}</h1>
			{page.contentHtml ? (
				<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
			) : (
				<p className="text-muted-foreground">No content available.</p>
			)}
		</div>
	);
}
