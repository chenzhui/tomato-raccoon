"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { getStoreConfig } from "@/lib/store-config";

type NewsletterState = {
	success: boolean;
	message: string;
	/** 订阅成功时回显，供 lib/track.tsx 跟踪统计使用。 */
	email?: string;
	error?: string;
} | null;

export async function subscribeToNewsletter(
	_prev: NewsletterState,
	formData: FormData,
): Promise<NewsletterState> {
	const email = formData.get("email");

	if (!email || typeof email !== "string") {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	// 前端表单在复选框勾选前会禁用提交按钮；这是服务端的
	// 对应校验防线，确保未同意营销条款的注册绝不会被记录。
	if (formData.get("marketingConsent") !== "on") {
		return {
			success: false,
			message: "",
			error: "Please accept marketing permissions to subscribe.",
		};
	}

	// 订阅者的语言：确认邮件和欢迎邮件将以此语言发送。
	const { language } = await getStoreConfig();
	const [error, subscriber] = await try_(
		commerce.subscriberCreate({ email, marketingConsent: true, locale: language ?? undefined }),
	);
	if (error) {
		console.error("newsletter: subscriberCreate failed", { error });
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	// 双重确认（Double opt-in）：在顾客点击邮件中的确认链接之前，该邮箱不会正式进入订阅列表。
	if (subscriber.pending) {
		return { success: true, message: "Almost done! Check your inbox to confirm your subscription.", email };
	}

	return { success: true, message: "Thanks for subscribing!", email };
}
