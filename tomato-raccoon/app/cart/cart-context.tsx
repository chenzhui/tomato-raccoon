"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import {
	type Cart,
	type CartAction,
	type CartLineItem,
	cartReducer,
	getCartDisplaySubtotal,
	getLineItemUnitPrice,
} from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";

// 重新导出，方便调用方继续从 context 模块直接导入购物车类型及计价工具。
export { type Cart, type CartLineItem, getLineItemUnitPrice };

type CartContextValue = {
	cart: Cart | null;
	items: CartLineItem[];
	itemCount: number;
	subtotal: bigint;
	isOpen: boolean;
	isMutating: boolean;
	cartId: string | null;
	openCart: () => void;
	closeCart: () => void;
	/** 纯本地即时状态变更，用于乐观 UI 反馈。 */
	dispatch: (action: CartAction) => void;
	/** 用服务端权威的购物车状态替换本地状态（传入 null 时为空操作）。 */
	syncCart: (next: Cart | null) => void;
	/** 从服务端重新拉取权威购物车 —— 仅在写入失败时调用。 */
	reconcile: () => Promise<void>;
	startMutation: (fn: () => void | Promise<void>) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// 采用 GET 请求而非 Server Action：路由器一次按顺序执行一个 action，因此 action
// 读取会阻塞顾客的首次“加入购物车”操作。此处使用 no-store 且路由配合设置
// Cache-Control: private, no-store：顾客结账后按后退键绝不能恢复已支付的购物车。
// 请求失败或状态非 OK 时 reject，以便调用方保留当前购物车。
async function fetchCart() {
	const response = await fetch("/api/cart", { cache: "no-store" });
	if (!response.ok) {
		throw new Error(`cart: GET /api/cart answered ${response.status}`);
	}
	return (await response.json()) as Cart | null;
}

type CartProviderProps = {
	children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
	const { taxBehavior } = useStoreConfig();
	const [isOpen, setIsOpen] = useState(false);
	const [isMutating, startMutation] = useTransition();

	// 纯原生 state —— 未使用 useOptimistic。dispatch 应用本地变更以获得即时反馈；
	// syncCart 则直接用服务端的权威购物车替换它。由于状态绝不重新基线化（rebase），
	// 本地变更绝不会在已同步的购物车之上被重复应用。
	//
	// 初始为 EMPTY 并在浏览器端加载（见下方 effect）：购物车属于 cookie 读取操作，
	// 在服务端读取会导致所有页面变成按请求实时渲染，无法使用静态预渲染。
	const [cart, setCart] = useState<Cart | null>(null);
	// 每次写入时置为 true。防止初始购物车加载晚于顾客在页面加载完成前所做的修改，
	// 从而避免覆盖顾客的本地操作。
	const written = useRef(false);

	// 此 Provider 中无需使用 useCallback/useMemo：React 编译器会自动缓存回调函数、
	// 派生值及 context 对象。
	const dispatch = (action: CartAction) => {
		written.current = true;
		setCart((prev) => cartReducer(prev, action));
	};
	const syncCart = (next: Cart | null) => {
		written.current = true;
		setCart(next);
	};
	const reconcile = async () => {
		written.current = true;
		// 若重新获取失败，继续展示当前购物车 —— 绝不产生未捕获的 Promise rejection。
		await fetchCart()
			.then(setCart)
			.catch(() => undefined);
	};

	useEffect(() => {
		// 每次页面完整加载仅读取一次；客户端软导航会保持本 Provider 持续挂载。
		// 先完成的写入操作优先，加载失败时保持购物车为空，绝不产生未捕获的 rejection。
		void fetchCart()
			.then((initial) => {
				if (!written.current) {
					setCart(initial);
				}
			})
			.catch(() => undefined);
	}, []);

	useEffect(() => {
		// 当从往返缓存（bfcache）恢复时重新拉取购物车 —— 顾客可能在独立托管的
		// 结账页面（不同源）修改了购物车，否则会展示过期商品。
		// 重新拉取逻辑直接写在 effect 内部而非调用 reconcile，使 effect 无额外依赖项。
		const onPageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				written.current = true;
				// 若重新获取失败，继续展示当前购物车 —— 绝不产生未捕获的 Promise rejection。
				void fetchCart()
					.then(setCart)
					.catch(() => undefined);
			}
		};
		window.addEventListener("pageshow", onPageShow);
		return () => window.removeEventListener("pageshow", onPageShow);
	}, []);

	const items = cart?.lineItems ?? [];
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	// 当购物车来自服务端时，采用 API 计算的小计（已根据店铺计税规则计算净额/毛额并扣除折扣）；
	// 当变更请求正在进行时，使用本地展示价格之和，因为 cartReducer 会清除刚失效的总金额。
	const subtotal = getCartDisplaySubtotal(cart, taxBehavior);

	// 哨兵 ID "local" 标识服务端尚未确认的 null-base ADD 操作。
	const cartId = cart?.id && cart.id !== "local" ? cart.id : null;

	const value = {
		cart,
		items,
		itemCount,
		subtotal,
		isOpen,
		isMutating,
		cartId,
		openCart: () => setIsOpen(true),
		closeCart: () => setIsOpen(false),
		dispatch,
		syncCart,
		reconcile,
		startMutation,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
