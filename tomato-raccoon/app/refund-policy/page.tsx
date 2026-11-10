import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Refund Policy | Tomato Raccoon Supply Co.",
	description: "30-day money-back guarantee and zero-risk returns/replacements policy for Tomato Raccoon Supply Co.",
};

export default function RefundPolicyPage() {
	return <LegalDoc slug="refund-policy" />;
}
