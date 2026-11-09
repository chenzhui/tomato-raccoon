import { Suspense } from "react";

/**
 * 若不执行此读取，客户端路由将对所有查询字符串复用静态列表页的默认视图，导致
 * `?page=2` 永远无法传递到服务端及 `next.config.ts` 的重写逻辑（详见 lib/listing-routes.ts）。
 * 读取查询参数会促使路由器向服务端发起请求。
 */
export function SearchParamsProbe({ searchParams }: { searchParams: Promise<unknown> }) {
	return (
		<Suspense fallback={null}>
			<SearchParamsRead searchParams={searchParams} />
		</Suspense>
	);
}

async function SearchParamsRead({ searchParams }: { searchParams: Promise<unknown> }) {
	await searchParams;
	return null;
}
