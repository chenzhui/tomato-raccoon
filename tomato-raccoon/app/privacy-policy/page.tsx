import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
	title: "Privacy Policy | Tomato Raccoon Supply Co.",
	description: "Privacy policy and personal data protection terms for Tomato Raccoon Supply Co.",
};

export default function PrivacyPolicyPage() {
	return <LegalDoc slug="privacy-policy" />;
}
