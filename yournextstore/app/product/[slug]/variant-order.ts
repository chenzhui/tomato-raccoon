type OrderedVariant = {
	combinations: { variantValue: { position: number | null } }[];
};

const UNPOSITIONED = Number.MAX_SAFE_INTEGER;

/**
 * 按照商家设定的选项顺序对变体排序：例如 Bone 在 Sand 之前，然后 10 cm 在 15 cm 之前。API
 * 返回的变体没有固定顺序，而默认变体、色卡顺序以及图片画廊
 * 都遵循该列表的顺序。每个变体按相同顺序列出其选项，因此按选项逐个对比位置权重（position）。
 */
export function sortVariantsByOptions<V extends OrderedVariant>(variants: readonly V[]): V[] {
	const positions = (variant: V) =>
		variant.combinations.map(({ variantValue }) => variantValue.position ?? UNPOSITIONED);
	return variants.toSorted((a, b) => {
		const pa = positions(a);
		const pb = positions(b);
		const index = pa.findIndex((position, i) => position !== pb[i]);
		return index === -1 ? 0 : (pa[index] ?? UNPOSITIONED) - (pb[index] ?? UNPOSITIONED);
	});
}
