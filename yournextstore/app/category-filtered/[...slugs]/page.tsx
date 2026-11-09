import { CategoryView, categoryMetadata } from "@/app/category/[...slugs]/category-view";
import { activeParams, CATEGORY_LISTING_PARAMS } from "@/lib/listing-routes";

// 带有筛选条件或页码的 `/category/…?…` 会被重写到此处（参见 lib/listing-routes.ts）。由于 query 参数
// 只有在请求时才能确定，因此页面在请求时完整渲染：导航跳转时会保持当前视图直至新内容就绪，无需骨架屏。
export const instant = false;

export async function generateMetadata(props: PageProps<"/category-filtered/[...slugs]">) {
	const { slugs } = await props.params;
	return categoryMetadata(slugs);
}

export default async function CategoryFilteredPage(props: PageProps<"/category-filtered/[...slugs]">) {
	const [{ slugs }, query] = await Promise.all([props.params, props.searchParams]);
	return <CategoryView slugs={slugs} filters={activeParams(CATEGORY_LISTING_PARAMS, query)} />;
}
