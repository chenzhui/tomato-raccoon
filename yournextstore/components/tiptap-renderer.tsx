import { type JSONContent as TiptapJSONContent, Node as TiptapNode } from "@tiptap/core";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color, FontFamily, FontSize, LineHeight, TextStyle } from "@tiptap/extension-text-style";
import { Youtube } from "@tiptap/extension-youtube";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer";
import type { JSONContent } from "commerce-kit";
import { Children, type ReactNode } from "react";
import { BlogProductEmbed } from "@/components/blog-product-embed";

// 管理后台编辑器将图片写入为 `imageResize`。将其别名指向 Image，而不是将仅在编辑器中使用的依赖引入到店面中。
const ImageResize = Image.extend({ name: "imageResize" });
const BODY_IMAGE_ATTRIBUTES = { loading: "lazy", decoding: "async" };

// 管理后台编辑器的推荐商品块，声明的原因与图片别名相同。
// 叶子节点：由 `productIds`（+ 可选的 `variantIds` 即 productId → variantId 映射）渲染，无子节点。
const ProductEmbed = TiptapNode.create({
	name: "productEmbed",
	group: "block",
	addAttributes: () => ({
		productIds: { default: [] as string[] },
		variantIds: { default: {} as Record<string, string> },
	}),
	parseHTML: () => [{ tag: "div[data-type='product-embed']" }],
	renderHTML: () => ["div", { "data-type": "product-embed" }],
});

// 管理后台编辑器的表格节点，声明的原因与图片别名相同。
const Table = TiptapNode.create({ name: "table", group: "block", content: "tableRow+" });
const TableRow = TiptapNode.create({ name: "tableRow", content: "(tableCell | tableHeader)+" });
const TableCell = TiptapNode.create({
	name: "tableCell",
	content: "block+",
	addAttributes: () => ({ colspan: { default: 1 }, rowspan: { default: 1 } }),
});
const TableHeader = TableCell.extend({ name: "tableHeader" });

const extensions = [
	StarterKit.configure({
		link: {
			openOnClick: false,
			autolink: false,
			defaultProtocol: "https",
			protocols: ["http", "https"],
		},
	}),
	TextStyle,
	LineHeight,
	FontFamily,
	Color.configure({ types: ["textStyle"] }),
	TextAlign.configure({
		types: ["heading", "paragraph"],
		alignments: ["left", "center", "right"],
		defaultAlignment: "left",
	}),
	FontSize,
	Youtube.configure({}),
	// 正文图片位于首屏下方且没有指定尺寸，因此使用懒加载并在主线程之外解码。
	Image.configure({ allowBase64: false, inline: true, HTMLAttributes: BODY_IMAGE_ATTRIBUTES }),
	ImageResize.configure({ allowBase64: false, inline: true, HTMLAttributes: BODY_IMAGE_ATTRIBUTES }),
	ProductEmbed,
	Table,
	TableRow,
	TableCell,
	TableHeader,
];

type Node = TiptapJSONContent;

/** 如果节点（递归地）包含任何实际渲染的文本/媒体内容，则返回 true。 */
function hasMeaningfulContent(node: Node | undefined | null): boolean {
	if (!node) return false;
	if (typeof node.text === "string" && node.text.trim().length > 0) return true;
	// 自包含的媒体节点即使没有文本子节点，也被视为有意义的内容。
	if (
		node.type &&
		["image", "imageResize", "youtube", "horizontalRule", "hardBreak", "productEmbed"].includes(node.type)
	) {
		return true;
	}
	if (Array.isArray(node.content)) {
		return node.content.some(hasMeaningfulContent);
	}
	return false;
}

function isListType(node: Node | undefined | null): boolean {
	return Boolean(node && (node.type === "bulletList" || node.type === "orderedList"));
}

/**
 * 从已加载的商品内容中修剪空的 TipTap 结构：
 *  (a) 唯一内容为无文本空段落的 listItem，
 *  (b) 剩余 0 个列表项的 bulletList/orderedList，
 *  (c) 紧接着此类现在为空/已删除列表的标题
 *      （也会删除孤立的“特性/Features”标题）。
 */
// 仅可包含行内（INLINE）内容的节点类型。嵌套在其中的块级节点会被渲染为
// `<p><p>…</p></p>`，React 在水合阶段会报错拒绝（"<p> cannot be a descendant of <p>"）。
const INLINE_ONLY_NODES = new Set(["paragraph", "heading"]);
const INLINE_NODE_TYPES = new Set(["text", "hardBreak", "image"]);

/**
 * 将块级节点从仅行内父节点中提升出来。
 *
 * 源 HTML 会将块级元素嵌套在行内标签内部（`<b><p>Title</p></b>`），而在转换端修复之前导入目录的商店
 * 在服务端仍然存储着这种结构 —— 4motos.pl 的 813 个商品就是这种情况。在此进行规范化处理可保持这些
 * 商品页面的水合正常，而无需重新导入：行内子节点保持原位，块级子节点按文档顺序提升到父节点同级。
 */
