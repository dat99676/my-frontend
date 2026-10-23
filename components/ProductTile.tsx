import type { Product } from "../lib/data";

// Ô hiển thị sản phẩm: dùng ảnh thật nếu có, không thì dùng màu nền và biểu tượng.
export default function ProductTile({ product, size = "lg" }: { product: Product; size?: "sm" | "lg" }) {
  const hasImage = Boolean(product.image);
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${
        size === "lg" ? "aspect-[4/3] w-full rounded-xl" : "h-14 w-14 shrink-0 rounded-lg"
      }`}
      style={{
        backgroundColor: product.color,
        backgroundImage: hasImage ? `url(${product.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="img"
      aria-label={product.name}
    >
      {!hasImage && <span className={size === "lg" ? "text-7xl" : "text-3xl"}>{product.emoji}</span>}
    </div>
  );
}
