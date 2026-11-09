import type { LucideIcon } from "lucide-react";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Express Logistics", description: "7-12 days to US/EU" },
	{ icon: ShieldCheck, title: "Optical Cast Acrylic", description: "Diamond laser cut" },
	{ icon: RotateCcw, title: "30-Day Guarantee", description: "Zero-risk free replacements" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-neutral-200/80 bg-[#F5F5F7] p-4 my-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-1.5 h-4 w-4 text-neutral-800" />
					<span className="text-xs font-semibold text-neutral-900">{badge.title}</span>
					<span className="text-[11px] text-neutral-500 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
