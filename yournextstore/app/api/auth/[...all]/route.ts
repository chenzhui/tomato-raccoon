import { type NextRequest, NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "@/lib/commerce";

async function handler(request: NextRequest) {
	// better-auth 运行在主域名（apex，全局用户系统）上，而不是租户子域名上 —— 在
	// 租户子域名上 `/api/auth/*` 会被重写到 `[domain]` 并导致 404。因此目标指向主域名，
	// 与 proxy.ts 中的页面代理保持一致。
	const { publicUrl } = await getSubdomainPublicUrl();

	const url = new URL(request.nextUrl.pathname + request.nextUrl.search, publicUrl);

	const requestHeaders = new Headers(request.headers);
	requestHeaders.delete("host");
	requestHeaders.delete("accept-encoding");

	const body =
		request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

	try {
		const response = await fetch(url, {
			method: request.method,
			headers: requestHeaders,
			body,
		});

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding");
		responseHeaders.delete("content-length");

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error(`[auth proxy] ${request.method} ${url.toString()} failed:`, error);
		return NextResponse.json({ error: "Auth proxy request failed" }, { status: 502 });
	}
}

export { handler as GET, handler as POST };
