using Microsoft.EntityFrameworkCore;

namespace ShopApi;

// ===== Bảng dữ liệu =====

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "user"; // "admin" hoặc "user"
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public long Price { get; set; } // đơn vị: đồng
    public string Category { get; set; } = "";
    public string Emoji { get; set; } = "🛍️";
    public string Color { get; set; } = "#CFE3FF";
    public int Stock { get; set; }
    public string Description { get; set; } = "";
    public string? Image { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public string Username { get; set; } = "";
    public long Total { get; set; }
    public int Count { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public long Price { get; set; }
    public int Qty { get; set; }
}

// ===== Dữ liệu gửi lên từ frontend =====

public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password);
public record ProductInput(
    string Name,
    long Price,
    string Category,
    string? Emoji,
    string? Color,
    int Stock,
    string? Description,
    string? Image);
public record OrderLineInput(int ProductId, int Qty);
public record OrderInput(List<OrderLineInput> Items);

// ===== Kết nối cơ sở dữ liệu =====

public class ShopDb : DbContext
{
    public ShopDb(DbContextOptions<ShopDb> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Username).IsUnique();
        b.Entity<Order>().HasMany(o => o.Items).WithOne().HasForeignKey(i => i.OrderId);
    }
}

// Đọc chuỗi kết nối: Postgres (kể cả dạng postgres://...) hoặc SQLite khi chạy thử trên máy.
public static class DbSetup
{
    public static (bool UsePostgres, string Conn) Resolve(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return (false, "Data Source=shop.db");

        if (raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
            raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            var uri = new Uri(raw);
            var parts = uri.UserInfo.Split(':', 2);
            var user = Uri.UnescapeDataString(parts[0]);
            var pass = parts.Length > 1 ? Uri.UnescapeDataString(parts[1]) : "";
            var port = uri.Port > 0 ? uri.Port : 5432;
            var name = uri.AbsolutePath.TrimStart('/');
            return (true,
                $"Host={uri.Host};Port={port};Database={name};Username={user};Password={pass};SSL Mode=Prefer;Trust Server Certificate=true");
        }

        if (raw.Contains("Host=", StringComparison.OrdinalIgnoreCase))
            return (true, raw);

        return (false, raw);
    }
}

// Dữ liệu mẫu khi cơ sở dữ liệu còn trống
public static class Seed
{
    public static void Run(ShopDb db)
    {
        if (!db.Users.Any())
        {
            var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
            db.Users.Add(new User { Username = "admin", Role = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword) });
            db.Users.Add(new User { Username = "user", Role = "user", PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123") });
        }

        if (!db.Products.Any())
        {
            db.Products.AddRange(
                P("Áo thun cotton basic", 159000, "Thời trang", "👕", "#CFE3FF", 40, "Vải cotton dày dặn, mặc mát, giặt không xù."),
                P("Quần jeans ống suông", 349000, "Thời trang", "👖", "#C9D6F2", 25, "Form suông thoải mái, màu xanh đậm dễ phối đồ."),
                P("Áo khoác gió nhẹ", 429000, "Thời trang", "🧥", "#E3EBC4", 18, "Chống gió, chống nước nhẹ, gấp gọn bỏ vừa balo."),
                P("Giày sneaker trắng", 529000, "Thời trang", "👟", "#F3E1D3", 30, "Đế êm, da tổng hợp dễ lau chùi."),
                P("Balo đi học chống sốc", 289000, "Phụ kiện", "🎒", "#FBE3A6", 22, "Ngăn laptop 15 inch, quai đeo êm vai."),
                P("Mũ lưỡi trai", 99000, "Phụ kiện", "🧢", "#F6C9C0", 50, "Khóa chỉnh size phía sau, vải thoáng."),
                P("Kính râm chống UV", 189000, "Phụ kiện", "🕶️", "#D5D5E8", 35, "Tròng chống tia UV400, gọng nhẹ."),
                P("Bình giữ nhiệt 500ml", 219000, "Gia dụng", "🧴", "#C8EBDD", 45, "Giữ nóng 8 giờ, giữ lạnh 12 giờ."),
                P("Bộ ly thủy tinh 6 chiếc", 179000, "Gia dụng", "🥛", "#D8EEF5", 20, "Thủy tinh chịu nhiệt, dùng được cả nước nóng."),
                P("Tai nghe không dây", 649000, "Điện tử", "🎧", "#DCD3F5", 15, "Bluetooth 5.3, pin dùng liên tục 20 giờ."),
                P("Sạc dự phòng 10.000mAh", 339000, "Điện tử", "🔋", "#F9DDB5", 28, "Sạc nhanh 20W, hai cổng ra."),
                P("Chuột không dây", 249000, "Điện tử", "🖱️", "#D6E4D0", 32, "Nhỏ gọn, click êm, dùng pin AA bền."));
        }

        db.SaveChanges();
    }

    private static Product P(string name, long price, string category, string emoji, string color, int stock, string desc) =>
        new() { Name = name, Price = price, Category = category, Emoji = emoji, Color = color, Stock = stock, Description = desc };
}