function liftNestedBlocks(nodes: Node[]): Node[] {
	const out: Node[] = [];
	for (const node of nodes) {
		if (!node) continue;
		const children = node.content ? liftNestedBlocks(node.content) : undefined;
		if (!children || !node.type || !INLINE_ONLY_NODES.has(node.type)) {
			out.push(children ? { ...node, content: children } : node);
			continue;
		}
		let run: Node[] = [];
		const flushRun = () => {
			if (run.length) out.push({ ...node, content: run });
			run = [];
		};
		for (const child of children) {
			if (child.type && INLINE_NODE_TYPES.has(child.type)) run.push(child);
			else {
				flushRun();
				out.push(child);
			}
		}
		if (run.length) flushRun();
	}
	return out;
}

function pruneEmptyNodes(nodes: Node[]): Node[] {
	const cleaned: { node: Node; origNextWasList: boolean }[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!node) continue;
		const child = node.content ? pruneEmptyNodes(node.content) : undefined;
		const next: Node = child ? { ...node, content: child } : node;

		if (next.type === "listItem" && !hasMeaningfulContent(next)) continue; // (a)
		if (isListType(next) && (!next.content || next.content.length === 0)) continue; // (b)

		cleaned.push({ node: next, origNextWasList: isListType(nodes[i + 1]) });
	}

	const result: Node[] = [];
	for (let i = 0; i < cleaned.length; i++) {
		const entry = cleaned[i];
		if (!entry) continue;
		const { node, origNextWasList } = entry;
		if (node.type === "heading" && origNextWasList && !isListType(cleaned[i + 1]?.node)) {
			continue; // 孤立的章节标题，如 "Features"
		}
		result.push(node);
	}
	return result;
}

/**
 * 商店设计系统自有的排版样式，而粘贴的内容通常会带有行内样式。从 Word/Google Docs/旧 CMS
 * 复制文章会带来源内容的字体栈，导致整页衬线字体中出现单个 Helvetica 段落。商店决定字体族
 * 和字号层级；文本颜色则予以保留，因为商家确实会通过编辑器工具栏主动设置文字颜色。
 */
const OVERRIDDEN_TEXT_STYLES = ["fontFamily", "fontSize"] as const;

function stripPastedTypography(nodes: Node[]): Node[] {
	return nodes.map((node) => {
		const marks = node.marks?.map((mark: any) => {
			if (mark.type !== "textStyle" || !mark.attrs) return mark;
			const attrs = { ...mark.attrs };
			for (const attr of OVERRIDDEN_TEXT_STYLES) delete attrs[attr];
			return { ...mark, attrs };
		});
		return {
			...node,
			...(marks ? { marks } : {}),
			...(node.content ? { content: stripPastedTypography(node.content) } : {}),
		};
	});
}

const headerRow = (row: Node): Node => ({
	...row,
	content: row.content?.map((cell: any) => ({ ...cell, type: "tableHeader" })),
});

/** 表格的第一行作为表头列：导入的表格将其存储为普通单元格，完全没有表头。 */
function promoteHeaderRows(nodes: Node[]): Node[] {
	return nodes.map((node) => {
		const content = node.content && promoteHeaderRows(node.content);
		if (!content) return node;
		if (node.type !== "table") return { ...node, content };
		const [first, ...rows] = content;
		return { ...node, content: first ? [headerRow(first), ...rows] : content };
	});
}

// 作为 `unhandledNode`/`unhandledMark` 传入：若没有它们，没有匹配扩展的节点或标记会导致整个渲染抛出异常，文章将显示为空白。
function passThrough({ children }: { children?: ReactNode | ReactNode[] }): ReactNode {
	return children ?? null;
}

export function TiptapRenderer({ content }: { content: JSONContent | null | undefined }) {
	if (!content) return null;
	const root = content as TiptapJSONContent;
	const children = root.content;
	if (!Array.isArray(children) || children.length === 0) return null;

	const prunedChildren = promoteHeaderRows(
		pruneEmptyNodes(liftNestedBlocks(stripPastedTypography(children))),
	);
	if (prunedChildren.length === 0) return null;
	const pruned: TiptapJSONContent = { ...root, content: prunedChildren };

	return (
		<>
			{renderToReactElement({
				content: pruned,
				extensions,
				options: {
					nodeMapping: {
						productEmbed: ({ node }) => {
							const ids = node.attrs.productIds;
							const variantIds =
								node.attrs.variantIds && typeof node.attrs.variantIds === "object"
									? Object.fromEntries(
											Object.entries(node.attrs.variantIds as Record<string, unknown>).filter(
												(entry): entry is [string, string] => typeof entry[1] === "string",
											),
										)
									: {};
							return Array.isArray(ids) ? (
								<BlogProductEmbed
									productIds={ids.filter((id) => typeof id === "string")}
									variantIds={variantIds}
								/>
							) : null;
						},
						table: ({ children }) => {
							const [header, ...rows] = Children.toArray(children);
							return (
								<div className="tableWrapper">
									<table>
										<thead>{header}</thead>
										<tbody>{rows}</tbody>
									</table>
								</div>
							);
						},
						tableRow: ({ children }) => <tr>{children}</tr>,
						tableHeader: ({ node, children }) => (
							<th colSpan={node.attrs.colspan} rowSpan={node.attrs.rowspan}>
								{children}
							</th>
						),
						tableCell: ({ node, children }) => (
							<td colSpan={node.attrs.colspan} rowSpan={node.attrs.rowspan}>
								{children}
							</td>
						),
					},
					unhandledNode: passThrough,
					unhandledMark: passThrough,
				},
			})}
		</>
	);
}
