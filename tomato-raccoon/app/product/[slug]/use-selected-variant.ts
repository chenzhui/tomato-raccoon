"use client";

import { useUrlQuery } from "@/lib/url-query";

type VariantLike = {
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

/**
 * 根据 `?<variantType.label>=<value>` 参数推导选中的变体；不完整的链接也能部分解析匹配。
 * 在浏览器端读取 query 参数（`useUrlQuery`），从而让商品详情页面保持完整预渲染。
 */
export function useSelectedVariant<T extends VariantLike>(variants: T[]): T | undefined {
	const searchParams = useUrlQuery();

	if (variants.length === 1) {
		return variants[0];
	}

	if (searchParams.size === 0) {
		return undefined;
	}

	// URL 中存在的规格 label 必须精确匹配；未出现的规格视为通配。得分 = 匹配的 label 数量，
	// 因此完全匹配优于部分匹配，完全不匹配的变体则直接被剔除。
	const score = (variant: T) => {
		let matched = 0;
		for (const { variantValue } of variant.combinations) {
			const param = searchParams.get(variantValue.variantType.label);
			if (param === null) continue;
			if (param !== variantValue.value) return 0;
			matched += 1;
		}
		return matched;
	};

	return variants
		.map((variant) => ({ variant, score: score(variant) }))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)[0]?.variant;
}
