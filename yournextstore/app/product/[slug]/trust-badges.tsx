import type { LucideIcon } from "lucide-react";
import { RotateCcw, ShieldCheck, Truck, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Express Logistics", description: "7-12 days to US/EU" },
	{ icon: ShieldCheck, title: "Dual Layer Acrylic", description: "Diamond laser cut" },
	{ icon: RotateCcw, title: "30-Day Guarantee", description: "Zero-risk refunds" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 my-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-1.5 h-4 w-4 text-cyan-400" />
					<span className="text-xs font-semibold text-slate-200">{badge.title}</span>
					<span className="text-[10px] text-slate-400">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
