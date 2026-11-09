import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import type { TaxBehavior } from "@/lib/pricing";

// 店铺配置的货币/语言环境/税费行为及静态回退值。采用缓存
// （而非请求时动态获取），以便使用方能保持为预渲染 Shell 的一部分。缓存时间为
// 分钟级（MINUTES）而非小时级：`taxBehavior` 决定了 storefront 上的每个价格是按
// 未税还是含税读取，商家切换该设置时应当像修改价格一样迅速生效。
// 直接读取 /me 端点：若通过 meGetCached 则会重新读取其缓存，后者的
// 默认缓存期会导致持续提供长达 15 分钟的旧设置。
export async function getStoreConfig() {
	"use cache";
	cacheLife("minutes");

	const [error, me] = await try_(commerce.meGet());
	if (error) {
		return { currency: CURRENCY, locale: LOCALE, language: null, taxBehavior: "inclusive" as TaxBehavior };
	}
	// storefront 的默认语言即买家在此看到的语言：它用于格式化价格，并在
	// 每次添加购物车和订阅通讯时上报给平台，从而使结账页、买家账户及
	// 每封邮件都采用该语言。只有当商家已将其启用时才生效，遵循与平台结账
	// 一致的规则；否则直接使用店铺自身的语言（`store.locale`）。
	const defaultLanguage = me.store.settings?.defaultLanguage ?? null;
	const language =
		defaultLanguage && me.store.settings?.enabledLanguages?.[defaultLanguage] ? defaultLanguage : null;
	return {
		currency: me.store.currency || CURRENCY,
		locale: language || me.store.locale || LOCALE,
		language,
		taxBehavior: (me.store.taxBehavior || "inclusive") as TaxBehavior,
	};
}
