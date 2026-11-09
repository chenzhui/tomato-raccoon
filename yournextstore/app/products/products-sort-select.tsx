"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toSearchParams } from "@/lib/listing-routes";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

// 构建排序链接 href，保留当前所有生效的筛选条件并重置回第一页。
function buildSortHref(
	searchParams: URLSearchParams,
	pathname: string,
	value: string,
	defaultValue: string | undefined,
): string {
	const params = new URLSearchParams(searchParams.toString());
	// 任何排序规则变动都会重排结果集 —— 此时需重置回第一页。
	params.delete("page");
	if (value === defaultValue) {
		params.delete("sort");
	} else {
		params.set("sort", value);
	}
	return params.size ? `${pathname}?${params}` : pathname;
}

/** 当前生效的排序参数来自服务端（`active`），与筛选条件类似（参见 lib/listing-routes.ts）。 */
export function SortLinks({
	options,
	active,
}: {
	options: readonly SortOption[];
	active: Record<string, string | undefined>;
}) {
	const searchParams = toSearchParams(active);
	const pathname = usePathname();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	return (
		<>
			{options.map((option) => {
				const isActive = option.value === current;
				return (
					<Link
						key={option.value}
						href={buildSortHref(searchParams, pathname, option.value, defaultValue)}
						className={cn(
							"text-sm transition-colors",
							isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</Link>
				);
			})}
		</>
	);
}

/** 适用于小屏设备的紧凑型排序下拉框。生效的排序同样来自服务端（`active`），与 `SortLinks` 保持一致。 */
export function SortSelect({
	options,
	className,
	active,
}: {
	options: readonly SortOption[];
	className?: string;
	active: Record<string, string | undefined>;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = toSearchParams(active);
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	const onChange = (value: string | null) => {
		if (value === null) {
			return;
		}
		router.push(buildSortHref(searchParams, pathname, value, defaultValue), { scroll: false });
	};

	return (
		<Select value={current} onValueChange={onChange} items={options}>
			<SelectTrigger size="sm" className={cn("w-auto min-w-[9rem]", className)} aria-label="Sort products">
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="end">
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
