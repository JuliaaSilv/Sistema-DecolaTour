import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';

// Função para extrair valor numérico do preço
const extractNumericPrice = (priceString) => {
  if (!priceString) return 0;
  const numericString = priceString.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(numericString) || 0;
};

const TravelerForm = ({ onNext, onCancel, pacote, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    email: initialData.email || '',
    telefone: initialData.telefone || '',
    cpf: initialData.cpf || '',
    endereco: initialData.endereco || '',
    cidade: initialData.cidade || '',
    estado: initialData.estado || '',
    cep: initialData.cep || '',
    dataViagem: initialData.dataViagem || '',
    numeroViajantes: initialData.numeroViajantes || 2,
    observacoes: initialData.observacoes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatações específicas
    if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    } else if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
    } else if (name === 'cep') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.dataViagem) newErrors.dataViagem = 'Data da viagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="p-6">
      {/* Resumo do pacote */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumo da Reserva</h3>
        <div className="flex items-center gap-4">
          <img 
            src={pacote.imagem} 
            alt={pacote.nome}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <p className="font-semibold text-gray-800">{pacote.nome}</p>
            <p className="text-gray-600">{pacote.destino}</p>
            <p className="text-[#F28C38] font-bold">R$ {extractNumericPrice(pacote.preco).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-[#F28C38]" size={24} />
            Dados Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.nome ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="Digite seu nome completo"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.cpf ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="seu.email@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.telefone ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="(11) 99999-9999"
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-[#F28C38]" size={24} />
            Endereço
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço *
              </label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.endereco ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="Rua, número, complemento"
              />
              {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.cidade ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="Nome da cidade"
              />
              {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.estado ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
              >
                <option value="">Selecione o estado</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="SC">Santa Catarina</option>
                <option value="PR">Paraná</option>
                <option value="RS">Rio Grande do Sul</option>
                {/* Adicionar outros estados conforme necessário */}
              </select>
              {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP *
              </label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.cep ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
                placeholder="00000-000"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-[#F28C38]" size={24} />
            Detalhes da Viagem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Viagem *
              </label>
              <input
                type="date"
                name="dataViagem"
                value={formData.dataViagem}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 ${
                  errors.dataViagem ? 'border-red-500' : 'border-gray-200 focus:border-[#F28C38]'
                }`}
              />
              {errors.dataViagem && <p className="text-red-500 text-sm mt-1">{errors.dataViagem}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Viajantes
              </label>
              <select
                name="numeroViajantes"
                value={formData.numeroViajantes}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações (Opcional)
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
            placeholder="Alguma solicitação especial, preferências ou informações adicionais..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-[#F28C38] text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold cursor-pointer"
          >
            Continuar para Pagamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelerForm;
