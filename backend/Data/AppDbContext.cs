using Microsoft.EntityFrameworkCore;
using agencia.Models;


namespace agencia.Data
{
    public class AppDbContext : DbContext
    {

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Pacote> Pacotes { get; set; }
        public DbSet<Avaliacao> Avaliacoes { get; set; }
        public DbSet<Midia> Midias { get; set; }
        public DbSet<Viajante> Viajantes { get; set; }

        public DbSet<TipoDocumento> TipoDocumento { get; set; }
        public DbSet<Promocao> Promocoes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pagamento>()
                .Property(p => p.StatusPagamento)
                .HasConversion<string>();

            modelBuilder.Entity<Pagamento>()
                .Property(p => p.FormaDePagamento)
                .HasConversion<string>();

                base.OnModelCreating(modelBuilder);
                
        }

    }
}
