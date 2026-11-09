import { PaymentIcon, type PaymentMethodId } from "commerce-kit/payment-icons";
import { cn } from "@/lib/utils";

// Stripe 银行卡结账在各地均支持这些方式；各商店可显式列出其本地支付方式（BLIK、iDEAL 等）。
const DEFAULT_METHODS: PaymentMethodId[] = ["visa", "mastercard", "amex", "apple_pay", "google_pay"];

export function PaymentMethods({
	methods = DEFAULT_METHODS,
	className,
}: {
	methods?: PaymentMethodId[];
	className?: string;
}) {
	return (
		<ul aria-label="Payment methods" className={cn("flex flex-wrap items-center gap-2", className)}>
			{methods.map((method) => (
				<li key={method}>
					<PaymentIcon method={method} className="h-6 w-auto" />
				</li>
			))}
		</ul>
	);
}
