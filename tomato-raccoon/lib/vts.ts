// `vts` 传输编码 —— 与 API 路由的解析器保持同步：
// `Type1*v1.v2!Type2*v3`（类型之间用 `!` 分隔，类型与其值之间用 `*` 分隔，各值之间用 `.` 分隔）。
const TYPES_SEPARATOR = "!";
const TYPE_AND_VALUES_SEPARATOR = "*";
const VALUES_SEPARATOR = ".";

export function parseVts(vts: string | null): Record<string, string[]> {
	if (!vts) {
		return {};
	}
	const pairs = vts
		.split(TYPES_SEPARATOR)
		.map((segment) => segment.split(TYPE_AND_VALUES_SEPARATOR, 2) as [string, string?])
		.map(([type, values]): [string, string[]] | null =>
			type && values ? [type, values.split(VALUES_SEPARATOR).filter(Boolean)] : null,
		)
		.filter((pair): pair is [string, string[]] => pair !== null && pair[1].length > 0);
	return Object.fromEntries(pairs);
}

export function encodeVts(record: Record<string, string[]>): string {
	return Object.entries(record)
		.filter(([, values]) => values.length > 0)
		.map(([type, values]) => `${type}${TYPE_AND_VALUES_SEPARATOR}${values.join(VALUES_SEPARATOR)}`)
		.join(TYPES_SEPARATOR);
}
