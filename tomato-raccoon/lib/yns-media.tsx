"use client";

import Image, { getImageProps } from "next/image";
import { type ComponentProps, useEffect, useState } from "react";
import type { BlurPreview } from "@/lib/blur-placeholder";
import { isVideoUrl } from "@/lib/utils";

type ImageProps = ComponentProps<typeof Image>;

const YNSImageWithPolling = (props: ImageProps) => {
	const { props: resolvedProps } = getImageProps(props as Parameters<typeof getImageProps>[0]);
	const [isReady, setIsReady] = useState(false);

	const src = resolvedProps.src;

	useEffect(() => {
		setIsReady(false);
		let cancelled = false;

		const probe = () => {
			const img = new window.Image();
			img.onload = () => {
				if (!cancelled) setIsReady(true);
			};
			img.onerror = () => {
				if (cancelled) return;
				setTimeout(probe, 1000);
			};
			img.src = src;
		};

		probe();

		return () => {
			cancelled = true;
		};
	}, [src]);

	if (!isReady) {
		const style: React.CSSProperties = props.fill
			? { position: "absolute", inset: 0, width: "100%", height: "100%" }
			: { width: resolvedProps.width, height: resolvedProps.height };

		return <div className={`yns-image-shimmer ${props.className ?? ""}`} style={style} />;
	}

	return <Image {...props} />;
};

const YNSImage = process.env.NODE_ENV === "development" ? YNSImageWithPolling : Image;

type YNSMediaProps = ImageProps & {
	autoPlay?: boolean;
	controls?: boolean;
	/** 模糊预览图（lib/blur-placeholder.ts），在此特定图片加载期间应用。 */
	preview?: BlurPreview | null;
};

/** 针对视频 URL 渲染 <video>，否则回退到 Image 组件。 */
export const YNSMedia = ({ autoPlay = true, controls = false, preview = null, ...props }: YNSMediaProps) => {
	const src = typeof props.src === "string" ? props.src : "";
	if (isVideoUrl(src)) {
		return (
			<video
				// 视频标签没有 alt 属性 —— 改为向无障碍辅助技术暴露图片的 alt 文本。
				aria-label={props.alt || undefined}
				className={typeof props.className === "string" ? props.className : undefined}
				style={
					props.fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
						: undefined
				}
				src={src}
				muted
				loop
				autoPlay={autoPlay}
				playsInline
				controls={controls}
			/>
		);
	}
	const blur =
		preview && preview.src === src ? { placeholder: "blur" as const, blurDataURL: preview.blurDataURL } : {};
	return <YNSImage {...props} {...blur} />;
};
