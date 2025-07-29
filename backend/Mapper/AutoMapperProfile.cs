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
            CreateMap<CreateReservaDTO, Reserva>()
                .ForMember(dest => dest.ValorUnitario, opt => opt.MapFrom(src => (float)src.ValorUnitario))
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.UsuarioId))
                .ForMember(dest => dest.PacoteId, opt => opt.MapFrom(src => src.PacoteId))
                .ForMember(dest => dest.NumeroReserva, opt => opt.Ignore())
                .ForMember(dest => dest.DataReserva, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Viajantes, opt => opt.Ignore());


            CreateMap<Pagamento, PagamentoDTO>()
                .ForMember(dest => dest.FormaDePagamento, opt => opt.MapFrom(src => src.FormaDePagamento.ToString()))
                .ForMember(dest => dest.StatusPagamento, opt => opt.MapFrom(src => src.StatusPagamento.ToString()))
                .ForMember(dest => dest.DataPagamento, opt => opt.MapFrom(src => src.DataPagamento));
            CreateMap<PagamentoDTO, Pagamento>()
                .ForMember(dest => dest.FormaDePagamento, opt => opt.MapFrom(src => Enum.Parse(typeof(FormaDePagamento), src.FormaDePagamento)))
                .ForMember(dest => dest.StatusPagamento, opt => opt.MapFrom(src => Enum.Parse(typeof(StatusPagamento), src.StatusPagamento)))
                .ForMember(dest => dest.DataPagamento, opt => opt.MapFrom(src => src.DataPagamento));


            CreateMap<Pacote, PacoteDTO>();
            CreateMap<PacoteDTO, Pacote>();
            CreateMap<CreatePacoteDTO, Pacote>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<CreateUsuarioDTO, Usuario>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());


            CreateMap<Promocao, PromocaoDTO>();
            CreateMap<PromocaoDTO, Promocao>();


            CreateMap<Avaliacao, AvaliacaoDTO>();
            CreateMap<AvaliacaoDTO, Avaliacao>();


            CreateMap<Midia, MidiaDTO>();
            CreateMap<MidiaDTO, Midia>();


            CreateMap<Viajante, ViajanteDTO>();
            CreateMap<ViajanteDTO, Viajante>()
                .ForMember(dest => dest.ReservaId, opt => opt.MapFrom(src => src.ReservaId))
                .ForMember(dest => dest.Reserva, opt => opt.Ignore());
        }
    }
}