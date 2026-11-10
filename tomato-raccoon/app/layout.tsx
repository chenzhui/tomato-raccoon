import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tomato Raccoon Supply Co. | Grow Tomatoes, Not Data Centers",
  description:
    "Official grassroots protest merchandise defending American agricultural soil and aquifers. Heavyweight Comfort Colors tees, outdoor lawn signs, and weatherproof vinyl stickers.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-[#231f1e] antialiased selection:bg-[#cf3c2a] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <CartSidebar />
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
