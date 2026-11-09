import { readCart } from "@/lib/cart";

// 读取购物车采用 GET 请求，而不是 Server Action：路由器一次只按顺序执行一个页面的 action，
// 因此组件挂载时的 action 读取操作会阻塞顾客的首次“加入购物车”操作。
// 绝不缓存：`private` 防止 CDN 将一个顾客的购物车分发给另一个顾客，
// `no-store` 防止顾客结账后按浏览器的“后退”按钮恢复刚刚已支付的购物车。
export async function GET() {
	return Response.json(await readCart(), {
		headers: { "Cache-Control": "private, no-store" },
	});
}
