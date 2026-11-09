import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayTierPrice, type TaxBehavior } from "@/lib/pricing";

export type VolumeTier = {
	id: string;
	price: string;
	priceGross?: string | null;
	minQuantity: number;
	maxQuantity: number | null;
	productVariantId: string | null;
};

/** volumePrice 按照顾客应看到的税费口径返回，可直接格式化展示。 */
export function useVolumePricing(
	tiers: VolumeTier[],
	selectedVariantId: string | undefined,
	quantity: number,
	taxBehavior: TaxBehavior,
) {
	// 变体专属的阶梯定价优先于商品全局的阶梯定价。
	const variantTiers = tiers.filter((t) => t.productVariantId === selectedVariantId);
	const resolvedTiers = selectedVariantId
		? (variantTiers.length > 0 ? variantTiers : tiers.filter((t) => !t.productVariantId)).toSorted(
				(a, b) => a.minQuantity - b.minQuantity,
			)
		: [];

	const tier = resolvedTiers.findLast(
		(t) => quantity >= t.minQuantity && (t.maxQuantity === null || quantity <= t.maxQuantity),
	);

	return { resolvedTiers, volumePrice: tier ? displayTierPrice(tier, taxBehavior) : null };
}

export function VolumePricingDisplay({
	tiers,
	quantity,
	volumePrice,
}: {
	tiers: VolumeTier[];
	quantity: number;
	volumePrice: string | null;
}) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	if (tiers.length === 0) return null;

	return (
		<>
			{volumePrice && (
				<p className="text-sm text-muted-foreground">
					{formatMoney({ amount: BigInt(volumePrice), currency, locale })} per unit at qty {quantity}
				</p>
			)}

			<div>
				<p className="text-sm font-medium mb-2">Buy more, save more</p>
				<div className="overflow-hidden rounded-lg border border-border text-sm">
					<table className="w-full">
						<thead>
							<tr className="bg-muted/50 text-muted-foreground">
								<th className="px-3 py-1.5 text-left font-medium">Quantity</th>
								<th className="px-3 py-1.5 text-right font-medium">Price per unit</th>
							</tr>
						</thead>
						<tbody>
							{tiers.map((tier, index) => {
								const isActive =
									quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity);
								return (
									<tr
										key={tier.id}
										className={
											isActive ? "bg-foreground/5 font-semibold" : index % 2 === 1 ? "bg-muted/20" : ""
										}
									>
										<td className="px-3 py-1.5">
											{tier.maxQuantity ? `${tier.minQuantity}–${tier.maxQuantity}` : `${tier.minQuantity}+`}
										</td>
										<td className="px-3 py-1.5 text-right font-medium">
											{formatMoney({
												amount: BigInt(displayTierPrice(tier, taxBehavior)),
												currency,
												locale,
											})}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
