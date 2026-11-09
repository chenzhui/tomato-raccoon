"use client";

// 改编自 vercel/shop 中的 components/ui/link.tsx（MIT 协议，版权所有 (c) 2025 Vercel, Inc.）。

import NextLink from "next/link";
import { type ComponentProps, type Ref, useEffect, useRef, useState } from "react";

const HOVER_INTENT_DELAY_MS = 100;
const SETTLE_INTENT_DELAY_MS = 300;
const SETTLE_INTENT_LIMIT = 4;

interface Connection {
	effectiveType?: string;
	saveData?: boolean;
}

interface IntentLinkProps extends Omit<ComponentProps<typeof NextLink>, "prefetch"> {
	prefetch?: ComponentProps<typeof NextLink>["prefetch"] | "intent";
}

const settleCandidates = new Set<HTMLAnchorElement>();
const settleUpgrades = new Map<HTMLAnchorElement, () => void>();
let settleObserver: IntersectionObserver | undefined;
let settleTimer: number | undefined;
let touchPrimary: MediaQueryList | undefined;

function canUpgrade(anchor: HTMLAnchorElement): boolean {
	const connection = (navigator as Navigator & { connection?: Connection }).connection;

	if (
		!anchor.isConnected ||
		document.visibilityState !== "visible" ||
		!navigator.onLine ||
		connection?.saveData ||
		connection?.effectiveType?.endsWith("2g") ||
		anchor.hasAttribute("download") ||
		(anchor.target && anchor.target.toLowerCase() !== "_self") ||
		anchor.getAttribute("aria-disabled") === "true"
	) {
		return false;
	}

	try {
		const current = new URL(window.location.href);
		const destination = new URL(anchor.href);

		// 根级的 ensureStatic 使每个链接的预取保持静态，因此搜索参数仅在导航时解析，同路径的升级并不会带来任何收益。
		return (
			(destination.protocol === "http:" || destination.protocol === "https:") &&
			destination.origin === current.origin &&
			destination.pathname !== current.pathname
		);
	} catch {
		return false;
	}
}

function isTouchPrimary(): boolean {
	touchPrimary ??= window.matchMedia("(hover: none)");
	return touchPrimary.matches;
}

function scheduleSettleIntent() {
	window.clearTimeout(settleTimer);
	settleTimer = window.setTimeout(upgradeSettledLinks, SETTLE_INTENT_DELAY_MS);
}

function cancelSettleIntent() {
	window.clearTimeout(settleTimer);
}

function upgradeSettledLinks() {
	const center = window.innerHeight / 2;
	const destinations = new Map<string, { anchors: HTMLAnchorElement[]; distance: number }>();

	for (const anchor of settleCandidates) {
		if (!canUpgrade(anchor)) continue;
		const rect = anchor.getBoundingClientRect();
		const distance = Math.abs(rect.top + rect.height / 2 - center);
		const destination = destinations.get(anchor.href);
		if (destination) {
			destination.anchors.push(anchor);
			destination.distance = Math.min(destination.distance, distance);
		} else {
			destinations.set(anchor.href, { anchors: [anchor], distance });
		}
	}

	const nearest = [...destinations.values()]
		.sort((a, b) => a.distance - b.distance)
		.slice(0, SETTLE_INTENT_LIMIT);
	for (const { anchors } of nearest) {
		for (const anchor of anchors) settleUpgrades.get(anchor)?.();
	}
}

function observeSettleIntent(anchor: HTMLAnchorElement, upgrade: () => void): () => void {
	if (!settleObserver) {
		window.addEventListener("scroll", scheduleSettleIntent, { capture: true, passive: true });
		settleObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const target = entry.target as HTMLAnchorElement;
					if (entry.isIntersecting) settleCandidates.add(target);
					else settleCandidates.delete(target);
				}
				scheduleSettleIntent();
			},
			{ rootMargin: "-25% 0px" },
		);
	}

	settleUpgrades.set(anchor, upgrade);
	settleObserver.observe(anchor);

	return () => {
		settleCandidates.delete(anchor);
		settleUpgrades.delete(anchor);
		settleObserver?.unobserve(anchor);
	};
}

