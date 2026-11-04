using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ShopApi;

var builder = WebApplication.CreateBuilder(args);

// Render cấp cổng qua biến PORT. Chạy trên máy thì dùng cổng 8080.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ----- Cơ sở dữ liệu -----
// Đọc ConnectionStrings__DefaultConnection (giống tài liệu của thầy) hoặc DATABASE_URL.
var rawConn = builder.Configuration.GetConnectionString("DefaultConnection")
              ?? Environment.GetEnvironmentVariable("DATABASE_URL");
var dbCfg = DbSetup.Resolve(rawConn);
builder.Services.AddDbContext<ShopDb>(o =>
{
    if (dbCfg.UsePostgres) o.UseNpgsql(dbCfg.Conn);
    else o.UseSqlite(dbCfg.Conn);
});

// ----- Đăng nhập bằng token JWT -----
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
{
    // Khóa tạm để chạy thử. Khi đưa lên mạng hãy đặt biến JWT_KEY dài từ 32 ký tự.
    jwtKey = "khoa-tam-chi-dung-de-hoc-tap-0123456789";
}
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = true,
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
    });
builder.Services.AddAuthorization();

// ----- Cho phép frontend gọi vào (CORS) -----
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS") ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
{
    if (corsOrigins.Length > 0) p.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod();
    else p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); // bản học tập: mở cho mọi nơi
}));

// ----- Trang thử API (Swagger) -----
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "QUYDAT Shop API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Dán token nhận được sau khi đăng nhập (không cần gõ chữ Bearer)."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ----- Tạo bảng và dữ liệu mẫu (thử lại vài lần nếu cơ sở dữ liệu chưa sẵn sàng) -----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopDb>();
    for (var attempt = 1; ; attempt++)
    {
        try
        {
            db.Database.EnsureCreated();
            Seed.Run(db);
            break;
        }
        catch (Exception ex) when (attempt < 10)
        {
            Console.WriteLine($"Chưa kết nối được cơ sở dữ liệu (lần {attempt}): {ex.Message}");
            Thread.Sleep(3000);
        }
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI();

string MakeToken(User u)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.Name, u.Username),
        new Claim(ClaimTypes.Role, u.Role)
    };
    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));
    return new JwtSecurityTokenHandler().WriteToken(token);
}

// ===== Kiểm tra sức khỏe (giống /health trong tài liệu của thầy) =====
app.MapGet("/", () => Results.Ok(new { name = "QUYDAT Shop API", docs = "/swagger", health = "/health" }));
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// ===== Đăng nhập, đăng ký =====
app.MapPost("/api/auth/login", async (LoginRequest req, ShopDb db) =>
{
    var username = (req.Username ?? "").Trim().ToLowerInvariant();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password ?? "", user.PasswordHash))
        return Results.Json(new { error = "Sai tên đăng nhập hoặc mật khẩu." }, statusCode: 401);

    return Results.Ok(new { token = MakeToken(user), user = new { username = user.Username, role = user.Role } });
});

app.MapPost("/api/auth/register", async (RegisterRequest req, ShopDb db) =>
{
    var username = (req.Username ?? "").Trim().ToLowerInvariant();
    if (username.Length < 3 || username.Length > 30)
        return Results.BadRequest(new { error = "Tên đăng nhập cần từ 3 đến 30 ký tự." });
    if ((req.Password ?? "").Length < 6)
        return Results.BadRequest(new { error = "Mật khẩu cần ít nhất 6 ký tự." });
    if (await db.Users.AnyAsync(u => u.Username == username))
        return Results.Conflict(new { error = "Tên đăng nhập đã tồn tại." });

    var user = new User { Username = username, Role = "user", PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password) };
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(new { token = MakeToken(user), user = new { username = user.Username, role = user.Role } });
});

// ===== Sản phẩm =====
app.MapGet("/api/products", async (ShopDb db) =>
    Results.Ok(await db.Products.OrderByDescending(p => p.Id).ToListAsync()));

