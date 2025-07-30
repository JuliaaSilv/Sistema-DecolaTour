import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, Users, DollarSign, Package } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import { estaLogado, obterTipoUsuario } from '../../api/auth';

const PackageFormModal = ({ isOpen, onClose, editingPackage, onSave }) => {
  const [formData, setFormData] = useState({
      titulo: editingPackage?.nome || '',
      destino: editingPackage?.destino || '',
      origem: editingPackage?.origem || '',
      valorTotal: editingPackage?.preco || '',
      descricao: editingPackage?.descricao || '',
      tipoPacote: editingPackage?.tipoPacote || 'nacional',
      categorias: editingPackage?.categoria || '2em1',
      duracao: editingPackage?.duracao || 7,
      dataDisponivel: editingPackage?.dataDisponivel || new Date().toISOString().split('T')[0],
      quantidadeMaximaPessoas: editingPackage?.quantidadeMaximaPessoas || '',
      imagens: [],
      videos: [],
      // Campos híbridos opcionais
      hotelServices: editingPackage?.hotelServices || [],
      politicas: editingPackage?.politicas || '',
      overview: editingPackage?.overview || '',
      highlights: editingPackage?.highlights || []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Funções para gerenciar serviços do hotel
  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      hotelServices: prev.hotelServices.some(s => s.title === service.title)
        ? prev.hotelServices.filter(s => s.title !== service.title)
        : [...prev.hotelServices, service]
    }));
  };

  // Funções para gerenciar highlights
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetalhes = [...formData.detalhes];
    updatedDetalhes[index][field] = value;
    setFormData(prev => ({
      ...prev,
      detalhes: updatedDetalhes
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      imagens: files
    }));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      videos: files
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.destino.trim()) newErrors.destino = 'Destino é obrigatório';
    if (!formData.origem.trim()) newErrors.origem = 'Origem é obrigatória';
    if (!formData.valorTotal || formData.valorTotal <= 0) newErrors.valorTotal = 'Valor deve ser maior que zero';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.quantidadeMaximaPessoas || formData.quantidadeMaximaPessoas <= 0) {
      newErrors.quantidadeMaximaPessoas = 'Quantidade máxima deve ser maior que zero';
    }
    if (!formData.duracao || formData.duracao <= 0) newErrors.duracao = 'Duração deve ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica se o usuário está logado
      if (!estaLogado()) {
        alert('Você precisa estar logado para criar um pacote');
        return;
      }
      
      const tipoUsuario = obterTipoUsuario();
      console.log('Tipo de usuário:', tipoUsuario);
      
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'SIM' : 'NÃO');

      // Prepara os dados para envio
      const formDataToSend = new FormData();
      
      // Adiciona todos os campos do pacote conforme o DTO
      formDataToSend.append('Titulo', formData.titulo);
      formDataToSend.append('Destino', formData.destino);
      formDataToSend.append('Origem', formData.origem);
      formDataToSend.append('ValorTotal', parseFloat(formData.valorTotal));
      formDataToSend.append('ValorUnitario', parseFloat(formData.valorTotal)); // Mesmo valor por enquanto
      formDataToSend.append('Descricao', formData.descricao);
      formDataToSend.append('Categorias', formData.categorias);
        formDataToSend.append('TipoPacote', formData.tipoPacote);
      formDataToSend.append('Duracao', parseInt(formData.duracao));
      formDataToSend.append('DataDisponivel', formData.dataDisponivel); // Backend deve aceitar YYYY-MM-DD
      formDataToSend.append('QuantidadeMaximaPessoas', parseInt(formData.quantidadeMaximaPessoas));
      
      // Adiciona imagens se houver
      formData.imagens.forEach((imagem, index) => {
        formDataToSend.append('Imagens', imagem);
      });

      // Adiciona vídeos se houver
      formData.videos.forEach((video, index) => {
        formDataToSend.append('Videos', video);
      });

      // Adiciona campos híbridos se preenchidos
      if (formData.hotelServices.length > 0) {
        formDataToSend.append('HotelServices', JSON.stringify(formData.hotelServices));
      }
      if (formData.politicas.trim()) {
        formDataToSend.append('Politicas', formData.politicas);
      }
      if (formData.overview.trim()) {
        formDataToSend.append('Overview', formData.overview);
      }
      if (formData.highlights.length > 0) {
        const filteredHighlights = formData.highlights.filter(h => h.trim());
        if (filteredHighlights.length > 0) {
          formDataToSend.append('Highlights', JSON.stringify(filteredHighlights));
        }
      }

      // Debug: mostrar dados que estão sendo enviados
      console.log('Dados sendo enviados:');
      console.log('Titulo:', formData.titulo);
      console.log('Destino:', formData.destino);
      console.log('Origem:', formData.origem);
      console.log('ValorTotal:', parseFloat(formData.valorTotal));
      console.log('ValorUnitario:', parseFloat(formData.valorTotal));
      console.log('Descricao:', formData.descricao);
      console.log('Categorias:', formData.categorias);
      console.log('Duracao:', parseInt(formData.duracao));
      console.log('DataDisponivel:', formData.dataDisponivel);
      console.log('QuantidadeMaximaPessoas:', parseInt(formData.quantidadeMaximaPessoas));
      console.log('Imagens:', formData.imagens.length);
      console.log('Videos:', formData.videos.length);
      
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }

      // Envia para o backend
      const response = await fetch('http://localhost:5295/api/Pacote/cadastrar-simples', {
        method: editingPackage ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });
      
      console.log('Status da resposta:', response.status);

      if (response.ok) {
        const result = await response.json();
        onSave(result);
        onClose();
        
        // Reset form
        setFormData({
          titulo: '',
          destino: '',
          origem: '',
          valorTotal: '',
          descricao: '',
          categorias: '2em1',
          duracao: 7,
          dataDisponivel: new Date().toISOString().split('T')[0],
          quantidadeMaximaPessoas: '',
          imagens: [],
          videos: [],
          hotelServices: [],
          politicas: '',
          overview: '',
          highlights: []
        });
        
        alert(editingPackage ? 'Pacote atualizado com sucesso!' : 'Pacote criado com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro detalhado:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        
        try {
          const errorData = JSON.parse(errorText);
          alert(`Erro ${response.status}: ${errorData.message || errorData.title || 'Erro ao salvar pacote'}`);
        } catch (parseError) {
          alert(`Erro ${response.status}: ${response.statusText}\nDetalhes: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar pacote:', error);
      alert('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Package className="w-6 h-6" />
              {editingPackage ? 'Editar Pacote' : 'Novo Pacote'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pacote *
                </label>
                <select
                  name="tipoPacote"
                  value={formData.tipoPacote}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="nacional">Nacional</option>
                  <option value="internacional">Internacional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Pacote *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.titulo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Maceió + Maragogi"
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destino *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="destino"
                    value={formData.destino}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.destino ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Maceió e Maragogi, Brasil"
                  />
                </div>
                {errors.destino && <p className="text-red-500 text-sm mt-1">{errors.destino}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Total (R$) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="valorTotal"
                    value={formData.valorTotal}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.valorTotal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2554.00"
                  />
                </div>
                {errors.valorTotal && <p className="text-red-500 text-sm mt-1">{errors.valorTotal}</p>}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (dias) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duracao ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="7"
                  />
                </div>
                {errors.duracao && <p className="text-red-500 text-sm mt-1">{errors.duracao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Disponível *
                </label>
                <input
                  type="date"
                  name="dataDisponivel"
                  value={formData.dataDisponivel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origem *
                </label>
                <input
                  type="text"
                  name="origem"
                  value={formData.origem}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.origem ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: São Paulo"
                />
                {errors.origem && <p className="text-red-500 text-sm mt-1">{errors.origem}</p>}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descreva os principais atrativos do pacote..."
              />
              {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
            </div>

            {/* Quantidade Máxima de Pessoas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade Máxima de Pessoas *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="quantidadeMaximaPessoas"
                  value={formData.quantidadeMaximaPessoas}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.quantidadeMaximaPessoas ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8"
                />
              </div>
              {errors.quantidadeMaximaPessoas && <p className="text-red-500 text-sm mt-1">{errors.quantidadeMaximaPessoas}</p>}
            </div>

            {/* Seção de Informações Adicionais (Opcionais) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informações Adicionais (Opcionais)</h3>
              
              {/* Overview Personalizado */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overview Personalizado
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição detalhada sobre o destino e experiências..."
                />
                <p className="text-xs text-gray-500 mt-1">Se não preenchido, será gerado automaticamente</p>
              </div>

              {/* Políticas Personalizadas */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Políticas Personalizadas
                </label>
                <textarea
                  name="politicas"
                  value={formData.politicas}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Políticas específicas de cancelamento, check-in, etc..."
                />
                <p className="text-xs text-gray-500 mt-1">Se não preenchido, será usado o padrão da empresa</p>
              </div>

              {/* Serviços do Hotel */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços Disponíveis
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { icon: "🏊‍♀️", title: "Piscina", description: "Área de lazer aquática" },
                    { icon: "🍽️", title: "Restaurante", description: "Opções gastronômicas" },
                    { icon: "📶", title: "Wi-Fi", description: "Internet gratuita" },
                    { icon: "🅿️", title: "Estacionamento", description: "Vagas disponíveis" },
                    { icon: "💆‍♀️", title: "Spa", description: "Centro de bem-estar" },
                    { icon: "🎯", title: "Concierge", description: "Atendimento especializado" }
                  ].map((service) => (
                    <label
                      key={service.title}
                      className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                        formData.hotelServices.some(s => s.title === service.title)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.hotelServices.some(s => s.title === service.title)}
                        onChange={() => handleServiceToggle(service)}
                        className="hidden"
                      />
                      <span className="mr-2">{service.icon}</span>
                      <span className="text-sm font-medium">{service.title}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Se não selecionado, serão usados os padrões baseados na categoria</p>
              </div>

              {/* Destaques */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destaques do Pacote
                </label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Localização privilegiada..."
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Adicionar destaque
                </button>
                <p className="text-xs text-gray-500 mt-1">Se não preenchido, serão gerados automaticamente</p>
              </div>
            </div>

            {/* Upload de Imagens e Vídeos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens do Pacote
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {formData.imagens.length > 0 ? `${formData.imagens.length} imagem(ns) selecionada(s)` : 'Clique para fazer upload das imagens'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vídeos do Pacote
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="videoUpload"
                  />
                  <label htmlFor="videoUpload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {formData.videos.length > 0 ? `${formData.videos.length} vídeo(s) selecionado(s)` : 'Clique para fazer upload dos vídeos'}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? 'Salvando...' : (editingPackage ? 'Atualizar' : 'Criar Pacote')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageFormModal;
