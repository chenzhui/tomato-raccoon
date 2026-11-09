import { cacheLife } from "next/cache";
import sharp from "sharp";
import { isVideoUrl } from "@/lib/utils";

const SIZE = 16;

export type BlurPreview = { src: string; blurDataURL: string };

/**
 * 用于 `placeholder="blur"` 的模糊预览图（在 HTML 中占用约 300 字节的 Base64）：它会立即显示，且照片会在其上
 * 淡入呈现，而不是在路由导航后突兀地跳出一个空白框。没有图片、属于视频或图片抓取失败时返回 null
 * （此时不使用预览）。
 */
export async function blurPreview(url: string | undefined): Promise<BlurPreview | null> {
	if (!url || isVideoUrl(url)) return null;
	const blurDataURL = await blurDataUrl(url);
	return blurDataURL ? { src: url, blurDataURL } : null;
}

// 普通的 "use cache"（非 "remote"）：结果直接写入预渲染的 Shell 中，且 Blob URL 是不可变的。
async function blurDataUrl(url: string): Promise<string | null> {
	"use cache";
	cacheLife("max");
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
		if (!response.ok) return null;
		const preview = await sharp(Buffer.from(await response.arrayBuffer()))
			.resize(SIZE, SIZE, { fit: "inside" })
			.webp({ quality: 50 })
			.toBuffer();
		return `data:image/webp;base64,${preview.toString("base64")}`;
	} catch {
		return null;
	}
}
