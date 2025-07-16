using agencia.Configuration;
using agencia.Configurations.Identity;
using agencia.Data;
using agencia.Interfaces.Services;
using agencia.Repository;
using agencia.Service;
using InterfaceService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// Injeção de dependência
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAutenticador, AutenticadorService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


// Configuração do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=DB_DecolaTuor;Trusted_Connection=True;"));

// Adiciona controladores e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddInfrastrutureSwagger();

// Configuração de autenticação JWT



builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var secretKey = jwtSettings["SecretKey"];

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});


// Configuração de autorização
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("Administrador", policy => policy.RequireClaim("TipoUsuarioId", "1"));
//    options.AddPolicy("GerenteOuAdmin", policy => policy.RequireClaim("TipoUsuarioId", "1", "2"));
//});



//  Adiciona CORS antes de builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// Usa CORS
app.UseCors("AllowAll");

// Gera o banco se não existir (sem migrations)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // context.Database.EnsureDeleted(); // Use com cuidado
    context.Database.EnsureCreated();
}

// Middleware padrão
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
