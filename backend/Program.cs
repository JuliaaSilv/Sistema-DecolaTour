using agencia.Configuration;
using agencia.Data;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Mapper;
using agencia.Models;
using agencia.Repository;
using agencia.Service;
using InterfaceService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using agencia.Interfaces.Repository;
using agencia.Repository;

var builder = WebApplication.CreateBuilder(args);


// Injeção de dependência
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPacoteRepository, PacoteRepository>();
builder.Services.AddScoped<IPacoteService, PacoteService>();
builder.Services.AddScoped<IPagamentoRepository, PagamentoRepository>();
builder.Services.AddScoped<IPagamentoService, PagamentoService>();
builder.Services.AddScoped<IPagamentoMockService, PagamentoMockService>();
builder.Services.AddHttpContextAccessor();
//builder.Services.AddScoped<IAutenticador, AutenticadorService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IViajanteRepository, ViajanteRepository>();
builder.Services.AddScoped<IViajanteService, ViajanteService>();
builder.Services.AddScoped<IAvaliacaoRepository, AvaliacaoRepository>();
builder.Services.AddScoped<IAvaliacaoService, AvaliacaoService>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<ICartaoRepository, CartaoRepository>();
builder.Services.AddScoped<ICartaoService, CartaoService>();
builder.Services.AddScoped<IEnderecoRepository, EnderecoRepository>();
builder.Services.AddScoped<IEnderecoService, EnderecoService>();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

//AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Configuração do banco de dados lendo direto do arquivo de propriedades appsettings.json no lugar de por direto no código.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configuração do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Adiciona controladores e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations();
});

builder.Services.AddInfrastrutureSwagger();

// Configuração de autenticação JWT

builder.Services.AddScoped<IAutenticador>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var context = provider.GetRequiredService<AppDbContext>();
    var secretKey = configuration["Jwt:SecretKey"];
    var emailService = provider.GetRequiredService<IEmailService>();
    return new AutenticadorService(configuration, context, secretKey, emailService);
});


var secretKey = builder.Configuration["Jwt:SecretKey"];

var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}
    )
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
/*
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Extrai o token mesmo se o "Bearer" estiver faltando
                if (string.IsNullOrEmpty(context.Token) &&
                    context.Request.Headers.TryGetValue("Authorization", out var authHeader))
                {
                    var token = authHeader.ToString().Split(' ').LastOrDefault();
                    if (!string.IsNullOrEmpty(token))
                    {
                        context.Token = token;
                    }
                }
                return Task.CompletedTask;
            }
        };
*/
    }

    );





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

// Gera o banco se não existir
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try 
    {
        context.Database.EnsureDeleted(); // Use com cuidado
        context.Database.EnsureCreated();

        // Verifica se a tabela TB_TIPO_USUARIO está vazia antes de inserir
        if (!context.TiposUsuario.Any())
        {
            // Após criar o banco roda o script de insert inicial com alguns dados de exemplos.
            string script = File.ReadAllText("Scripts/01-Scripts inicial de Insert.sql");
            context.Database.ExecuteSqlRaw(script);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro na inicialização do banco: {ex.Message}");
        Console.WriteLine($"Detalhes: {ex.InnerException?.Message}");
    }
}

// Middleware padrão
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configurar tipos MIME para arquivos de mídia
var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
provider.Mappings[".mp4"] = "video/mp4";
provider.Mappings[".webm"] = "video/webm";
provider.Mappings[".mov"] = "video/quicktime";
provider.Mappings[".avi"] = "video/x-msvideo";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
