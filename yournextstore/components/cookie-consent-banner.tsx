// ─── 请勿删除 ──────────────────────────────────────────────────────────────────
// GDPR Cookie 同意横幅。入口与服务端逻辑位于 ./cookie-consent.tsx。
// ────────────────────────────────────────────────────────────────────────────
"use client";

import { XIcon } from "lucide-react";
import { use, useState } from "react";
import { browser } from "react-dom";
import { Button } from "@/components/ui/button";
import { notifyConsentChanged } from "@/lib/track";

// 必须与 ./cookie-consent.tsx 中的 CONSENT_COOKIE 保持一致
const CONSENT_COOKIE = "yns-cookie-consent";

const recordChoice = (choice: "accepted" | "declined") => {
	document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
	const state = choice === "accepted" ? "granted" : "denied";
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: "consent_update",
		ad_storage: state,
		ad_user_data: state,
		ad_personalization: state,
		analytics_storage: state,
	});
	// 通知平台店面工具包重新读取 Cookie 并启动其跟踪器，无需刷新页面。
	notifyConsentChanged();
};

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

export const CookieConsentBanner = () => {
	// 仅在浏览器中渲染（预渲染时保留 Suspense 的 fallback），因此访客的选择在此处读取，页面保持静态。
	use(browser("The consent choice is a browser cookie."));
	const [hidden, setHidden] = useState(() =>
		document.cookie.split("; ").some((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`)),
	);
	if (hidden) return null;

	const onAccept = () => {
		recordChoice("accepted");
		setHidden(true);
	};
	const onDecline = () => {
		recordChoice("declined");
		setHidden(true);
	};

	return (
		// z-[45]：高于 "Made with YNS" 徽章、聊天启动按钮和通讯订阅启动按钮（位于 bottom-4 的 z-40），
		// 否则它们会遮挡横幅的按钮；同时低于购物车抽屉和对话框（z-50），否则横幅会遮挡它们（包括结账按钮）。
		<div className="fixed bottom-0 left-0 right-0 z-[45] border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex-1">
					<h3 className="mb-1 font-semibold">We use cookies</h3>
					<p className="text-sm text-muted-foreground">
						We use cookies to improve your browsing experience, analyze site traffic, and personalize content.
						By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
					</p>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<Button type="button" variant="outline" size="sm" onClick={onDecline}>
						Decline
					</Button>
					<Button type="button" size="sm" onClick={onAccept}>
						Accept
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={onDecline}
						aria-label="Decline cookies"
					>
						<XIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
