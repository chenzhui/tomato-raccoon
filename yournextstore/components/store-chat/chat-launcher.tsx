"use client";

import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// 聊天面板（连同其引入的 AI SDK）仅在首次打开时加载 —— 绝不包含在初始打包产物中。
const ChatPanel = dynamic(() => import("./chat-panel").then((mod) => mod.ChatPanel));

export type StoreChatConfig = {
	assistantName: string | null;
	greeting: string | null;
	suggestedQuestions: string[];
	storeName: string;
	currency: string;
	locale: string;
};

export function StoreChatLauncher({ badge, ...config }: StoreChatConfig & { badge?: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// `?chat=open`（管理后台预览链接）会在加载时直接展开聊天面板。
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("chat") === "open") {
			setOpen(true);
			setLoaded(true);
		}
	}, []);

	const openChat = () => {
		setLoaded(true);
		setOpen(true);
	};

	return (
		<>
			{loaded && <ChatPanel config={config} open={open} onClose={() => setOpen(false)} />}
			{/* 徽章和启动按钮共用一个停靠区，确保它们永不重叠。
			    面板展开时会占据该角落位置，因此整个停靠区将自动隐藏让位。 */}
			<div className={cn("fixed bottom-4 right-4 z-40 flex items-center gap-2", open && "hidden")}>
				{badge}
				<button
					type="button"
					onClick={openChat}
					aria-label={`Chat with ${config.assistantName ?? config.storeName}`}
					className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
				>
					<MessageCircle className="h-5 w-5" />
				</button>
			</div>
		</>
	);
}
