"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../lib/store";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4EFF]";

export default function Header() {
  const { user, logout, cartCount, ready } = useStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#101828]/10 bg-[#F5F6F8]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className={`font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight ${focus}`}
        >
          QUYDAT<span className="text-[#2B4EFF]"> Shop</span>
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium sm:gap-5">
          {ready && user?.role === "admin" && (
            <Link href="/admin" className={`rounded-full bg-[#E6F55A] px-4 py-2 font-semibold ${focus}`}>
              Quản trị
            </Link>
          )}

          <Link href="/cart" className={`relative rounded-full px-3 py-2 hover:bg-white ${focus}`}>
            Giỏ hàng
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#2B4EFF] px-1.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {ready && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">
                Xin chào, <strong>{user.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className={`rounded-full border border-[#101828] px-4 py-2 font-semibold transition hover:bg-[#101828] hover:text-white ${focus}`}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`rounded-full bg-[#101828] px-5 py-2 font-semibold text-white transition hover:bg-[#2B4EFF] ${focus}`}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
