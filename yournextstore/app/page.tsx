import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* 不使用 <Suspense>：商品网格采用了 "use cache"，因此按文档顺序直接渲染到预渲染外壳中。
			    在已缓存数据外包裹边界仍会先输出骨架屏，稍后才在 HTML 中发送内容。 */}
			<ProductGrid title="Featured Products" limit={6} />
			<About />
			<Newsletter />
		</>
	);
}
