using AutoMapper;
using agencia.Models;
using agencia.DTOs;

namespace agencia.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            CreateMap<Usuario, UsuarioDTO>();
            CreateMap<UsuarioDTO, Usuario>();


            CreateMap<TipoUsuario, TipoUsuarioDTO>();
            CreateMap<TipoUsuarioDTO, TipoUsuario>();


            CreateMap<TipoDocumento, TipoDocumentoDTO>();
            CreateMap<TipoDocumentoDTO, TipoDocumento>();


            CreateMap<Reserva, ReservaDTO>();
            CreateMap<ReservaDTO, Reserva>();


            CreateMap<Pagamento, PagamentoDTO>();
            CreateMap<PagamentoDTO, Pagamento>();


            CreateMap<Pacote, PacoteDTO>();
            CreateMap<PacoteDTO, Pacote>();


            CreateMap<Promocao, PromocaoDTO>();
            CreateMap<PromocaoDTO, Promocao>();


            CreateMap<Avaliacao, AvaliacaoDTO>();
            CreateMap<AvaliacaoDTO, Avaliacao>();


            CreateMap<Midia, MidiaDTO>();
            CreateMap<MidiaDTO, Midia>();


            CreateMap<Viajante, ViajanteDTO>();
            CreateMap<ViajanteDTO, Viajante>();
        }
    }
}