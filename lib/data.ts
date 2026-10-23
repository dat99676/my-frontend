export type Product = {
  id: number;
  name: string;
  price: number; // đơn vị: đồng
  category: string;
  emoji: string;
  color: string; // màu nền của ô sản phẩm
  stock: number;
  desc: string;
  image?: string; // đường dẫn ảnh thật, ví dụ /images/ao-thun.jpg (không bắt buộc)
};

export const categories = ["Thời trang", "Phụ kiện", "Gia dụng", "Điện tử"];

export const initialProducts: Product[] = [
  { id: 1, name: "Áo thun cotton basic", price: 159000, category: "Thời trang", emoji: "👕", color: "#CFE3FF", stock: 40, desc: "Vải cotton dày dặn, mặc mát, giặt không xù." },
  { id: 2, name: "Quần jeans ống suông", price: 349000, category: "Thời trang", emoji: "👖", color: "#C9D6F2", stock: 25, desc: "Form suông thoải mái, màu xanh đậm dễ phối đồ." },
  { id: 3, name: "Áo khoác gió nhẹ", price: 429000, category: "Thời trang", emoji: "🧥", color: "#E3EBC4", stock: 18, desc: "Chống gió, chống nước nhẹ, gấp gọn bỏ vừa balo." },
  { id: 4, name: "Giày sneaker trắng", price: 529000, category: "Thời trang", emoji: "👟", color: "#F3E1D3", stock: 30, desc: "Đế êm, da tổng hợp dễ lau chùi." },
  { id: 5, name: "Balo đi học chống sốc", price: 289000, category: "Phụ kiện", emoji: "🎒", color: "#FBE3A6", stock: 22, desc: "Ngăn laptop 15 inch, quai đeo êm vai." },
  { id: 6, name: "Mũ lưỡi trai", price: 99000, category: "Phụ kiện", emoji: "🧢", color: "#F6C9C0", stock: 50, desc: "Khóa chỉnh size phía sau, vải thoáng." },
  { id: 7, name: "Kính râm chống UV", price: 189000, category: "Phụ kiện", emoji: "🕶️", color: "#D5D5E8", stock: 35, desc: "Tròng chống tia UV400, gọng nhẹ." },
  { id: 8, name: "Bình giữ nhiệt 500ml", price: 219000, category: "Gia dụng", emoji: "🧴", color: "#C8EBDD", stock: 45, desc: "Giữ nóng 8 giờ, giữ lạnh 12 giờ." },
  { id: 9, name: "Bộ ly thủy tinh 6 chiếc", price: 179000, category: "Gia dụng", emoji: "🥛", color: "#D8EEF5", stock: 20, desc: "Thủy tinh chịu nhiệt, dùng được cả nước nóng." },
  { id: 10, name: "Tai nghe không dây", price: 649000, category: "Điện tử", emoji: "🎧", color: "#DCD3F5", stock: 15, desc: "Bluetooth 5.3, pin dùng liên tục 20 giờ." },
  { id: 11, name: "Sạc dự phòng 10.000mAh", price: 339000, category: "Điện tử", emoji: "🔋", color: "#F9DDB5", stock: 28, desc: "Sạc nhanh 20W, hai cổng ra." },
  { id: 12, name: "Chuột không dây", price: 249000, category: "Điện tử", emoji: "🖱️", color: "#D6E4D0", stock: 32, desc: "Nhỏ gọn, click êm, dùng pin AA bền." },
];

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}
