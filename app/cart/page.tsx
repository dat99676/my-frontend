"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "../../lib/store";
import type { Order } from "../../lib/store";
import { formatPrice } from "../../lib/data";
import ProductTile from "../../components/ProductTile";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4EFF]";

export default function CartPage() {
  const { cart, products, cartTotal, cartCount, setQty, removeFromCart, checkout, user } = useStore();
  const [done, setDone] = useState<Order | null>(null);

  const lines = cart
    .map((l) => ({ line: l, product: products.find((p) => p.id === l.id) }))
    .filter((x): x is { line: (typeof cart)[number]; product: (typeof products)[number] } => Boolean(x.product));

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold">Đặt hàng thành công</h1>
        <p className="mt-4 text-[#101828]/75">
          Mã đơn <strong>{done.id}</strong>, tổng <strong>{formatPrice(done.total)}</strong>. Bạn thanh toán khi nhận hàng.
        </p>
        <Link
          href="/"
          className={`mt-8 inline-block rounded-full bg-[#2B4EFF] px-8 py-3 font-semibold text-white ${focus}`}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold">Giỏ hàng</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center ring-1 ring-[#101828]/10">
          <p className="text-[#101828]/70">Giỏ hàng đang trống. Hãy chọn vài sản phẩm bạn thích.</p>
          <Link
            href="/#san-pham"
            className={`mt-6 inline-block rounded-full bg-[#101828] px-7 py-3 font-semibold text-white ${focus}`}
          >
            Xem sản phẩm
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <ul className="space-y-4">
            {lines.map(({ line, product }) => (
              <li key={product.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#101828]/10">
                <ProductTile product={product} size="sm" />
                <div className="flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-[#101828]/60">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(product.id, line.qty - 1)}
                    aria-label={"Giảm số lượng " + product.name}
                    className={`h-9 w-9 rounded-full border border-[#101828]/25 font-semibold hover:bg-[#101828] hover:text-white ${focus}`}
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-semibold">{line.qty}</span>
                  <button
                    onClick={() => setQty(product.id, line.qty + 1)}
                    disabled={line.qty >= product.stock}
                    aria-label={"Tăng số lượng " + product.name}
                    className={`h-9 w-9 rounded-full border border-[#101828]/25 font-semibold hover:bg-[#101828] hover:text-white disabled:opacity-30 ${focus}`}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className={`ml-2 text-sm font-medium text-[#9B2C1C] hover:underline ${focus}`}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-[#101828]/10">
            <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#101828]/65">Số sản phẩm</dt>
                <dd className="font-medium">{cartCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#101828]/65">Phí giao hàng</dt>
                <dd className="font-medium">{cartTotal >= 500000 ? "Miễn phí" : "30.000đ"}</dd>
              </div>
              <div className="flex justify-between border-t border-[#101828]/10 pt-3 text-base">
                <dt className="font-semibold">Tổng cộng</dt>
                <dd className="font-bold text-[#2B4EFF]">
                  {formatPrice(cartTotal + (cartTotal >= 500000 ? 0 : 30000))}
                </dd>
              </div>
            </dl>

            {user ? (
              <button
                onClick={() => setDone(checkout())}
                className={`mt-6 w-full rounded-full bg-[#2B4EFF] py-3 font-semibold text-white transition hover:bg-[#1F3BD6] ${focus}`}
              >
                Đặt hàng
              </button>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-[#101828]/70">Bạn cần đăng nhập để đặt hàng.</p>
                <Link
                  href="/login"
                  className={`mt-3 block rounded-full bg-[#101828] py-3 text-center font-semibold text-white ${focus}`}
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
