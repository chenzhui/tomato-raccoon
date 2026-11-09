"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// 当店面嵌入在 iframe 中时，仅允许 YNS 构建器/工具栏域名驱动或监听导航
// （与 instrumentation-client.ts 中的 `allowedDevOrigins` 及工具栏域名相匹配）。
const TRUSTED_PARENT_HOSTNAME = /(^|\.)(yns\.store|yns\.cx|yournextstore\.com|vercel\.run|localhost)$/;

const isTrustedParentOrigin = (origin: string) => {
	try {
		return TRUSTED_PARENT_HOSTNAME.test(new URL(origin).hostname);
	} catch {
		return false;
	}
};

export function NavigationReporter() {
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined" || window.parent === window) return;

		const handleMessage = (event: MessageEvent) => {
			if (!isTrustedParentOrigin(event.origin)) return;
			if (event.data?.type === "navigate" && typeof event.data.pathname === "string") {
				router.push(event.data.pathname);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return (
		<Script id="navigation-reporter" strategy="afterInteractive">
			{
				/* js */ `
(function() {
  if (window.parent === window) return;

  // 仅向嵌入该页面的源上报，且仅当该源为受信任的 YNS 域名时上报。
  var parentOrigin = "";
  try { parentOrigin = new URL(document.referrer).origin; } catch (e) {}
  if (!parentOrigin) return;
  try {
    if (!${TRUSTED_PARENT_HOSTNAME.toString()}.test(new URL(parentOrigin).hostname)) return;
  } catch (e) { return; }

  function reportNavigation() {
    window.parent.postMessage({ type: "navigation", pathname: window.location.pathname }, parentOrigin);
  }

  reportNavigation();

  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function(...args) {
    pushState.apply(this, args);
    reportNavigation();
  };

  history.replaceState = function(...args) {
    replaceState.apply(this, args);
    reportNavigation();
  };

  window.addEventListener("popstate", reportNavigation);
})();
      `
			}
		</Script>
	);
}

export function ErrorOverlayRemover() {
	useEffect(() => {
		if (window.parent === window) return;

		// 商家通过构建器 iframe 查看此开发服务器，因此无需向其展示任何 Next.js 开发工具 UI。
		// 浮标及其所在的容器均已指定选择器，因此任一结构的调整仍能保持其处于隐藏状态。
		const hiddenSelectors = ["[data-nextjs-dialog-overlay]", "[data-next-badge-root]", "[data-nextjs-toast]"];

		const inject = () => {
			const shadowRoot = document.querySelector("nextjs-portal")?.shadowRoot;
			if (!shadowRoot) return false;
			if (shadowRoot.querySelector("style[data-yns-hide-dev-chrome]")) return true;

			const style = document.createElement("style");
			style.setAttribute("data-yns-hide-dev-chrome", "");
			style.textContent = `${hiddenSelectors.join(",\n")} { display: none !important; }`;
			shadowRoot.appendChild(style);

			// 否则一旦 Next.js 改名，将静默降级导致开发工具 UI 遮挡预览画面。
			if (!hiddenSelectors.some((selector) => shadowRoot.querySelector(selector))) {
				console.warn("Next.js dev overlay found, but none of its chrome selectors matched:", hiddenSelectors);
			}
			return true;
		};

		if (inject()) return;

		// 该 portal 在水合之后挂载并直接置于 <body> 下。设置超时上限，
		// 以免在 portal 从未出现时在预览页面上残留长期运行的 observer。
		const observer = new MutationObserver(() => {
			if (inject()) observer.disconnect();
		});
		observer.observe(document.body, { childList: true });
		const stopWatching = setTimeout(() => observer.disconnect(), 10_000);

		return () => {
			clearTimeout(stopWatching);
			observer.disconnect();
		};
	}, []);

	return null;
}
