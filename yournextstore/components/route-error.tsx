"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * 路由级错误边界的共享后备组件。`retry` 会重新获取并
 * 重新渲染该边界的子组件（包括服务端组件 Server Components），因此
 * 电商 API 的瞬时故障可以就地恢复，而无需将整个页面卸载并冒泡到根错误边界。
 */
export function RouteErrorFallback({
	title,
	description,
	error,
	retry,
}: {
	title: string;
	description: string;
	error: Error & { digest?: string };
	retry: () => void;
}) {
	useEffect(() => {
		console.error("route error boundary", { digest: error.digest, error });
	}, [error]);

	return (
		<div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-24 text-center">
			<AlertCircleIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-2xl font-medium tracking-tight">{title}</h1>
			<p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
			<div className="mt-8 flex items-center gap-4">
				<button
					type="button"
					onClick={retry}
					className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
				>
					Try Again
				</button>
				<Link
					href="/"
					className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
				>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
}
