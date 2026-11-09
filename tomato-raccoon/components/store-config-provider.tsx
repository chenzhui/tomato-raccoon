"use client";

import { createContext, useContext } from "react";
import { CURRENCY, LOCALE } from "@/lib/constants";
import type { TaxBehavior } from "@/lib/pricing";

// `language` 是店面默认语言的平台表示形式（例如 "pl-PL"），若商店从未设置则为 null；
// `locale` 是价格和日期格式化所使用的语言区域。
type StoreConfig = { currency: string; locale: string; language: string | null; taxBehavior: TaxBehavior };

// 降级常量仅在组件于 Provider 外部渲染时生效（如测试、隔离的预览等）。
const StoreConfigContext = createContext<StoreConfig>({
	currency: CURRENCY,
	locale: LOCALE,
	language: null,
	taxBehavior: "inclusive",
});

export function StoreConfigProvider({ value, children }: { value: StoreConfig; children: React.ReactNode }) {
	return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

export function useStoreConfig() {
	return useContext(StoreConfigContext);
}
