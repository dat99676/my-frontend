"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useStore } from "../../lib/store";
import { categories, formatPrice } from "../../lib/data";
import ProductTile from "../../components/ProductTile";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4EFF]";
const input = `mt-1 w-full rounded-xl border border-[#101828]/20 bg-white px-3 py-2.5 outline-none ${focus}`;

const tileColors = ["#CFE3FF", "#FBE3A6", "#C8EBDD", "#F6C9C0", "#DCD3F5", "#D6E4D0"];

export default function AdminPage() {
  const { ready, user, products, addProduct, deleteProduct, orders } = useStore();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [category, setCategory] = useState(categories[0]);
  const [emoji, setEmoji] = useState("🛍️");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");

  if (!ready) {
    return <p className="mx-auto max-w-5xl px-6 py-20 text-[#101828]/60">Đang tải...</p>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold">Chỉ dành cho quản trị viên</h1>
        <p className="mt-4 text-[#101828]/70">
          Hãy đăng nhập bằng tài khoản admin để quản lý sản phẩm và đơn hàng.
        </p>
        <Link
          href="/login"
          className={`mt-8 inline-block rounded-full bg-[#2B4EFF] px-8 py-3 font-semibold text-white ${focus}`}
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (name.trim() === "") {
      setError("Hãy nhập tên sản phẩm.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Giá phải là một số lớn hơn 0.");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setError("Số lượng tồn kho phải là số nguyên từ 0 trở lên.");
      return;
    }
    addProduct({
      name: name.trim(),
      price: priceNum,
      stock: stockNum,
      category,
      emoji: emoji.trim() || "🛍️",
      color: tileColors[products.length % tileColors.length],
      desc: desc.trim() || "Sản phẩm mới của cửa hàng.",
      image: image.trim() || undefined,
    });
    setAdded(name.trim());
    setError("");
    setName("");
    setPrice("");
    setDesc("");
    setImage("");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold">Quản trị cửa hàng</h1>
      <p className="mt-3 text-[#101828]/70">
        Đăng nhập với tài khoản <strong>{user.username}</strong>. Mọi thay đổi hiện ngay trên trang bán hàng.
      </p>

      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-[#101828]/10">
          <dt className="text-sm text-[#101828]/60">Sản phẩm</dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-5xl font-bold">{products.length}</dd>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-[#101828]/10">
          <dt className="text-sm text-[#101828]/60">Đơn hàng</dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-5xl font-bold">{orders.length}</dd>
        </div>
        <div className="rounded-2xl bg-[#E6F55A] p-6">
          <dt className="text-sm text-[#101828]/70">Doanh thu</dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-5xl font-bold">{formatPrice(revenue)}</dd>
        </div>
      </dl>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Thêm sản phẩm */}
        <form onSubmit={handleAdd} className="h-fit rounded-2xl bg-white p-6 ring-1 ring-[#101828]/10" noValidate>
          <h2 className="text-xl font-semibold">Thêm sản phẩm</h2>

          <label className="mt-5 block text-sm font-semibold">
            Tên sản phẩm
            <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">
              Giá (đồng)
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="numeric"
                placeholder="199000"
                className={input}
              />
            </label>
            <label className="block text-sm font-semibold">
              Tồn kho
              <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" className={input} />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">
              Danh mục
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Biểu tượng
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className={input} />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold">
            Đường dẫn ảnh (không bắt buộc)
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/ten-anh.jpg"
              className={input}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Mô tả ngắn
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className={input} />
          </label>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-[#FDE8E4] px-4 py-3 text-sm text-[#9B2C1C]">
              {error}
            </p>
          )}
          {added && !error && (
            <p role="status" className="mt-4 rounded-xl bg-[#E4F5EC] px-4 py-3 text-sm text-[#1E6B47]">
              Đã thêm sản phẩm {added}.
            </p>
          )}

          <button
            type="submit"
            className={`mt-6 w-full rounded-full bg-[#2B4EFF] py-3 font-semibold text-white transition hover:bg-[#1F3BD6] ${focus}`}
          >
            Thêm sản phẩm
          </button>
        </form>

        {/* Danh sách sản phẩm */}
        <section>
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
          <ul className="mt-5 space-y-3">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-[#101828]/10">
                <ProductTile product={p} size="sm" />
                <div className="flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-[#101828]/60">
                    {p.category}, {formatPrice(p.price)}, tồn {p.stock}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Xóa sản phẩm " + p.name + "?")) deleteProduct(p.id);
                  }}
                  className={`rounded-full border border-[#9B2C1C]/40 px-4 py-1.5 text-sm font-semibold text-[#9B2C1C] hover:bg-[#9B2C1C] hover:text-white ${focus}`}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Đơn hàng */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold">Đơn hàng gần đây</h2>
        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-white p-6 text-[#101828]/65 ring-1 ring-[#101828]/10">
            Chưa có đơn hàng nào. Đơn xuất hiện ở đây khi khách bấm Đặt hàng ở trang giỏ hàng.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-[#101828]/10">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-[#101828] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Số sản phẩm</th>
                  <th className="px-4 py-3 font-semibold">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-[#101828]/10">
                    <td className="px-4 py-3 font-semibold">{o.id}</td>
                    <td className="px-4 py-3">{o.user}</td>
                    <td className="px-4 py-3">{o.count}</td>
                    <td className="px-4 py-3 font-semibold text-[#2B4EFF]">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-[#101828]/65">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
