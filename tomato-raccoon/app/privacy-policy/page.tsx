import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Privacy Policy | AI-Chan Geek Merch",
	description: "Privacy policy and personal data protection terms for AI-Chan Geek Merch store.",
};

export default function PrivacyPolicyPage() {
	return <LegalDoc slug="privacy-policy" />;
}
