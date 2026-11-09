import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contrastRatio, parseCssBlock, resolveColor, SUPPORTED_SYNTAXES } from "@/lib/contrast";

/**
 * `app/globals.css` 中的调色板必须在其绘制的每个表面上满足正文文本的 WCAG AA（4.5:1）对比度要求。
 * 主题可能会派生（fork）该文件，因此该检查应由测试保证，而不是依赖审查者的肉眼：
 * 应调整“文本”token 与表面的明暗差距（浅色表面上更深，深色表面上更浅），
 * 绝不要改变设计所依赖的色调（tint）。
 */

const AA = 4.5;
const FIX =
	"move the text token's lightness away from the surface's (darker on light, lighter on dark) until ≥ 4.5; keep the tint";

/** 文本 token 与表面 token —— 组件实际渲染时绘制的每一种组合。 */
const PAIRS = [
	["foreground", "background"],
	["card-foreground", "card"],
	["popover-foreground", "popover"],
	["muted-foreground", "background"],
	["muted-foreground", "card"],
	["muted-foreground", "muted"],
	["muted-foreground", "secondary"],
	["secondary-foreground", "secondary"],
	["accent-foreground", "accent"],
	["primary-foreground", "primary"],
] as const;

const css = readFileSync(join(import.meta.dir, "globals.css"), "utf8");

const blocks = [":root", ".dark"] as const;

blocks.map((selector) => {
	const tokens = parseCssBlock(css, selector);

	test(`${selector} declares a palette`, () => {
		expect(tokens).not.toBeNull();
	});

	return PAIRS.map(([fg, bg]) => {
		const declared = tokens?.[fg] !== undefined && tokens?.[bg] !== undefined;
		// 如果主题中未定义某个 token，则无需检查该对组合。
		const check = declared ? test : test.skip;

		return check(`${selector}: --${fg} on --${bg} clears WCAG AA`, () => {
			const palette = tokens ?? {};
			const text = resolveColor(fg, palette);
			const surface = resolveColor(bg, palette);

			// 无法解析的值应视为测试失败，而不是跳过：否则主题中的 `color-mix()`
			// 会对本测试掩盖对比度退化问题。
			expect(
				text,
				`${selector} --${fg}: ${palette[fg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
			).not.toBeNull();
			expect(
				surface,
				`${selector} --${bg}: ${palette[bg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
			).not.toBeNull();
			if (!text || !surface) return;

			const ratio = contrastRatio(text, surface);
			expect(
				ratio,
				`${selector} --${fg} on --${bg} is ${ratio.toFixed(2)}:1, below WCAG AA (${AA}:1) — ${FIX}`,
			).toBeGreaterThanOrEqual(AA);
		});
	});
});
