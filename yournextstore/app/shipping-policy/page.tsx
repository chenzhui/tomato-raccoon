import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Shipping Policy | AI-Chan Geek Merch",
	description: "Shipping and handling policies: 2-4 days crafting, 7-12 business days express delivery to US/EU.",
};

export default function ShippingPolicyPage() {
	return <LegalDoc slug="shipping-policy" />;
}
