import { expect, test } from "bun:test";
import { formatMoney, minorUnitsToMajor } from "@/lib/money";

test("formatMoney formats standard 2-decimal currencies", () => {
	expect(formatMoney({ amount: "1999", currency: "USD", locale: "en-US" })).toBe("$19.99");
	expect(formatMoney({ amount: 0, currency: "USD", locale: "en-US" })).toBe("$0.00");
	expect(formatMoney({ amount: 123456789n, currency: "USD", locale: "en-US" })).toBe("$1,234,567.89");
});

test("formatMoney handles zero-decimal currencies (Stripe minor units)", () => {
	// JPY 的 1999 次要货币单位是 ¥1,999 —— 而非 ¥19.99。
	expect(formatMoney({ amount: "1999", currency: "JPY", locale: "en-US" })).toBe("¥1,999");
	expect(formatMoney({ amount: "500", currency: "KRW", locale: "en-US" })).toBe("₩500");
});

test("formatMoney handles three-decimal currencies", () => {
	// KWD 的 1999 次要货币单位是 1.999 第纳尔（dinar）。
	expect(formatMoney({ amount: "1999", currency: "KWD", locale: "en-US" })).toContain("1.999");
	expect(formatMoney({ amount: "1500", currency: "BHD", locale: "en-US" })).toContain("1.500");
});

test("formatMoney is case-insensitive on the currency code's decimals lookup", () => {
	expect(formatMoney({ amount: "1999", currency: "jpy", locale: "en-US" })).toBe("¥1,999");
});

test("formatMoney rejects non-3-letter currency codes", () => {
	expect(() => formatMoney({ amount: "100", currency: "US", locale: "en-US" })).toThrow(
		"currency needs to be a 3-letter code",
	);
});

test("minorUnitsToMajor converts to the number analytics APIs expect", () => {
	expect(minorUnitsToMajor({ amount: "2000", currency: "USD" })).toBe(20);
	expect(minorUnitsToMajor({ amount: "2000", currency: "JPY" })).toBe(2000);
	expect(minorUnitsToMajor({ amount: "2999", currency: "KWD" })).toBe(2.999);
});
