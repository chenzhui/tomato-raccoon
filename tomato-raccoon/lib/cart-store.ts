import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "./types";
import { useEffect, useState } from "react";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.variantId}`;
        const existingItem = get().items.find((i) => i.id === id);

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...newItem, id }],
            isOpen: true,
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "tomato_raccoon_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * 客户端安全 Hydration Hook，避免 SSR 与 LocalStorage 初始渲染不匹配
 */
export function useCart() {
  const store = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = mounted ? store.items : [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // 满 $50 全美包邮，不足收取 $4.99 基础运费 (USPS Ground)
  const shipping = items.length === 0 ? 0 : subtotal >= 5000 ? 0 : 499;
  const total = subtotal + shipping;

  return {
    ...store,
    items,
    totalItems,
    subtotal,
    shipping,
    total,
    isMounted: mounted,
  };
}
