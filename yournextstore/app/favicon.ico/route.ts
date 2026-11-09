import { getImageProps } from "next/image";
import { redirect } from "next/navigation";
import { getStoreFaviconUrl, meGetCached } from "@/lib/commerce";

export async function GET() {
	const me = await meGetCached();
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	// 与 app/layout.tsx 中的 <link rel="icon"> 采用相同的 64px 优化器 URL：
	// 直接从本站同源获取仅几 KB 的体积，而不是外部重定向到 blob 主机。
	redirect(getImageProps({ src: faviconUrl, width: 64, height: 64, alt: "" }).props.src);
}
