import { meGetCached } from "@/lib/commerce";

type StoreSettings = NonNullable<Awaited<ReturnType<typeof meGetCached>>["store"]["settings"]>;
type StoreTool = keyof NonNullable<StoreSettings["enabledTools"]>;

/** 当指定的店铺工具已启用时返回 true；禁用或设置读取失败时返回 false。 */
export async function isStoreToolEnabled(tool: StoreTool): Promise<boolean> {
	try {
		const me = await meGetCached();
		return Boolean(me.store.settings?.enabledTools?.[tool]);
	} catch {
		return false;
	}
}
