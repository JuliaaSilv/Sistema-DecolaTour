using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using agencia.Data;
using Microsoft.EntityFrameworkCore;

namespace agencia.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        // Métricas Gerais
        [HttpGet("metricas-gerais")]
        public async Task<IActionResult> GetMetricasGerais()
        {
            var totalReservas = await _context.Reservas.CountAsync();
            var totalClientes = await _context.Usuarios.CountAsync();
            var totalPacotes = await _context.Pacotes.CountAsync();
            var faturamento = await _context.Pagamentos.SumAsync(p => p.Valor);

            return Ok(new {
                totalReservas,
                totalClientes,
                totalPacotes,
                faturamento
            });
        }

        // Faturamento Mensal
        [HttpGet("faturamento-mensal")]
        public async Task<IActionResult> GetFaturamentoMensal()
        {
            var faturamentoPorMes = await _context.Pagamentos
                .GroupBy(p => new { p.DataPagamento.Year, p.DataPagamento.Month })
                .Select(g => new {
                    Mes = $"{g.Key.Month}/{g.Key.Year}",
                    Valor = g.Sum(p => p.Valor)
                }).ToListAsync();

            return Ok(faturamentoPorMes);
        }

        // Destinos Populares
        [HttpGet("destinos-populares")]
        public async Task<IActionResult> GetDestinosPopulares()
        {
            var destinos = await _context.Reservas
                .GroupBy(r => r.Pacote.Destino)
                .Select(g => new {
                    Destino = g.Key,
                    Reservas = g.Count()
                }).OrderByDescending(x => x.Reservas)
                .Take(10)
                .ToListAsync();

            return Ok(destinos);
        }

        // Promoções Ativas
        [HttpGet("promocoes-ativas")]
        public async Task<IActionResult> GetPromocoesAtivas()
        {
            var hoje = DateTime.UtcNow;
            var promocoes = await _context.Promocoes
                .Where(p => p.DataInicio <= hoje && p.DataFim >= hoje)
                .Select(p => new {
                    p.Nome,
                    p.Descricao,
                    p.DescontoPercentual,
                    p.DataInicio,
                    p.DataFim
                }).ToListAsync();

            return Ok(promocoes);
        }

        // Clientes Frequentes
        [HttpGet("clientes-frequentes")]
        public async Task<IActionResult> GetClientesFrequentes()
        {
            var clientes = await _context.Reservas
                .GroupBy(r => r.Usuario.Email)
                .Select(g => new {
                    Nome = g.First().Usuario.Nome,
                    Email = g.Key,
                    Reservas = g.Count()
                }).OrderByDescending(x => x.Reservas)
                .Take(10)
                .ToListAsync();

            return Ok(clientes);
        }
    }
}