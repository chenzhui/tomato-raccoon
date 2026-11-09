"use client";

import type { APIReviewTokenResult } from "commerce-kit";
import { Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useState } from "react";
import { submitReview } from "@/app/product/[slug]/review-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
	const [hovered, setHovered] = useState(0);

	return (
		<div className="flex gap-1">
			{Array.from({ length: 5 }, (_, i) => {
				const starValue = i + 1;
				return (
					<button
						key={starValue}
						type="button"
						onMouseEnter={() => setHovered(starValue)}
						onMouseLeave={() => setHovered(0)}
						onClick={() => onChange(starValue)}
						aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
						aria-pressed={starValue === value}
						className="transition-transform hover:scale-110"
					>
						<Star
							className={`h-6 w-6 ${
								starValue <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

type TokenAnswer = APIReviewTokenResult | { status: "failed" };

// 仅在顾客点击时发起请求，从而让商详页面保持静态缓存。由于在被代理的
// /checkout 路径下属于同源请求，浏览器会自动携带顾客的 session cookie。
async function fetchReviewToken(productId: string): Promise<TokenAnswer> {
	const response = await fetch(`/checkout/api/review-token?product=${encodeURIComponent(productId)}`).catch(
		() => null,
	);
	const answer: APIReviewTokenResult | null = response?.ok ? await response.json().catch(() => null) : null;
	return answer ?? { status: "failed" };
}

// 以访客身份结账或使用其他邮箱购买的顾客，只能通过
// 配送确认邮件中的链接进行评价。
const BUYERS_ONLY =
	"Only customers who bought this product can review it. Bought it? Use the review link in your delivery email.";

const NOTES: Record<Exclude<TokenAnswer["status"], "ok">, string> = {
	failed: "Reviews can't be written right now.",
	sign_in: BUYERS_ONLY,
	not_bought: BUYERS_ONLY,
	already_reviewed: "You've already reviewed this product.",
};

export function WriteReview({ productId }: { productId: string }) {
	const pathname = usePathname();
	const [answer, setAnswer] = useState<TokenAnswer | null>(null);
	const [checking, setChecking] = useState(false);

	if (answer?.status === "ok") {
		return <ReviewForm productId={productId} token={answer.token} />;
	}

	return (
		<div className="space-y-3">
			<Button
				variant="outline"
				// 只有检查失败时才值得重试；其他检查结果在顾客离开页面前保持有效。
				disabled={checking || (answer !== null && answer.status !== "failed")}
				onClick={async () => {
					setChecking(true);
					setAnswer(await fetchReviewToken(productId));
					setChecking(false);
				}}
			>
				{checking ? "Checking..." : "Write a Review"}
			</Button>
			{answer && (
				<p className="text-sm text-muted-foreground">
					{NOTES[answer.status]}{" "}
					{answer.status === "sign_in" && answer.canSignIn && (
						<a
							href={`/checkout/account/login?return_to=${encodeURIComponent(pathname)}`}
							className="font-medium text-foreground underline underline-offset-4"
						>
							Sign in to review
						</a>
					)}
				</p>
			)}
		</div>
	);
}

/** 携带证明购买行为的 token 提交评价：token 可来自 WriteReview 检查或已送达订单的邮件链接。 */
export function ReviewForm({ productId, token }: { productId: string; token: string }) {
	const [state, action, isPending] = useActionState(submitReview, null);
	const [rating, setRating] = useState(0);

	if (state?.success) {
		return (
			<div className="rounded-lg border border-border bg-secondary/50 p-6 text-center">
				<p className="font-medium">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="space-y-4 rounded-lg border border-border p-6">
			<h3 className="text-lg font-medium">Write a Review</h3>

			<input type="hidden" name="product" value={productId} />
			<input type="hidden" name="token" value={token} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<span className="mb-1.5 block text-sm font-medium">Rating</span>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="review-author">Name</Label>
				<Input id="review-author" name="author" type="text" required placeholder="Your name" />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="review-content">Review</Label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
					placeholder="Share your experience with this product..."
				/>
			</div>

			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}

			<Button type="submit" disabled={isPending || rating === 0}>
				{isPending ? "Submitting..." : "Submit Review"}
			</Button>
		</form>
	);
}
