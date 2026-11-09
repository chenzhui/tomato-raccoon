import { Suspense } from "react";
import { CategoryView, categoryMetadata } from "@/app/category/[...slugs]/category-view";
import { getAllCategories, isStaticSlug, PLACEHOLDER_SLUG, withPlaceholder } from "@/lib/catalog-paths";

// 已知分类会完整预渲染（参见 lib/catalog-paths.ts）。此路由从不读取 query 参数：筛选条件和分页
// 会通过 `/category-filtered/…` 路由处理（参见 lib/listing-routes.ts），因此默认视图保持静态。
export async function generateStaticParams() {
	const categories = await getAllCategories().catch(() => []);
	const paths = categories
		.map((category) => category.path.split("/").filter(Boolean))
		.filter((path) => path.length > 0 && path.every(isStaticSlug));
	return withPlaceholder(paths, [PLACEHOLDER_SLUG]).map((slugs) => ({ slugs }));
}

export async function generateMetadata(props: PageProps<"/category/[...slugs]">) {
	const { slugs } = await props.params;
	return categoryMetadata(slugs);
}

// 在构建后新增的地址会在首次请求时完整渲染后再发送内容，因此不存在的分类
// 会在布局内返回 404 状态码及未找到页面，而不是在已发送的外壳后返回 200 响应（参见 AGENTS.md）。同时
// 也排除了在此处读取 query 的可能；客户端对带筛选或分页 URL 的访问仍会到达服务端。
export const ensureStatic = "navigation";

// 已列出的地址完整预渲染：边界在构建时解析，因此绝不显示 fallback。
export default function CategoryPage(props: Parameters<typeof CategoryPageContent>[0]) {
	return (
		<Suspense fallback={null}>
			<CategoryPageContent {...props} />
		</Suspense>
	);
}

async function CategoryPageContent(props: PageProps<"/category/[...slugs]">) {
	const { slugs } = await props.params;
	return <CategoryView slugs={slugs} filters={{}} />;
}
