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
                Categorias = dto.Categorias,
                DataDisponivel = dto.DataDisponivel,
                ValorTotal = dto.ValorTotal,
                QuantidadeMaximaPessoas = dto.QuantidadeMaximaPessoas,
                Imagens = new List<ImagemPacote>(),
                Videos = new List<VideoPacote>()
            };

            // Salva pacote primeiro para gerar ID
            await _repository.CadastrarAsync(pacote);

            var root = Path.Combine(_env.ContentRootPath, "wwwroot");
            var pastaPacote = Path.Combine(root, "imagens", pacote.Id.ToString());
            Directory.CreateDirectory(pastaPacote);

            if (dto.Imagens != null)
            {
                foreach (var imagem in dto.Imagens)
                {
                    var nomeImagem = Guid.NewGuid() + Path.GetExtension(imagem.FileName);
                    var caminhoImagem = Path.Combine(pastaPacote, nomeImagem);

                    using var stream = new FileStream(caminhoImagem, FileMode.Create);
                    await imagem.CopyToAsync(stream);

                    pacote.Imagens.Add(new ImagemPacote { Url = $"/imagens/{pacote.Id}/{nomeImagem}" });
                }
            }

            if (dto.Videos != null)
            {
                var pastaVideos = Path.Combine(root, "videos", pacote.Id.ToString());
                Directory.CreateDirectory(pastaVideos);

                foreach (var video in dto.Videos)
                {
                    var nomeVideo = Guid.NewGuid() + Path.GetExtension(video.FileName);
                    var caminhoVideo = Path.Combine(pastaVideos, nomeVideo);

                    using var stream = new FileStream(caminhoVideo, FileMode.Create);
                    await video.CopyToAsync(stream);

                    pacote.Videos.Add(new VideoPacote { Url = $"/videos/{pacote.Id}/{nomeVideo}" });
                }
            }

            // Atualiza pacote para salvar as URLs das imagens e vídeos
            await _repository.AtualizarAsync(pacote);
        }


        public async Task<List<PacoteDTO>> BuscarComFiltroAsync(FiltroPacoteDTO filtro)
        {
            var pacotes = await _repository.ListarAsync();
            var resultado = pacotes.AsQueryable();

            // Filtra pela origem, se informado
            if (!string.IsNullOrWhiteSpace(filtro.Origem))
                resultado = resultado.Where(p => p.Origem.ToLower().Contains(filtro.Origem.ToLower()));

            // Filtra pelo destino, se informado
            if (!string.IsNullOrWhiteSpace(filtro.Destino))
                resultado = resultado.Where(p => p.Destino.ToLower().Contains(filtro.Destino.ToLower()));

            // Filtra pelo intervalo de datas e duração da viagem
            if (filtro.DataIda.HasValue && filtro.DataVolta.HasValue)
            {
                var diasSolicitados = (filtro.DataVolta.Value.Date - filtro.DataIda.Value.Date).Days;

                resultado = resultado.Where(p =>
                    filtro.DataIda.Value.Date >= p.DataDisponivel.Date &&
                    diasSolicitados == p.Duracao);
            }

            // Filtra pela quantidade de viajantes, se informado
            if (filtro.Viajantes.HasValue)
                resultado = resultado.Where(p => p.QuantidadeMaximaPessoas >= filtro.Viajantes.Value);

            // Projeta para PacoteDTO, calculando ValorTotal conforme número de viajantes
            return resultado.Select(p => new PacoteDTO
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Destino = p.Destino,
                ValorTotal = filtro.Viajantes.HasValue
                    ? p.ValorUnitario * filtro.Viajantes.Value
                    : p.ValorUnitario,
                ImagemUrl = p.Imagens != null && p.Imagens.Any() ? p.Imagens.First().Url : string.Empty
            }).ToList();
        }

        public async Task AtualizarAsync(int id, PacoteUploadDTO dto)
        {
            var pacoteExistente = await _repository.BuscarPorIdAsync(id);
            if (pacoteExistente == null)
                throw new Exception("Pacote não encontrado");

            pacoteExistente.Titulo = dto.Titulo;
            pacoteExistente.Descricao = dto.Descricao;
            pacoteExistente.Categorias = dto.Categorias;
            pacoteExistente.Destino = dto.Destino;
            pacoteExistente.Origem = dto.Origem;
            pacoteExistente.Duracao = dto.Duracao;
            pacoteExistente.DataDisponivel = dto.DataDisponivel;
            pacoteExistente.ValorTotal = dto.ValorTotal;
            pacoteExistente.QuantidadeMaximaPessoas = dto.QuantidadeMaximaPessoas;

            await _repository.AtualizarAsync(pacoteExistente);
        }

        public async Task RemoverAsync(int id)
        {
            var pacote = await _repository.BuscarPorIdAsync(id);
            if (pacote == null)
                throw new Exception("Pacote não encontrado");

            await _repository.RemoverAsync(pacote);
        }


    }
}
