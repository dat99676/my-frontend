import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";

// Barlow Condensed: chữ hẹp, đậm, gợi biển hiệu cảng và container.
// Be Vietnam Pro: thiết kế riêng cho tiếng Việt nên dấu luôn rõ ràng.
const display = Barlow_Condensed({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
});
const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Bảng màu lấy từ container hàng hải, đã giảm độ bão hòa cho dịu mắt.
const INK = "#12202F"; // xanh mực đậm: chữ và các khối tối
// nền sáng: #EDF1F4 · xanh biển: #2F5D7C · xanh rêu: #2E7D6B
// vàng tín hiệu: #E9B72E · đỏ gạch: #B8402F

// Vân tôn lượn sóng của thân container.
const CORRUGATION =
  "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 22%), repeating-linear-gradient(90deg, rgba(0,0,0,0.13) 0px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 11px)";

const stack = [
  { title: "Next.js 14", sub: "Giao diện website", color: "#2F5D7C", text: "#FFFFFF", width: "88%", offset: "0%", delay: 450 },
  { title: "Docker", sub: "Đóng gói thành image", color: "#2E7D6B", text: "#FFFFFF", width: "100%", offset: "0%", delay: 300 },
  { title: "GitHub Actions", sub: "Tự build mỗi lần push", color: "#E9B72E", text: INK, width: "94%", offset: "6%", delay: 150 },
  { title: "Render", sub: "Chạy trực tuyến", color: "#B8402F", text: "#FFFFFF", width: "82%", offset: "10%", delay: 0 },
];

const steps = [
  {
    title: "Đẩy code",
    tool: "Git và GitHub",
    desc: "Bạn đẩy code lên nhánh main. Việc này tự khởi động quy trình, không cần bấm thêm gì.",
  },
  {
    title: "Build image",
    tool: "GitHub Actions",
    desc: "Máy chủ của GitHub đọc Dockerfile rồi build image, gắn hai tag là latest và mã commit.",
  },
  {
    title: "Lưu image",
    tool: "Docker Hub",
    desc: "Image được lưu tại quydat14/frontend-app, sẵn sàng để bất kỳ máy chủ nào kéo về.",
  },
  {
    title: "Chạy trực tuyến",
    tool: "Render",
    desc: "Render kéo image mới về và chạy website, cấp cho bạn một địa chỉ onrender.com để chia sẻ.",
  },
];

const specs = [
  { label: "Image", value: "quydat14/frontend-app:latest" },
  { label: "Framework", value: "Next.js 14.2" },
  { label: "Cổng chạy", value: "10000, do Render cấp" },
  { label: "Gói dịch vụ", value: "Free, 512 MB RAM" },
];

const benefits = [
  {
    color: "#2F5D7C",
    title: "Không làm thủ công",
    desc: "Build và đóng gói đều do máy làm, bạn chỉ cần viết code rồi push.",
  },
  {
    color: "#2E7D6B",
    title: "Chạy giống nhau ở mọi nơi",
    desc: "Container mang theo toàn bộ môi trường, nên máy bạn chạy sao thì máy chủ chạy vậy.",
  },
  {
    color: "#E9B72E",
    title: "Mật khẩu không nằm trong code",
    desc: "Tài khoản Docker Hub được cất trong GitHub Secrets, không lộ ra repo.",
  },
];

const focusLight =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12202F]";

