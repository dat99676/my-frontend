"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { initialProducts } from "./data";
import type { Product } from "./data";

// Địa chỉ backend. Có thể đổi bằng biến NEXT_PUBLIC_API_URL khi build.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://shop-quydat.onrender.com").replace(/\/$/, "");

export type Role = "admin" | "user";
export type User = { username: string; role: Role };
export type CartLine = { id: number; qty: number };
export type Order = { id: string; user: string; total: number; count: number; date: string };

type ApiProduct = {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
  color: string;
  stock: number;
  description: string;
  image?: string | null;
};
type ApiOrder = { code: string; username: string; total: number; count: number; createdAt: string };
type AuthReply = { token: string; user: User };
type ErrorReply = { error?: string };

type ApiResult<T> = { ok: boolean; status: number; data: T | null };

async function api<T>(path: string, method = "GET", body?: unknown, token?: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data: T | null = null;
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = null;
      }
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

function errorText(r: ApiResult<unknown>, fallback: string): string {
  if (r.status === 0) {
    return "Không kết nối được máy chủ. Máy chủ miễn phí có thể đang ngủ, hãy đợi khoảng 1 phút rồi thử lại.";
  }
  if (r.status === 401 || r.status === 403) {
    return "Phiên đăng nhập đã hết hạn hoặc bạn không có quyền. Hãy đăng nhập lại.";
  }
  const msg = (r.data as ErrorReply | null)?.error;
  return msg ?? fallback + " (mã " + r.status + ")";
}

function toProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    emoji: p.emoji,
    color: p.color,
    stock: p.stock,
    desc: p.description,
    image: p.image ?? undefined,
  };
}

function toOrder(o: ApiOrder): Order {
  return {
    id: o.code,
    user: o.username,
    total: o.total,
    count: o.count,
    date: new Date(o.createdAt).toLocaleString("vi-VN"),
  };
}

type StoreValue = {
  ready: boolean;
  loadingProducts: boolean;
  apiError: string;
  user: User | null;
  login: (username: string, password: string) => Promise<string | null>;
  register: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => Promise<string | null>;
  deleteProduct: (id: number) => Promise<string | null>;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  checkout: () => Promise<{ order?: Order; error?: string }>;
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
    // trình duyệt chặn lưu trữ thì bỏ qua
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState("");
  const [auth, setAuth] = useState<AuthReply | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const user = auth ? auth.user : null;
  const token = auth ? auth.token : undefined;

  const refreshProducts = useCallback(async () => {
    const r = await api<ApiProduct[]>("/api/products");
    if (r.ok && r.data) {
      const list = r.data.map(toProduct);
      setProducts(list);
      setCart((prev) => prev.filter((l) => list.some((p) => p.id === l.id)));
      setApiError("");
    } else {
      setApiError(errorText(r, "Không tải được sản phẩm"));
    }
    setLoadingProducts(false);
  }, []);

  const refreshOrders = useCallback(async (t: string | undefined) => {
    if (!t) {
      setOrders([]);
      return;
    }
    const r = await api<ApiOrder[]>("/api/orders", "GET", undefined, t);
    if (r.ok && r.data) setOrders(r.data.map(toOrder));
  }, []);

  // Khi trang vừa mở: đọc đăng nhập và giỏ hàng đã lưu, rồi lấy sản phẩm từ backend
  useEffect(() => {
    setAuth(load<AuthReply | null>("shop_auth", null));
    setCart(load<CartLine[]>("shop_cart", []));
    setReady(true);
    void refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (ready) save("shop_auth", auth);
  }, [auth, ready]);
  useEffect(() => {
    if (ready) save("shop_cart", cart);
  }, [cart, ready]);

  useEffect(() => {
    if (ready) void refreshOrders(token);
  }, [token, ready, refreshOrders]);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    const r = await api<AuthReply>("/api/auth/login", "POST", { username, password });
    if (r.ok && r.data) {
      setAuth(r.data);
      return null;
    }
    return errorText(r, "Đăng nhập không thành công");
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<string | null> => {
    const r = await api<AuthReply>("/api/auth/register", "POST", { username, password });
    if (r.ok && r.data) {
      setAuth(r.data);
      return null;
    }
    return errorText(r, "Đăng ký không thành công");
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    setOrders([]);
  }, []);

  const addProduct = useCallback(
    async (p: Omit<Product, "id">): Promise<string | null> => {
      const r = await api<ApiProduct>(
        "/api/products",
        "POST",
        {
          name: p.name,
          price: p.price,
          category: p.category,
          emoji: p.emoji,
          color: p.color,
          stock: p.stock,
          description: p.desc,
          image: p.image ?? null,
        },
        token,
      );
      if (!r.ok) return errorText(r, "Không thêm được sản phẩm");
      await refreshProducts();
      return null;
    },
    [token, refreshProducts],
  );

  const deleteProduct = useCallback(
    async (id: number): Promise<string | null> => {
      const r = await api<unknown>("/api/products/" + id, "DELETE", undefined, token);
      if (!r.ok) return errorText(r, "Không xóa được sản phẩm");
      await refreshProducts();
      return null;
    },
    [token, refreshProducts],
  );

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

  const checkout = useCallback(async (): Promise<{ order?: Order; error?: string }> => {
    if (!auth || cart.length === 0) return { error: "Bạn cần đăng nhập và có sản phẩm trong giỏ." };
    const r = await api<{ code: string; total: number; count: number; createdAt: string }>(
      "/api/orders",
      "POST",
      { items: cart.map((l) => ({ productId: l.id, qty: l.qty })) },
      auth.token,
    );
    if (!r.ok || !r.data) return { error: errorText(r, "Đặt hàng không thành công") };
    const order: Order = {
      id: r.data.code,
      user: auth.user.username,
      total: r.data.total,
      count: r.data.count,
      date: new Date(r.data.createdAt).toLocaleString("vi-VN"),
    };
    setCart([]);
    await refreshProducts();
    await refreshOrders(auth.token);
    return { order };
  }, [auth, cart, refreshProducts, refreshOrders]);

  const value: StoreValue = {
    ready,
    loadingProducts,
    apiError,
    user,
    login,
    register,
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
