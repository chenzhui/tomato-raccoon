"use client";

import { planLabel } from "@/app/cart/cart-math";
import { cn } from "@/lib/utils";

export type SubscriptionPlan = {
	id: string;
	name: string;
	discountPercent: number;
	benefits: string | null;
};

type SubscriptionOptionsProps = {
	plans: SubscriptionPlan[];
	/** 所选方案，若为单次购买则为 null。 */
	value: string | null;
	onChange: (planId: string | null) => void;
	/** 当商品仅限按方案订阅销售时为 false。 */
	allowOneTime: boolean;
};

// 订阅方案价格由平台确定：购物车会对方案行项目计价并显示减免金额，
// 因此此处仅展示每个选项的名称。
export function SubscriptionOptions({ plans, value, onChange, allowOneTime }: SubscriptionOptionsProps) {
	const options = [
		...(allowOneTime ? [{ id: null, label: "One-time purchase", detail: null }] : []),
		...plans.map((plan) => ({ id: plan.id, label: planLabel(plan), detail: plan.benefits })),
	];

	return (
		<fieldset className="space-y-2">
			<legend className="mb-3 text-sm font-medium">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:border-foreground/40",
						value === option.id && "border-foreground",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-foreground"
					/>
					<span className="space-y-1">
						<span className="block text-sm font-medium">{option.label}</span>
						{option.detail && <span className="block text-xs text-muted-foreground">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