function ContainerBlock({
  title,
  sub,
  color,
  text,
  width,
  offset,
  delay,
}: (typeof stack)[number]) {
  return (
    <div
      className="drop relative flex items-center justify-between gap-4 rounded-sm px-8 py-5 shadow-[0_6px_0_rgba(18,32,47,0.18)]"
      style={{
        backgroundColor: color,
        backgroundImage: CORRUGATION,
        color: text,
        width,
        marginLeft: offset,
        animationDelay: `${delay}ms`,
      }}
    >
      <span aria-hidden="true" className="absolute left-0 top-0 h-3 w-3 bg-black/30" />
      <span aria-hidden="true" className="absolute right-0 top-0 h-3 w-3 bg-black/30" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-3 w-3 bg-black/30" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-3 w-3 bg-black/30" />
      <div>
        <p className={`${display.className} text-3xl font-bold leading-none sm:text-4xl`}>
          {title}
        </p>
        <p className="mt-1.5 text-sm font-medium opacity-90">{sub}</p>
      </div>
      <div aria-hidden="true" className="flex gap-1.5">
        <span className="h-12 w-1 rounded-full bg-black/25" />
        <span className="h-12 w-1 rounded-full bg-black/25" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div
      id="top"
      className={`${body.className} min-h-screen bg-[#EDF1F4] text-[#12202F]`}
    >
      <style>{`
        @keyframes drop-in {
          from { transform: translateY(-56px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .drop { animation: drop-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .drop { animation: none; }
        }
      `}</style>

      {/* Đầu trang */}
      <header className="border-b border-[#12202F]/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="#top"
            className={`${display.className} flex items-center gap-3 text-2xl font-bold ${focusLight}`}
          >
            <span aria-hidden="true" className="flex flex-col gap-[3px]">
              <span className="h-2 w-7 bg-[#2F5D7C]" />
              <span className="ml-1.5 h-2 w-7 bg-[#E9B72E]" />
              <span className="h-2 w-7 bg-[#2E7D6B]" />
            </span>
            KÊNH AI ĐỜI SỐNG
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#quy-trinh" className={`hover:underline ${focusLight}`}>
              Quy trình
            </a>
            <a href="#thong-so" className={`hover:underline ${focusLight}`}>
              Thông số
            </a>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium ring-1 ring-[#12202F]/15">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#2E7D6B]" />
            Đang trực tuyến
          </span>
        </nav>
      </header>

      <main>
        {/* Mở đầu */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div>
            <h1
              className={`${display.className} text-[3.6rem] font-bold leading-[0.95] sm:text-7xl md:text-[5.5rem]`}
            >
              Đẩy code lên, website tự cập nhật.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#12202F]/80">
              Dự án frontend viết bằng Next.js, đóng gói bằng Docker và tự động
              triển khai lên Render thông qua GitHub Actions.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#quy-trinh"
                className={`rounded-sm bg-[#E9B72E] px-7 py-3 font-semibold text-[#12202F] transition hover:bg-[#F2C545] ${focusLight}`}
              >
                Xem quy trình
              </a>
              <a
                href="#thong-so"
                className={`rounded-sm border-2 border-[#12202F] px-7 py-3 font-semibold transition hover:bg-[#12202F] hover:text-white ${focusLight}`}
              >
                Xem thông số
              </a>
            </div>
          </div>

          {/* Chồng container: điểm nhấn duy nhất của trang */}
          <div className="border-b-4 border-[#12202F] pb-3">
            <div className="flex flex-col gap-1.5">
              {stack.map((c) => (
                <ContainerBlock key={c.title} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section id="quy-trinh" className="bg-[#12202F] text-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2
              className={`${display.className} max-w-2xl text-4xl font-bold leading-tight md:text-6xl`}
            >
              Bốn bước từ lúc push đến lúc trực tuyến
            </h2>
            <ol className="mt-12 border-t border-white/15">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid gap-2 border-b border-white/15 py-7 md:grid-cols-[5rem_1fr_1.5fr_9rem] md:items-baseline md:gap-8"
                >
                  <span
                    className={`${display.className} text-4xl font-bold text-[#E9B72E]`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`${display.className} text-3xl font-semibold`}>
                    {s.title}
                  </h3>
                  <p className="max-w-md leading-relaxed text-white/75">{s.desc}</p>
                  <span className="text-sm font-medium text-white/60 md:text-right">
                    {s.tool}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Thông số và lợi ích */}
        <section
          id="thong-so"
          className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2"
        >
          <div>
            <h2 className={`${display.className} text-4xl font-bold md:text-5xl`}>
              Thông số bản triển khai
            </h2>
            <div className="mt-8 overflow-hidden rounded-md border-2 border-[#12202F] bg-white">
              <div className="flex items-center justify-between bg-[#12202F] px-5 py-3 text-white">
                <span className="font-semibold">frontend-app</span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#4FC3A1]"
                  />
                  Live
                </span>
              </div>
              <dl>
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col gap-1 border-t border-[#12202F]/15 px-5 py-4 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-sm text-[#12202F]/65">{s.label}</dt>
                    <dd className="break-all font-semibold sm:text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className={`${display.className} text-4xl font-bold md:text-5xl`}>
              Vì sao làm theo cách này
            </h2>
            <ul className="mt-8 space-y-8">
              {benefits.map((b) => (
                <li
                  key={b.title}
                  className="border-l-8 pl-5"
                  style={{ borderColor: b.color }}
                >
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-1 max-w-md leading-relaxed text-[#12202F]/75">
                    {b.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Chân trang */}
      <footer className="bg-[#12202F] text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <span>Bài thực hành CI/CD với Docker và GitHub Actions.</span>
          <span>© 2026 frontend-app</span>
        </div>
      </footer>
    </div>
  );
}