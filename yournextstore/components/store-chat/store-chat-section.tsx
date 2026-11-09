import { ReferralBadge } from "@/components/referral-badge";
import { meGetCached } from "@/lib/commerce";
import { StoreChatLauncher } from "./chat-launcher";

/**
 * 店面聊天挂载点 —— 处于休眠状态，除非平台指示该模块已启用
 * （`enabledTools.storeChat` 为 true 且订阅有效；当订阅过期时平台会将 `settings.storeChat` 置空）。
 * 该组件还控制 "Made with YNS" 徽章：当聊天关闭时，徽章像之前一样固定在右下角；
 * 当聊天开启时，两者共用一个停靠区以确保永不重叠。
 *
 * 必须置于 CartProvider 内部：从聊天中添加到购物车需要使用购物车上下文。
 */
export async function StoreChatSection() {
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	const chat = settings?.enabledTools?.storeChat ? settings.storeChat : null;
	if (!me || !chat) {
		return <ReferralBadge />;
	}

	return (
		<StoreChatLauncher
			assistantName={chat.assistantName}
			greeting={chat.greeting}
			suggestedQuestions={chat.suggestedQuestions ?? []}
			storeName={me.store.name}
			currency={me.store.currency}
			locale={me.store.locale}
			badge={<ReferralBadge docked />}
		/>
	);
}
