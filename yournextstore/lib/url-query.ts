"use client";

import { useSyncExternalStore } from "react";

const URL_CHANGE = "yns:url-change";

let watchingHistory = false;

/** 封装一次 `history.pushState`/`replaceState`，以便播报每一次地址变更（包括 Next 的路由导航）。 */
const watchHistory = () => {
	if (watchingHistory) return;
	watchingHistory = true;
	const { pushState, replaceState } = window.history;
	window.history.pushState = function ynsPushState(...args) {
		pushState.apply(this, args);
		window.dispatchEvent(new Event(URL_CHANGE));
	};
	window.history.replaceState = function ynsReplaceState(...args) {
		replaceState.apply(this, args);
		window.dispatchEvent(new Event(URL_CHANGE));
	};
};

const subscribe = (notify: () => void) => {
	watchHistory();
	window.addEventListener("popstate", notify);
	window.addEventListener(URL_CHANGE, notify);
	return () => {
		window.removeEventListener("popstate", notify);
		window.removeEventListener(URL_CHANGE, notify);
	};
};

/**
 * 从 `location.search` 读取页面的查询字符串，而非使用 `useSearchParams()`。预渲染页面在渲染时
 * 带有空的查询参数（服务端绝不会看到它），并在注水（hydration）后切换为真实参数，使组件
 * 能保留在静态 Shell 中；使用 `useSearchParams()` 会导致其变为在 Suspense 回退边界之后的按请求动态渲染。
 */
export function useUrlQuery(): URLSearchParams {
	const search = useSyncExternalStore(
		subscribe,
		() => window.location.search,
		() => "",
	);
	return new URLSearchParams(search);
}

/** 向历史记录中写入新地址；Next 会保持其路由同步，并且 `useUrlQuery` 的读取端也会更新。 */
export function setUrlQuery(url: string, { replace = false }: { replace?: boolean } = {}) {
	if (replace) window.history.replaceState(null, "", url);
	else window.history.pushState(null, "", url);
}
