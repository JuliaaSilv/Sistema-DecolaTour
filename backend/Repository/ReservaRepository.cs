using agencia.Data;
using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace agencia.Repository
{
    // Implementação do repositório de reservas, responsável pelo acesso ao banco de dados
    public class ReservaRepository : IReservaRepository
    {
        // Contexto do banco de dados (Entity Framework)
        private readonly AppDbContext _context;

        // Preciso de _connectionString para pegar a lista completa de informações de reservas (pagamentos, dasdos do cliente, dados do pacote) direto do banco.
        private readonly string _connectionString;

       



        // Construtor recebe o contexto via injeção de dependência
        public ReservaRepository(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            
        }

       
        /// Retorna todas as reservas do sistema, incluindo os dados relacionados (Pacote, Usuário, Viajantes).
        public async Task<IEnumerable<Reserva>> ListarReservasAsync()
        {
            return await _context.Reservas
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .Include(r => r.Viajantes)
                .ToListAsync();
        }

    
        /// Busca uma reserva específica pelo ID, incluindo os dados relacionados.
        public async Task<Reserva?> BuscarReservaPorIdAsync(int id)
        {
            return await _context.Reservas
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .Include(r => r.Viajantes)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

      
        /// Adiciona uma nova reserva ao banco de dados.
        public async Task<Reserva> CriarReservaAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }




        /// Atualiza o status de uma reserva existente.
        public async Task<bool?> AtualizarStatusAsync(int reservaId, string? novoStatus)
        {
            var reserva = await _context.Reservas.FindAsync(reservaId);
            if (reserva == null) return null;
            reserva.Status = novoStatus ?? reserva.Status;
            _context.Reservas.Update(reserva);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<List<Reserva>> ListarPorUsuarioAsync(int usuarioId)
        {
            return await _context.Reservas
                .Include(r => r.Pacote)
                    .ThenInclude(p => p.Imagens)
                .Include(r => r.Viajantes)
                .Where(r => r.UsuarioId == usuarioId)
                .OrderByDescending(r => r.DataReserva)
                .ToListAsync();
        }


        /// Deleta uma reserva pelo ID.
        public async Task<bool?> DeletarReservaAsync(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return null;
            _context.Reservas.Remove(reserva);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<ReservaCompletaDTO>> ListaCompletaDeReservasAsync()
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"
                SELECT 
                    r.Id,
                    r.NUMERO_RESERVA AS Codigo,
                    u.NOME AS Cliente,
                    u.EMAIL AS Email,
                    p.DESCRICAO AS Pacote,
                    p.DESTINO AS Destino,
                    p.DATA_DISPONIVEL AS DataViagem,
                    r.DATA_RESERVA AS DataReserva,
                    p.VALOR_TOTAL AS Valor,
                    r.STATUS AS Status,
                    v.qnt_viajantes pessoas,
                    pg.STATUS_PAGAMENTO AS Pagamento
                FROM TB_RESERVAS r
                INNER JOIN TB_USUARIOS u ON u.Id = r.USUARIO_ID
                INNER JOIN TB_PACOTES p ON p.Id = r.PACOTE_ID
                LEFT JOIN TB_PAGAMENTOS pg ON pg.ID_RESERVA = r.Id
                left 
                join (select v.ID_RESERVA, count(1) qnt_viajantes from TB_VIAGANTES v group by v.ID_RESERVA) v
                on v.ID_RESERVA  = r.Id                
                ORDER BY r.DATA_RESERVA DESC";

                return await db.QueryAsync<ReservaCompletaDTO>(sql);
            }
        }
    }
} 