import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Terms of Service | AI-Chan Geek Merch",
	description: "Terms of service and merchant conditions for AI-Chan Geek Merch store.",
};

export default function TermsOfServicePage() {
	return <LegalDoc slug="terms-of-service" />;
}
