import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Shipping Policy | Tomato Raccoon Supply Co.",
	description: "Shipping and handling policies: 2-4 days crafting, 3-5 business days express delivery across US via USPS.",
};

export default function ShippingPolicyPage() {
	return <LegalDoc slug="shipping-policy" />;
}
