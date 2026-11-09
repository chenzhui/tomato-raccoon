"use client";

import { memo } from "react";
import { defaultUrlTransform, Streamdown, type UrlTransform } from "streamdown";
import { cn } from "@/lib/utils";

/**
 * 助手气泡的 Markdown 渲染组件。文本来自大模型，其上下文包含商家编写的“商店知识”
 * —— 属于半可信输入 —— 因此渲染受到严格限制：
 *
 * - 首先应用 `defaultUrlTransform`：用于过滤 `javascript:` 等不安全协议。
 *   所有逻辑均在此之上组合，绝不绕过它。
 * - 链接：仅限同源或相对路径。提示词注入的外部 URL（经典的数据外发攻击载体）
 *   将渲染为纯文本，而非可点击的链接。
 * - 图片：完全丢弃。商品图片仅通过类型化的搜索工具卡片展示给顾客，
 *   绝不通过模型生成的 Markdown 渲染。
 *
 * Streamdown 对未完成 Markdown 的解析能力在此处至关重要：流式返回的回复可能会在
 * 输出 token 上限处（如加粗 `**` 中间）被截断，而不会闪烁显示未解析的原始符号。
 */
const storefrontUrlTransform: UrlTransform = (url, key, node) => {
	const safe = defaultUrlTransform(url, key, node);
	if (safe == null) return safe;
	if (key !== "href") return null;
	if (safe.startsWith("/") || safe.startsWith("#")) return safe;
	try {
		return new URL(safe).origin === window.location.origin ? safe : null;
	} catch {
		return null;
	}
};

export const ChatMarkdown = memo(
	({ children, className }: { children: string; className?: string }) => (
		<Streamdown className={cn("chat-markdown", className)} urlTransform={storefrontUrlTransform}>
			{children}
		</Streamdown>
	),
	(prev, next) => prev.children === next.children && prev.className === next.className,
);
ChatMarkdown.displayName = "ChatMarkdown";
