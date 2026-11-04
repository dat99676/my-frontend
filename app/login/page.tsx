"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/store";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4EFF]";

export default function LoginPage() {
  const { login, register, user, logout } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const err =
      mode === "login" ? await login(username, password) : await register(username, password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    // Đăng nhập xong: admin vào trang quản trị, khách về trang chủ
    router.push(username.trim().toLowerCase() === "admin" ? "/admin" : "/");
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
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95]">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h1>
        <p className="mt-5 max-w-sm leading-relaxed text-[#101828]/70">
          Khách hàng đăng nhập để đặt hàng. Quản trị viên đăng nhập để thêm, xóa sản phẩm và xem đơn hàng.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-[#101828]/10">
          <p className="font-semibold">Gợi ý</p>
          <ul className="mt-3 space-y-2 text-sm text-[#101828]/75">
            <li>Quản trị viên: tên <strong>admin</strong>, mật khẩu là mật khẩu bạn đã đặt trên Render (ADMIN_PASSWORD).</li>
            <li>Khách hàng mẫu: <strong>user</strong> / user123. Hoặc bấm Đăng ký để tạo tài khoản mới.</li>
          </ul>
          <p className="mt-4 text-xs text-[#101828]/55">
            Dữ liệu được lưu trong cơ sở dữ liệu trên máy chủ. Máy chủ miễn phí có thể mất khoảng 1 phút để thức dậy ở lần đầu.
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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
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
          {busy ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className={`mt-4 w-full text-center text-sm font-medium text-[#2B4EFF] hover:underline ${focus}`}
        >
          {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