app.MapPost("/api/products", async (ProductInput input, ShopDb db) =>
{
    var error = ValidateProduct(input);
    if (error is not null) return Results.BadRequest(new { error });

    var p = new Product();
    Apply(p, input);
    db.Products.Add(p);
    await db.SaveChangesAsync();
    return Results.Created($"/api/products/{p.Id}", p);
}).RequireAuthorization(policy => policy.RequireRole("admin"));

app.MapPut("/api/products/{id:int}", async (int id, ProductInput input, ShopDb db) =>
{
    var p = await db.Products.FindAsync(id);
    if (p is null) return Results.NotFound(new { error = "Không tìm thấy sản phẩm." });
    var error = ValidateProduct(input);
    if (error is not null) return Results.BadRequest(new { error });

    Apply(p, input);
    await db.SaveChangesAsync();
    return Results.Ok(p);
}).RequireAuthorization(policy => policy.RequireRole("admin"));

app.MapDelete("/api/products/{id:int}", async (int id, ShopDb db) =>
{
    var p = await db.Products.FindAsync(id);
    if (p is null) return Results.NotFound(new { error = "Không tìm thấy sản phẩm." });
    db.Products.Remove(p);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization(policy => policy.RequireRole("admin"));

// ===== Đơn hàng =====
app.MapPost("/api/orders", async (OrderInput input, ClaimsPrincipal me, ShopDb db) =>
{
    if (input.Items is null || input.Items.Count == 0)
        return Results.BadRequest(new { error = "Giỏ hàng đang trống." });

    var order = new Order
    {
        Code = "DH" + DateTime.UtcNow.Ticks.ToString()[^6..],
        Username = me.Identity?.Name ?? "",
        CreatedAt = DateTime.UtcNow
    };

    foreach (var line in input.Items)
    {
        var product = await db.Products.FindAsync(line.ProductId);
        if (product is null)
            return Results.BadRequest(new { error = $"Sản phẩm số {line.ProductId} không còn tồn tại." });
        if (line.Qty <= 0)
            return Results.BadRequest(new { error = "Số lượng phải lớn hơn 0." });
        if (line.Qty > product.Stock)
            return Results.BadRequest(new { error = $"{product.Name} chỉ còn {product.Stock} sản phẩm." });

        product.Stock -= line.Qty;
        order.Items.Add(new OrderItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            Price = product.Price, // giá lấy từ máy chủ, không tin giá do trình duyệt gửi
            Qty = line.Qty
        });
        order.Total += product.Price * line.Qty;
        order.Count += line.Qty;
    }

    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Ok(new { order.Code, order.Total, order.Count, order.CreatedAt });
}).RequireAuthorization();

app.MapGet("/api/orders", async (ClaimsPrincipal me, ShopDb db) =>
{
    var query = db.Orders.Include(o => o.Items).AsQueryable();
    if (!me.IsInRole("admin"))
    {
        var name = me.Identity?.Name ?? "";
        query = query.Where(o => o.Username == name);
    }
    return Results.Ok(await query.OrderByDescending(o => o.Id).ToListAsync());
}).RequireAuthorization();

app.Run();

// ----- Hàm hỗ trợ -----
static string? ValidateProduct(ProductInput i)
{
    if (string.IsNullOrWhiteSpace(i.Name)) return "Hãy nhập tên sản phẩm.";
    if (i.Price <= 0) return "Giá phải lớn hơn 0.";
    if (i.Stock < 0) return "Số lượng tồn kho không được âm.";
    if (string.IsNullOrWhiteSpace(i.Category)) return "Hãy chọn danh mục.";
    return null;
}

static void Apply(Product p, ProductInput i)
{
    p.Name = i.Name.Trim();
    p.Price = i.Price;
    p.Category = i.Category.Trim();
    p.Emoji = string.IsNullOrWhiteSpace(i.Emoji) ? "🛍️" : i.Emoji.Trim();
    p.Color = string.IsNullOrWhiteSpace(i.Color) ? "#CFE3FF" : i.Color.Trim();
    p.Stock = i.Stock;
    p.Description = i.Description?.Trim() ?? "";
    p.Image = string.IsNullOrWhiteSpace(i.Image) ? null : i.Image.Trim();
}
