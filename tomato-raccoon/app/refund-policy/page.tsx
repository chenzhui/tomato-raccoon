import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Refund Policy | AI-Chan Geek Merch",
	description: "30-day money-back guarantee and zero-risk returns/replacements policy.",
};

export default function RefundPolicyPage() {
	return <LegalDoc slug="refund-policy" />;
}
