using agencia.Configuration;
using agencia.Configurations.Identity;
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

var builder = WebApplication.CreateBuilder(args);


// Injeção de dependência
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPacoteRepository, PacoteRepository>();
builder.Services.AddScoped<IPacoteService, PacoteService>();
//builder.Services.AddScoped<IAutenticador, AutenticadorService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();


builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));




//AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


// Configuração do banco de dados


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=AVAPC-969694123;Database=DB_DecolaTuor;Trusted_Connection=True;Encrypt=False"));





// Adiciona controladores e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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
   // context.Database.EnsureDeleted(); // Use com cuidado
    context.Database.EnsureCreated();

    // Após criar o banco roda o script de insert inicial com alguns dados de exemplos.
   // string script = File.ReadAllText("Scripts/01-Scripts inicial de Insert.sql");
   // context.Database.ExecuteSqlRaw(script);    
}

// Middleware padrão
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
