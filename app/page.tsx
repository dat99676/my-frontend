"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";
import { categories, formatPrice } from "../lib/data";
import ProductTile from "../components/ProductTile";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4EFF]";

export default function Home() {
  const { products, addToCart, cart } = useStore();
  const [category, setCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (category === "Tất cả" || p.category === category) && (q === "" || p.name.toLowerCase().includes(q)),
    );
  }, [products, category, query]);

  return (
    <div>
      {/* Mở đầu */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.95] sm:text-7xl md:text-[5.5rem]">
            Mua sắm gọn nhẹ, giao tận nhà.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#101828]/75">
            Thời trang, phụ kiện, đồ gia dụng và đồ điện tử được chọn lọc. Đặt hôm nay, nhận hàng trong 2 đến 4 ngày.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#san-pham"
              className={`rounded-full bg-[#2B4EFF] px-8 py-3 font-semibold text-white transition hover:bg-[#1F3BD6] ${focus}`}
            >
              Xem sản phẩm
            </a>
            <Link
              href="/login"
              className={`rounded-full border-2 border-[#101828] px-8 py-3 font-semibold transition hover:bg-[#101828] hover:text-white ${focus}`}
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "mt-8" : ""}>
              <ProductTile product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Ba cam kết của cửa hàng */}
      <section className="border-y border-[#101828]/10 bg-[#E6F55A]">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 text-sm font-semibold sm:grid-cols-3">
          <span>Miễn phí giao hàng từ 500.000đ</span>
          <span>Đổi trả trong 7 ngày</span>
          <span>Thanh toán khi nhận hàng</span>
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section id="san-pham" className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-5xl font-bold">Sản phẩm</h2>
          <label className="block md:w-80">
            <span className="sr-only">Tìm sản phẩm</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm"
              className={`w-full rounded-full border border-[#101828]/20 bg-white px-5 py-3 outline-none ${focus}`}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Tất cả", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${focus} ${
                category === c ? "bg-[#101828] text-white" : "bg-white ring-1 ring-[#101828]/15 hover:ring-[#101828]/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-12 text-[#101828]/70">Không tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác hoặc chọn Tất cả.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((p) => {
              const inCart = cart.find((l) => l.id === p.id)?.qty ?? 0;
              const soldOut = p.stock <= 0;
              const maxed = inCart >= p.stock;
              return (
                <article key={p.id} className="flex flex-col rounded-2xl bg-white p-4 ring-1 ring-[#101828]/10">
                  <ProductTile product={p} />
                  <p className="mt-4 text-xs font-medium text-[#101828]/60">{p.category}</p>
                  <h3 className="mt-1 text-base font-semibold leading-snug">{p.name}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-[#101828]/65">{p.desc}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#2B4EFF]">{formatPrice(p.price)}</p>
                      <p className="text-xs text-[#101828]/55">{soldOut ? "Hết hàng" : "Còn " + p.stock}</p>
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      disabled={soldOut || maxed}
                      className={`rounded-full bg-[#101828] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2B4EFF] disabled:cursor-not-allowed disabled:bg-[#101828]/30 ${focus}`}
                    >
                      {soldOut ? "Hết hàng" : maxed ? "Đã đủ số lượng" : "Thêm vào giỏ"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
