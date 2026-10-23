"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { initialProducts } from "./data";
import type { Product } from "./data";

export type Role = "admin" | "user";
export type User = { username: string; role: Role };
export type CartLine = { id: number; qty: number };
export type Order = { id: string; user: string; total: number; count: number; date: string };

// Tài khoản mẫu để học và thử nghiệm. Đây chỉ là giao diện, chưa có máy chủ kiểm tra thật.
export const ACCOUNTS: { username: string; password: string; role: Role }[] = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];

type StoreValue = {
  ready: boolean;
  user: User | null;
  login: (username: string, password: string) => User | null;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  deleteProduct: (id: number) => void;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  checkout: () => Order | null;
  orders: Order[];
};

const StoreContext = createContext<StoreValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // trình duyệt chặn lưu trữ thì bỏ qua, web vẫn chạy bình thường
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Đọc dữ liệu đã lưu khi trang vừa mở
  useEffect(() => {
    setUser(load<User | null>("shop_user", null));
    setProducts(load<Product[]>("shop_products", initialProducts));
    setCart(load<CartLine[]>("shop_cart", []));
    setOrders(load<Order[]>("shop_orders", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save("shop_user", user);
  }, [user, ready]);
  useEffect(() => {
    if (ready) save("shop_products", products);
  }, [products, ready]);
  useEffect(() => {
    if (ready) save("shop_cart", cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) save("shop_orders", orders);
  }, [orders, ready]);

  const login = useCallback((username: string, password: string): User | null => {
    const found = ACCOUNTS.find(
      (a) => a.username === username.trim().toLowerCase() && a.password === password,
    );
    if (!found) return null;
    const u: User = { username: found.username, role: found.role };
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    setProducts((prev) => {
      const nextId = prev.reduce((m, x) => Math.max(m, x.id), 0) + 1;
      return [{ ...p, id: nextId }, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addToCart = useCallback(
    (id: number) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      setCart((prev) => {
        const line = prev.find((l) => l.id === id);
        if (!line) return product.stock > 0 ? [...prev, { id, qty: 1 }] : prev;
        if (line.qty >= product.stock) return prev;
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      });
    },
    [products],
  );

  const setQty = useCallback(
    (id: number, qty: number) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const safe = Math.min(Math.max(qty, 0), product.stock);
      setCart((prev) =>
        safe === 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: safe } : l)),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p = products.find((x) => x.id === l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart, products],
  );

  const checkout = useCallback((): Order | null => {
    if (!user || cart.length === 0) return null;
    const order: Order = {
      id: "DH" + Date.now().toString().slice(-6),
      user: user.username,
      total: cartTotal,
      count: cartCount,
      date: new Date().toLocaleString("vi-VN"),
    };
    setProducts((prev) =>
      prev.map((p) => {
        const line = cart.find((l) => l.id === p.id);
        return line ? { ...p, stock: Math.max(p.stock - line.qty, 0) } : p;
      }),
    );
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  }, [user, cart, cartTotal, cartCount]);

  const value: StoreValue = {
    ready,
    user,
    login,
    logout,
    products,
    addProduct,
    deleteProduct,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    setQty,
    removeFromCart,
    checkout,
    orders,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore phải nằm trong StoreProvider");
  return ctx;
}
