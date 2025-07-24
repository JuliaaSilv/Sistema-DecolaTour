using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Models;

namespace agencia.Service
{
    public class PacoteService : IPacoteService
    {
        private readonly IPacoteRepository _repository;
        private readonly IWebHostEnvironment _env;

        public PacoteService(IPacoteRepository repository, IWebHostEnvironment env)
        {
            _repository = repository;
            _env = env;
        }

        public async Task<List<PacoteDTO>> ListarPacotesAsync()
        {
            var pacotes = await _repository.ListarAsync();
            return pacotes.Select(p => new PacoteDTO
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Destino = p.Destino,
                ValorTotal = p.ValorTotal,
                ImagemUrl = p.Imagens != null && p.Imagens.Any() ? p.Imagens.First().Url : string.Empty
            }).ToList();
        }

        public async Task<Pacote?> BuscarDetalhesAsync(int id)
        {
            return await _repository.BuscarPorIdAsync(id);
        }

        public async Task CadastrarAsync(PacoteUploadDTO dto)
        {
            var pacote = new Pacote
            {
                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                Destino = dto.Destino,
                Origem = dto.Origem,
                Duracao = dto.Duracao,
                DataDisponivel = dto.DataDisponivel,
                ValorTotal = dto.ValorTotal,
                QuantidadeMaximaPessoas = dto.QuantidadeMaximaPessoas,
                Imagens = new List<ImagemPacote>(),
                Videos = new List<VideoPacote>()
            };

            var root = Path.Combine(_env.ContentRootPath, "wwwroot");

            if (dto.Imagens != null)
            {
                foreach (var imagem in dto.Imagens)
                {
                    var nomeImagem = Guid.NewGuid() + Path.GetExtension(imagem.FileName);
                    var caminhoImagem = Path.Combine(root, "imagens", nomeImagem);
                    Directory.CreateDirectory(Path.GetDirectoryName(caminhoImagem)!);

                    using var stream = new FileStream(caminhoImagem, FileMode.Create);
                    await imagem.CopyToAsync(stream);

                    pacote.Imagens.Add(new ImagemPacote { Url = $"/imagens/{nomeImagem}" });
                }
            }

            if (dto.Videos != null)
            {
                foreach (var video in dto.Videos)
                {
                    var nomeVideo = Guid.NewGuid() + Path.GetExtension(video.FileName);
                    var caminhoVideo = Path.Combine(root, "videos", nomeVideo);
                    Directory.CreateDirectory(Path.GetDirectoryName(caminhoVideo)!);

                    using var stream = new FileStream(caminhoVideo, FileMode.Create);
                    await video.CopyToAsync(stream);

                    pacote.Videos.Add(new VideoPacote { Url = $"/videos/{nomeVideo}" });
                }
            }

            await _repository.CadastrarAsync(pacote);
        }


        public async Task<List<PacoteDTO>> BuscarComFiltroAsync(FiltroPacoteDTO filtro)
        {
            var pacotes = await _repository.ListarAsync();
            var resultado = pacotes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filtro.Origem))
                resultado = resultado.Where(p => p.Origem.ToLower().Contains(filtro.Origem.ToLower()));

            if (!string.IsNullOrWhiteSpace(filtro.Destino))
                resultado = resultado.Where(p => p.Destino.ToLower().Contains(filtro.Destino.ToLower()));

            if (filtro.DataIda.HasValue && filtro.DataVolta.HasValue)
            {
                var diasSolicitados = (filtro.DataVolta.Value.Date - filtro.DataIda.Value.Date).Days;

                resultado = resultado
                    .Where(p =>
                        filtro.DataIda.Value.Date >= p.DataDisponivel.Date &&
                        diasSolicitados == p.Duracao);
            }

            if (filtro.Viajantes.HasValue)
                resultado = resultado.Where(p => p.QuantidadeMaximaPessoas >= filtro.Viajantes.Value);

            return resultado.Select(p => new PacoteDTO
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Destino = p.Destino,
                ValorTotal = p.ValorTotal,
                ImagemUrl = p.Imagens != null && p.Imagens.Any() ? p.Imagens.First().Url : string.Empty
            }).ToList();
        }

    }
}
