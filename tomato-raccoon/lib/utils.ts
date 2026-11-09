import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isVideoUrl(url: string): boolean {
	try {
		const { pathname } = new URL(url);
		return pathname.endsWith(".mp4") || pathname.endsWith(".webm") || pathname.endsWith(".mov");
	} catch {
		return false;
	}
}

/** 从媒体数组中返回第一个非视频 URL —— 适用于缩略图、OG 分享图和邮件内容。 */
export const getProductThumbnail = (urls: string[]): string | undefined => {
	return urls.find((url) => !isVideoUrl(url));
};
