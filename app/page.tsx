import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";

const display = Barlow_Condensed({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const stack = [
  { title: "Next.js 14", sub: "Giao diện website", color: "#173D61", text: "#fff", width: "88%", icon: "N" },
  { title: "Docker", sub: "Đóng gói thành image", color: "#087E83", text: "#fff", width: "100%", icon: "◆" },
  { title: "GitHub Actions", sub: "Tự build mỗi lần push", color: "#E9B72E", text: "#14283D", width: "96%", icon: "⌘" },
  { title: "Render", sub: "Chạy trực tuyến", color: "#B8403A", text: "#fff", width: "91%", icon: "▰" },
];

const steps = [
  { number: "01", title: "Đẩy code", tool: "Git và GitHub", icon: "↗", desc: "Bạn đẩy code lên nhánh main. Thao tác này tự khởi động quy trình triển khai." },
  { number: "02", title: "Build image", tool: "GitHub Actions", icon: "⌘", desc: "GitHub Actions đọc Dockerfile, build image và gắn tag latest cùng mã commit." },
  { number: "03", title: "Lưu image", tool: "Docker Hub", icon: "▦", desc: "Image được lưu tại quydat14/frontend-app để máy chủ có thể tải về." },
  { number: "04", title: "Chạy trực tuyến", tool: "Render", icon: "▰", desc: "Render tải image mới và chạy website, cấp địa chỉ onrender.com để chia sẻ." },
];

const specs = [
  ["Image", "quydat14/frontend-app:latest"],
  ["Framework", "Next.js 14.2"],
  ["Cổng chạy", "10000, do Render cấp"],
  ["Gói dịch vụ", "Free · 512 MB RAM"],
];

const benefits = [
  { icon: "↯", title: "Không làm thủ công", desc: "Build và đóng gói đều do máy thực hiện; bạn chỉ cần viết code rồi push.", color: "#245C86" },
  { icon: "◈", title: "Chạy nhất quán ở mọi nơi", desc: "Container mang theo môi trường cần thiết, giúp ứng dụng hoạt động ổn định.", color: "#168A83" },
  { icon: "⌑", title: "Bảo mật thông tin", desc: "Thông tin đăng nhập Docker Hub được lưu trong GitHub Secrets, không đưa vào source code.", color: "#D99A08" },
];

const technologies = [
  { name: "Next.js 14", desc: "Xây dựng giao diện website", icon: "N" },
  { name: "Docker", desc: "Đóng gói ứng dụng thành image", icon: "▦" },
  { name: "GitHub Actions", desc: "Tự động hóa quy trình build", icon: "⌘" },
  { name: "Render", desc: "Triển khai ứng dụng trực tuyến", icon: "▰" },
];

export default function Home() {
  return (
    <main id="top" className={`${body.className} min-h-screen bg-[#F1F5F8] text-[#10263F]`}>
      <style>{`
        html { scroll-behavior: smooth; }
        .container-bar {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 10px;
          background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0, rgba(0,0,0,.10) 2px, transparent 2px, transparent 12px);
          animation: rise-in .65s ease both;
        }
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .container-bar { animation: none; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero relative min-h-[650px] overflow-hidden text-white md:min-h-[690px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2200&q=90')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B2D]/95 via-[#092640]/80 to-[#092640]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071D30]/70 via-transparent to-[#071D30]/25" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 md:px-10">
          <a href="#top" className={`${display.className} flex shrink-0 items-center gap-3 text-3xl font-bold tracking-wide`}>
            <span className="flex flex-col gap-1" aria-hidden="true">
              <i className="h-1.5 w-8 bg-[#F4C342]" />
              <i className="h-1.5 w-6 bg-white" />
              <i className="h-1.5 w-8 bg-[#3FA6A0]" />
            </span>
            MyApp
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/90 lg:flex">
            <a className="border-b-2 border-[#F4C342] pb-2" href="#top">Trang chủ</a>
            <a className="transition hover:text-[#F4C342]" href="#cong-nghe">Công nghệ</a>
            <a className="transition hover:text-[#F4C342]" href="#quy-trinh">Quy trình</a>
            <a className="transition hover:text-[#F4C342]" href="#thong-so">Thông số</a>
            <a className="transition hover:text-[#F4C342]" href="#loi-ich">Lợi ích</a>
            </nav>
          <a href="#quy-trinh" className="rounded-full bg-[#F4C342] px-4 py-3 text-sm font-bold text-[#10263F] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffda69] sm:px-5">Xem quy trình ↗</a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 md:grid-cols-[1.05fr_.95fr] md:px-10 md:pb-28 md:pt-16">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-[#F7D66F] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#50D2A2]" /> Deployment với CI/CD
            </p>
            <h1 className={`${display.className} text-6xl font-bold leading-[.94] tracking-tight sm:text-7xl lg:text-[5.7rem]`}>
              Từ Code đến Website <span className="mt-2 block text-[#F4C342]">chỉ trong vài phút</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">Ứng dụng được xây dựng với Next.js 14, đóng gói bằng Docker và tự động triển khai qua GitHub Actions lên Render.</p>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {technologies.map((item) => (
                <div key={item.name} className="rounded-xl border border-white/15 bg-white/[.08] p-3 backdrop-blur-sm">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-[#12334E]">{item.icon}</span>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-white/65">{item.desc}</p>
                </div>
              ))}
            </div>
            <a href="#quy-trinh" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#F4C342] px-6 py-4 font-bold text-[#10263F] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">🚀 Xem quy trình hoạt động <span>→</span></a>
          </div>

          <div className="relative hidden min-h-[380px] items-center justify-center md:flex">
            <div className="absolute right-0 top-4 rounded-2xl border border-white/40 bg-[#0B2A43]/35 px-7 py-5 text-right backdrop-blur-md">
              <p className={`${display.className} text-5xl font-bold italic tracking-widest text-white`}>CI/CD</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[.22em] text-[#F4C342]">Automatic deployment</p>
            </div>
            <div className="mt-24 w-full max-w-lg space-y-2">
              {stack.map((item, index) => (
                <div key={item.title} className="container-bar flex min-h-[86px] items-center justify-between gap-4 px-5 py-4 shadow-[0_14px_28px_rgba(0,0,0,.22)]" style={{ backgroundColor: item.color, color: item.text, width: item.width, marginLeft: `${index * 2}%`, animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/15 text-2xl font-bold">{item.icon}</span><div><p className={`${display.className} text-2xl font-bold sm:text-3xl`}>{item.title}</p><p className="text-xs opacity-85 sm:text-sm">{item.sub}</p></div></div>
                  <span className="text-sm font-bold">{item.width}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#F4C342] via-[#168A83] to-[#B8403A]" />
      </section>

      {/* TECHNOLOGY */}
      <section id="cong-nghe" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-700">Công nghệ sử dụng</p>
          <h2 className={`${display.className} mt-3 text-4xl font-bold md:text-5xl`}>Bộ công cụ cho quy trình hiện đại</h2>
          <p className="mt-4 leading-7 text-slate-600">Mỗi công nghệ đảm nhiệm một vai trò riêng, kết hợp để tự động hóa việc đóng gói và triển khai website.</p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((item, index) => (
            <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${index === 2 ? "bg-amber-300 text-[#10263F]" : "bg-[#10263F] text-white"}`}>{item.icon}</div>
              <h3 className={`${display.className} mt-5 text-2xl font-bold`}>{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CI/CD STEPS */}
      <section id="quy-trinh" className="bg-[#10263F] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[#F4C342]">Quy trình tự động</p>
          <h2 className={`${display.className} mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl`}>Bốn bước từ lúc push đến khi website trực tuyến</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl border border-white/15 bg-white/[.05] p-6 transition hover:-translate-y-1 hover:bg-white/[.09]">
                <div className="flex items-center justify-between"><span className={`${display.className} text-4xl font-bold text-[#F4C342]`}>{step.number}</span><span className="text-2xl text-[#F4C342]">{step.icon}</span></div>
                <h3 className={`${display.className} mt-6 text-2xl font-bold`}>{step.title}</h3>
                <p className="mt-1 text-sm font-semibold text-teal-300">{step.tool}</p>
                <p className="mt-4 text-sm leading-7 text-white/70">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section id="thong-so" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-700">Cấu hình triển khai</p>
          <h2 className={`${display.className} mt-3 text-4xl font-bold md:text-5xl`}>Thông số hệ thống</h2>
          <p className="mt-5 max-w-lg leading-7 text-slate-600">Thông tin tổng quan về image, framework và môi trường chạy của ứng dụng.</p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Cấu hình triển khai tham khảo</div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#10263F] px-5 py-4 text-white"><span className="font-semibold">frontend-app</span><span className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Deployment</span></div>
          <dl>
            {specs.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:grid-cols-[130px_1fr] sm:items-baseline">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="break-words text-sm font-semibold text-[#10263F]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="loi-ich" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-700">Giá trị nổi bật</p>
          <h2 className={`${display.className} mt-3 text-4xl font-bold md:text-5xl`}>Vì sao nên dùng CI/CD?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white" style={{ backgroundColor: benefit.color }}>{benefit.icon}</div>
                <h3 className={`${display.className} mt-5 text-2xl font-bold`}>{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#071D30] text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between md:px-10">
          <span>Bài thực hành CI/CD với Docker và GitHub Actions.</span>
          <a href="#top" className="font-semibold text-[#F4C342] transition hover:text-white">Về đầu trang ↑</a>
          <span>© 2026 frontend-app</span>
        </div>
      </footer>
    </main>
  );
}