function assignRef(ref: Ref<HTMLAnchorElement> | undefined, anchor: HTMLAnchorElement | null) {
	if (typeof ref === "function") ref(anchor);
	else if (ref) ref.current = anchor;
}

/**
 * 基于用户意图进行预取的链接组件：默认预取路由的共享应用外壳（App Shell，即 partialPrefetching）；
 * 一旦顾客悬停、聚焦链接，或在触屏上停留在其附近停止滚动时，预取完整页面，从而在点击时立即显示真实内容。
 */
export function IntentLink({
	as,
	href,
	onBlur,
	onFocus,
	onPointerCancel,
	onPointerDown,
	onPointerEnter,
	onPointerLeave,
	prefetch = "intent",
	ref,
	...props
}: IntentLinkProps) {
	const destinationKey = JSON.stringify([href, as]);
	const [intentDestination, setIntentDestination] = useState<string | null>(null);
	const anchorRef = useRef<HTMLAnchorElement | null>(null);
	const focused = useRef(false);
	const hovered = useRef(false);
	const timer = useRef<number | undefined>(undefined);
	const upgraded = prefetch === "intent" && intentDestination === destinationKey;

	function cancelPendingIntent() {
		if (timer.current !== undefined) window.clearTimeout(timer.current);
		timer.current = undefined;
	}

	function scheduleIntent(anchor: HTMLAnchorElement) {
		cancelPendingIntent();
		if (prefetch !== "intent" || upgraded || !canUpgrade(anchor)) return;

		const destination = anchor.href;
		timer.current = window.setTimeout(() => {
			timer.current = undefined;
			if (anchor.href === destination && canUpgrade(anchor)) {
				setIntentDestination(destinationKey);
			}
		}, HOVER_INTENT_DELAY_MS);
	}

	useEffect(() => {
		const anchor = anchorRef.current;
		if (prefetch !== "intent" || upgraded || !anchor || !isTouchPrimary()) return;
		return observeSettleIntent(anchor, () => setIntentDestination(destinationKey));
	}, [destinationKey, prefetch, upgraded]);

	useEffect(
		() => () => {
			if (timer.current !== undefined) window.clearTimeout(timer.current);
		},
		[],
	);

	return (
		<NextLink
			{...props}
			as={as}
			href={href}
			onBlur={(event) => {
				onBlur?.(event);
				focused.current = false;
				if (!hovered.current) cancelPendingIntent();
			}}
			onFocus={(event) => {
				onFocus?.(event);
				if (event.defaultPrevented || !event.currentTarget.matches(":focus-visible")) return;
				focused.current = true;
				scheduleIntent(event.currentTarget);
			}}
			onPointerCancel={(event) => {
				onPointerCancel?.(event);
				hovered.current = false;
				cancelPendingIntent();
			}}
			onPointerDown={(event) => {
				onPointerDown?.(event);
				// 导航会直接渲染缓存的外壳，而不会等待进行中的单链接预取，因此在按下后再触发升级只会造成重复请求。
				cancelPendingIntent();
				cancelSettleIntent();
			}}
			onPointerEnter={(event) => {
				onPointerEnter?.(event);
				if (
					event.defaultPrevented ||
					event.pointerType === "touch" ||
					event.buttons !== 0 ||
					event.altKey ||
					event.ctrlKey ||
					event.metaKey ||
					event.shiftKey
				) {
					return;
				}
				hovered.current = true;
				scheduleIntent(event.currentTarget);
			}}
			onPointerLeave={(event) => {
				onPointerLeave?.(event);
				hovered.current = false;
				if (!focused.current) cancelPendingIntent();
			}}
			prefetch={prefetch === "intent" ? (upgraded ? true : "auto") : prefetch}
			ref={(anchor) => {
				anchorRef.current = anchor;
				assignRef(ref, anchor);
				return () => {
					anchorRef.current = null;
					assignRef(ref, null);
				};
			}}
		/>
	);
}
