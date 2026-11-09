"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { Button } from "@/components/ui/button";
import type { BlurPreview } from "@/lib/blur-placeholder";
import { useUrlQuery } from "@/lib/url-query";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type Variant = {
	id: string;
	images: string[];
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

type MediaGalleryProps = {
	images: string[];
	productName: string;
	variants: Variant[];
	/** 首张图片的高斯模糊预览图（参见 lib/blur-placeholder.ts），在照片完全加载前展示。 */
	preview?: BlurPreview | null;
};

export function MediaGallery({ images, productName, variants, preview = null }: MediaGalleryProps) {
	const searchParams = useUrlQuery();

	// 画廊始终展示完整的图片集（商品主图 + 所有变体图片）。当选中某个
	// 变体时，我们不筛选列表 —— 否则会隐藏其他缩略图 ——
	// 而是直接将画廊当前激活的大图跳转至该变体在全量画廊中的首张照片。
	const displayImages = images;

	const selectedVariant = useSelectedVariant(variants);

	// 只有具备真实组合规格（combinations）的变体才会触发画廊图片跳转。
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(images.indexOf(firstVariantImage), 0) : 0;

	// 当 query 参数已知时（客户端页面内导航跳转），首屏直接停在选中变体的照片；
	// 页面完整刷新加载时，query 会随水合过程到达，由下方的跳转逻辑捕获处理。
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);
	const [isZoomed, setIsZoomed] = useState(false);

	// 当 query 参数改变时直接跳转至选中变体的图片（避免使用 useEffect 带来的二次渲染）。
	// 前一个 key 保存在 state 而非 ref 中，使得被 React 放弃的渲染无法在未更新 index 的情况下修改 key。
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	};

	// 键盘导航：ArrowLeft / ArrowRight（作用域限定在画廊容器内）
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (displayImages.length <= 1) return;

		if (e.key === "ArrowLeft") {
			e.preventDefault();
			handlePrevious();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			handleNext();
		}
	};

	if (displayImages.length === 0) {
		return (
			<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG 轮播组件无障碍规范：命名区域；方向键由内部可聚焦控件冒泡处理。
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex flex-col gap-4 outline-none lg:sticky lg:top-24 lg:self-start"
		>
			{/* 主图展示区 */}
			<div className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
				{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
					<video
						className="absolute inset-0 w-full h-full object-cover"
						src={displayImages[selectedIndex]}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<YNSMedia
						src={displayImages[selectedIndex] ?? ""}
						preview={preview}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						// 在桌面端占据 max-w-7xl（1280 px）容器的一半宽度，而不是视口宽度的一半。
						sizes="(max-width: 1024px) 100vw, min(50vw, 640px)"
						className={cn(
							"object-cover transition-transform duration-500",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
						fetchPriority="high"
					/>
				)}

				{/* 导航切换箭头 */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				{/* 放大提示标签（视频时隐藏） */}
				{!isVideoUrl(displayImages[selectedIndex] ?? "") && (
					<div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
						<div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
							<ZoomIn className="h-3.5 w-3.5" />
							Click to zoom
						</div>
					</div>
				)}

				{/* 图片计数指示器 */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{/* 缩略图列表 */}
			{displayImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto p-2 -m-2">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-200",
								selectedIndex === index
									? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
									: "opacity-60 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 w-full h-full object-cover"
									src={image}
									muted
									playsInline
								/>
							) : (
								<YNSMedia
									src={image}
									alt={`${productName} thumbnail ${index + 1}`}
									fill
									sizes="80px"
									className="object-cover"
								/>
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
