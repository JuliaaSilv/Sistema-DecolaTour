using agencia.DTOs;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.Models;
using AutoMapper;

namespace agencia.Service
{
    public class PacoteService : IPacoteService
    {
        private readonly IPacoteRepository _repository;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;

        public PacoteService(IPacoteRepository repository, IWebHostEnvironment env, IMapper mapper)
        {
            _repository = repository;
            _env = env;
            _mapper = mapper;
        }

        public async Task<List<PacoteDTO>> ListarPacotesAsync()
        {
            var pacotes = await _repository.ListarAsync();
            return pacotes.Select(p => new PacoteDTO
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Descricao = p.Descricao,
                Destino = p.Destino,
                Estrelas = p.Estrelas,
                Categorias = p.Categorias,
                Duracao = p.Duracao,
                DataDisponivel = p.DataDisponivel,
                ValorTotal = p.ValorTotal,
                QuantidadeMaximaPessoas = p.QuantidadeMaximaPessoas,
                ImagemUrl = p.Imagens != null && p.Imagens.Any() ? p.Imagens.First().Url : string.Empty,
                Imagens = p.Imagens?.Select(img => new ImagemPacoteDTO { Url = img.Url }).ToList(),
                Videos = p.Videos?.Select(vid => new VideoPacoteDTO { Url = vid.Url }).ToList()
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
                Estrelas = dto.Estrelas,
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
                for (int i = 0; i < dto.Imagens.Count; i++)
                {
                    var imagem = dto.Imagens[i];
                    var nomeImagem = Guid.NewGuid() + Path.GetExtension(imagem.FileName);
                    var caminhoImagem = Path.Combine(pastaPacote, nomeImagem);

                    // Processa as 3 primeiras imagens para o mosaico da galeria
                    if (i < 3)
                    {
                        var processedImageData = await ImageProcessingService.ResizeImageForGallery(imagem, i);
                        await ImageProcessingService.SaveProcessedImageAsync(processedImageData, caminhoImagem);
                    }
                    else
                    {
                        // Imagens após a terceira mantêm tamanho original
                        using var stream = new FileStream(caminhoImagem, FileMode.Create);
                        await imagem.CopyToAsync(stream);
                    }

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

        public async Task CadastrarSimplesAsync(CreatePacoteDTO dto)
        {
            var pacote = _mapper.Map<Pacote>(dto);
            pacote.Imagens = new List<ImagemPacote>();
            pacote.Videos = new List<VideoPacote>();

            var root = Path.Combine(_env.ContentRootPath, "wwwroot");
            var pastaPacote = Path.Combine(root, "imagens", pacote.Id.ToString());
            Directory.CreateDirectory(pastaPacote);

            if (dto.Imagens != null)
            {
                for (int i = 0; i < dto.Imagens.Count; i++)
                {
                    var imagem = dto.Imagens[i];
                    var nomeImagem = Guid.NewGuid() + Path.GetExtension(imagem.FileName);
                    var caminhoImagem = Path.Combine(pastaPacote, nomeImagem);
                    
                    // Processa as 3 primeiras imagens para o mosaico da galeria
                    if (i < 3)
                    {
                        var processedImageData = await ImageProcessingService.ResizeImageForGallery(imagem, i);
                        await ImageProcessingService.SaveProcessedImageAsync(processedImageData, caminhoImagem);
                    }
                    else
                    {
                        // Imagens após a terceira mantêm tamanho original
                        using var stream = new FileStream(caminhoImagem, FileMode.Create);
                        await imagem.CopyToAsync(stream);
                    }
                    
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

            await _repository.CadastrarAsync(pacote);
        }

        public async Task<List<PacoteDTO>> BuscarComFiltroAsync(FiltroPacoteDTO filtro)
        {
            var pacotes = await _repository.ListarAsync();
            var resultado = pacotes.AsQueryable();

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
                Estrelas = p.Estrelas,
                ValorTotal = p.ValorTotal,
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
            pacoteExistente.Estrelas = dto.Estrelas;
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