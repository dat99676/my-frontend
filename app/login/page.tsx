"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ACCOUNTS, useStore } from "../../lib/store";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4EFF]";

export default function LoginPage() {
  const { login, user, logout } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const u = login(username, password);
    if (!u) {
      setError("Sai tên đăng nhập hoặc mật khẩu. Hãy kiểm tra lại hoặc dùng tài khoản mẫu bên dưới.");
      return;
    }
    setError("");
    router.push(u.role === "admin" ? "/admin" : "/");
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold">Bạn đã đăng nhập</h1>
        <p className="mt-4 text-[#101828]/70">
          Đang đăng nhập với tài khoản <strong>{user.username}</strong>.
        </p>
        <button
          onClick={logout}
          className={`mt-8 rounded-full bg-[#101828] px-8 py-3 font-semibold text-white ${focus}`}
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95]">Đăng nhập</h1>
        <p className="mt-5 max-w-sm leading-relaxed text-[#101828]/70">
          Khách hàng đăng nhập để đặt hàng. Quản trị viên đăng nhập để thêm, xóa sản phẩm và xem đơn hàng.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-[#101828]/10">
          <p className="font-semibold">Tài khoản mẫu</p>
          <ul className="mt-3 space-y-3 text-sm">
            {ACCOUNTS.map((a) => (
              <li key={a.username} className="flex items-center justify-between gap-3">
                <span>
                  {a.role === "admin" ? "Quản trị viên" : "Khách hàng"}: <strong>{a.username}</strong> / {a.password}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(a.username);
                    setPassword(a.password);
                  }}
                  className={`rounded-full border border-[#101828]/30 px-3 py-1 font-medium hover:bg-[#101828] hover:text-white ${focus}`}
                >
                  Điền sẵn
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#101828]/55">
            Đây là bản giao diện để học tập. Tài khoản được kiểm tra ngay trên trình duyệt, chưa dùng cho dữ liệu thật.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 ring-1 ring-[#101828]/10" noValidate>
        <label className="block">
          <span className="text-sm font-semibold">Tên đăng nhập</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={`mt-2 w-full rounded-xl border border-[#101828]/20 px-4 py-3 outline-none ${focus}`}
          />
        </label>
        <label className="mt-5 block">
          <span className="text-sm font-semibold">Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={`mt-2 w-full rounded-xl border border-[#101828]/20 px-4 py-3 outline-none ${focus}`}
          />
        </label>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-[#FDE8E4] px-4 py-3 text-sm text-[#9B2C1C]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`mt-7 w-full rounded-full bg-[#2B4EFF] py-3 font-semibold text-white transition hover:bg-[#1F3BD6] ${focus}`}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
