// ─── 请勿删除 ──────────────────────────────────────────────────────────────────
// GDPR Cookie 同意横幅 + Google 同意模式 v2（Consent Mode v2）关联逻辑。
// 横幅 UI 位于 ./cookie-consent-banner.tsx（两个文件均必须保留）。
// 在 app/layout.tsx 中的 <body> 顶部渲染 —— 必须遵循此顺序，
// 以确保 `default_consent` 推送到 window.dataLayer 发生在任何 GTM /
// Meta Pixel / Google Ads 脚本之前。请勿将其移至其他脚本下方。
// ────────────────────────────────────────────────────────────────────────────
import { Suspense } from "react";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { meGetCached } from "@/lib/commerce";

// 必须与 ./cookie-consent-banner.tsx 中的 CONSENT_COOKIE 保持一致
const CONSENT_COOKIE = "yns-cookie-consent";

// 使用 `fromCookie` 时，脚本自行读取访客的选择。在服务端读取 Cookie
// 会导致每个页面按请求动态渲染，而无法提供静态服务。
const ConsentScript = ({ fromCookie = false }: { fromCookie?: boolean }) => {
	const state = fromCookie
		? `/(?:^|; )${CONSENT_COOKIE}=accepted(?:;|$)/.test(document.cookie)?'granted':'denied'`
		: "'granted'";
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `(function(s){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'default_consent',ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s});})(${state});`,
			}}
		/>
	);
};

export async function CookieConsent() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.cookieConsent) {
		// 管理后台中禁用了同意工具 —— 可以自由触发跟踪。
		return <ConsentScript />;
	}

	return (
		<>
			<ConsentScript fromCookie />
			{/* 必须使用独立的 Suspense 边界：横幅仅在浏览器端渲染，
			    如果挂起布局的边界，则会导致上方的 script 脚本在客户端渲染，
			    而 React 在客户端插入的 script 标签永远不会执行。 */}
			<Suspense fallback={null}>
				<CookieConsentBanner />
			</Suspense>
		</>
	);
}
