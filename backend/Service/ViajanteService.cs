using agencia.Models;
using agencia.Interfaces.Repository;
using agencia.Interfaces.Services;
using agencia.DTOs;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace agencia.Service
{
    public class ViajanteService : IViajanteService
    {
        private readonly IViajanteRepository _repository;
        private readonly IMapper _mapper;

        // Injeta o repositório de viajante e o AutoMapper.
        public ViajanteService(IViajanteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // Retorna todos os viajantes como DTO.
        public async Task<IEnumerable<ViajanteDTO>> GetAllAsync()
        {
            var viajantes = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ViajanteDTO>>(viajantes);
        }

        // Busca um viajante por ID e retorna como DTO.
        public async Task<ViajanteDTO?> GetByIdAsync(int id)
        {
            var viajante = await _repository.GetByIdAsync(id);
            return viajante == null ? null : _mapper.Map<ViajanteDTO>(viajante);
        }

        // Adiciona um novo viajante a partir do DTO.
        public async Task AddAsync(ViajanteDTO viajanteDTO)
        {
            var viajante = _mapper.Map<Viajante>(viajanteDTO);
            await _repository.AddAsync(viajante);
        }

        // Atualiza um viajante existente a partir do DTO.
        public async Task UpdateAsync(ViajanteDTO viajanteDTO)
        {
            var viajante = _mapper.Map<Viajante>(viajanteDTO);
            await _repository.UpdateAsync(viajante);
        }

        // Remove um viajante pelo ID.
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}