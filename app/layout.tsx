import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "../lib/store";
import Header from "../components/Header";

const display = Barlow_Condensed({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-display",
});
const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QUYDAT Shop",
  description: "Cửa hàng trực tuyến QUYDAT Shop: thời trang, phụ kiện, gia dụng và đồ điện tử.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${body.className} ${display.variable} bg-[#F5F6F8] text-[#101828]`}>
        <StoreProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <footer className="mt-24 bg-[#101828] text-white/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
              <span>QUYDAT Shop. Giao hàng toàn quốc, đổi trả trong 7 ngày.</span>
              <span>© 2026 QUYDAT</span>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
