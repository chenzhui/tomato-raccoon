"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * 展示在每个通讯订阅表单上的营销许可勾选框。
 *
 * 采用商店自有的 `Checkbox` 主题，因此继承每个主题的调色板，而不是
 * 自带颜色。对于普通的 `<form action={...}>` 提交，它以 `marketingConsent` 字段名称提交
 * —— 两端都保留字面量，因为从该 "use client" 模块导出的常量传递到 Server Action 时会作为客户端引用而非字符串。
 * 它还上报 `checked` 状态，以便调用方可以在顾客勾选前禁用提交按钮；
 * 若在此处使用原生的 `required`，会因 Radix 的隐藏 input 而阻止提交，且浏览器无法聚焦到该隐藏 input 显示提示。
 */
export function NewsletterConsent({
	checked,
	onCheckedChange,
	disabled,
	className,
}: {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<Label className={cn("flex cursor-pointer items-start gap-2 text-left font-normal", className)}>
			<Checkbox
				name="marketingConsent"
				checked={checked}
				onCheckedChange={(value) => onCheckedChange(value === true)}
				disabled={disabled}
				className="mt-0.5 shrink-0"
			/>
			<span className="text-sm leading-snug opacity-80">
				I agree to receive marketing emails and accept the privacy policy. You can unsubscribe at any time.
			</span>
		</Label>
	);
}
