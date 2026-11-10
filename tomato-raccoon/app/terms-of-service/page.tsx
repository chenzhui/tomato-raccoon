import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Terms of Service | Tomato Raccoon Supply Co.",
	description: "Terms of service and merchant conditions for Tomato Raccoon Supply Co.",
};

export default function TermsOfServicePage() {
	return <LegalDoc slug="terms-of-service" />;
}
