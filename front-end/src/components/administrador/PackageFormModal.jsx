import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Package,
  Star,
} from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import ToastContainer from "../ui/ToastContainer";
import useToast from "../../hooks/useToast";
import { estaLogado, obterTipoUsuario } from "../../api/auth";
import axios from "axios";

const PackageFormModal = ({ isOpen, onClose, editingPackage, onSave }) => {
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    destino: "",
    estrelas: 3,
    valorTotal: "",
    descricao: "",
    categorias: ["2em1"],
    duracao: 7,
    dataDisponivel: new Date().toISOString().split("T")[0],
    quantidadeMaximaPessoas: "",
    imagens: [],
    videos: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Atualiza o formulário quando editingPackage muda
  useEffect(() => {
    if (editingPackage) {
      setFormData({
        titulo: editingPackage.titulo || editingPackage.nome || "",
        destino: editingPackage.destino || "",
        estrelas: editingPackage.estrelas || 3,
        valorTotal: editingPackage.valorTotal || editingPackage.preco || "",
        descricao: editingPackage.descricao || "",
        categorias: editingPackage.categorias 
          ? (Array.isArray(editingPackage.categorias) ? editingPackage.categorias : [editingPackage.categorias])
          : ["2em1"],
        duracao: editingPackage.duracao || 7,
        dataDisponivel: editingPackage.dataDisponivel 
          ? new Date(editingPackage.dataDisponivel).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        quantidadeMaximaPessoas: editingPackage.quantidadeMaximaPessoas || "",
        imagens: [],
        videos: [],
      });
    } else {
      // Reset para valores padrão quando não está editando
      setFormData({
        titulo: "",
        destino: "",
        estrelas: 3,
        valorTotal: "",
        descricao: "",
        categorias: ["2em1"],
        duracao: 7,
        dataDisponivel: new Date().toISOString().split("T")[0],
        quantidadeMaximaPessoas: "",
        imagens: [],
        videos: [],
      });
    }
    setErrors({});
  }, [editingPackage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleCategoriaChange = (categoria) => {
    setFormData((prev) => {
      const currentCategorias = prev.categorias;
      const isSelected = currentCategorias.includes(categoria);
      
      let newCategorias;
      if (isSelected) {
        // Remove a categoria se já estiver selecionada
        newCategorias = currentCategorias.filter(c => c !== categoria);
      } else {
        // Adiciona a categoria se não estiver selecionada
        newCategorias = [...currentCategorias, categoria];
      }
      
      // Garante que pelo menos uma categoria esteja selecionada
      if (newCategorias.length === 0) {
        newCategorias = ["2em1"];
      }
      
      return {
        ...prev,
        categorias: newCategorias,
      };
    });
    
    // Limpa o erro do campo categorias
    if (errors.categorias) {
      setErrors((prev) => ({
        ...prev,
        categorias: null,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      imagens: files,
    }));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      videos: files,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = "Título é obrigatório";
    if (!formData.destino.trim()) newErrors.destino = "Destino é obrigatório";
    if (!formData.estrelas || formData.estrelas < 1 || formData.estrelas > 5) {
      newErrors.estrelas = "Estrelas deve ser entre 1 e 5";
    }
    if (!formData.valorTotal || formData.valorTotal <= 0)
      newErrors.valorTotal = "Valor deve ser maior que zero";
    if (!formData.descricao.trim())
      newErrors.descricao = "Descrição é obrigatória";
    if (
      !formData.quantidadeMaximaPessoas ||
      formData.quantidadeMaximaPessoas <= 0
    ) {
      newErrors.quantidadeMaximaPessoas =
        "Quantidade máxima deve ser maior que zero";
    }
    if (!formData.duracao || formData.duracao <= 0)
      newErrors.duracao = "Duração deve ser maior que zero";

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
        showError("Você precisa estar logado para criar um pacote");
        return;
      }

      const tipoUsuario = obterTipoUsuario();
      console.log("Tipo de usuário:", tipoUsuario);

      const token = localStorage.getItem("token");
      console.log("Token encontrado:", token ? "SIM" : "NÃO");

      // Prepara os dados para envio
      const formDataToSend = new FormData();

      // Adiciona todos os campos do pacote conforme o DTO
      formDataToSend.append("Titulo", formData.titulo);
      formDataToSend.append("Destino", formData.destino);
      formDataToSend.append('Estrelas', parseInt(formData.estrelas));
      formDataToSend.append("ValorTotal", parseFloat(formData.valorTotal));
      formDataToSend.append("Descricao", formData.descricao);
      formDataToSend.append("Categorias", formData.categorias.join(","));
      formDataToSend.append("Duracao", parseInt(formData.duracao));
      formDataToSend.append("DataDisponivel", formData.dataDisponivel); // Backend deve aceitar YYYY-MM-DD
      formDataToSend.append(
        "QuantidadeMaximaPessoas",
        parseInt(formData.quantidadeMaximaPessoas)
      );

      // Adiciona imagens se houver
      formData.imagens.forEach((imagem, index) => {
        formDataToSend.append("Imagens", imagem);
      });

      // Adiciona vídeos se houver
      formData.videos.forEach((video, index) => {
        formDataToSend.append("Videos", video);
      });

      // Debug: mostrar dados que estão sendo enviados
      console.log("Dados sendo enviados:");
      console.log("Titulo:", formData.titulo);
      console.log("Destino:", formData.destino);
      console.log("ValorTotal:", parseFloat(formData.valorTotal));
      console.log("ValorUnitario:", parseFloat(formData.valorTotal));
      console.log("Descricao:", formData.descricao);
      console.log("Categorias:", formData.categorias.join(","));
      console.log("Duracao:", parseInt(formData.duracao));
      console.log("DataDisponivel:", formData.dataDisponivel);
      console.log(
        "QuantidadeMaximaPessoas:",
        parseInt(formData.quantidadeMaximaPessoas)
      );
      console.log("Imagens:", formData.imagens.length);
      console.log("Videos:", formData.videos.length);

      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ":", value);
      }

      // Envia para o backend
      const url = editingPackage 
        ? `http://localhost:5295/api/Pacote/${editingPackage.id}`
        : "http://localhost:5295/api/Pacote/cadastrar-simples";
        
      const response = await fetch(url, {
        method: editingPackage ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Status da resposta:", response.status);

      if (response.ok) {
        const result = await response.json();
        onSave(result);
        onClose();

        // Reset form
        setFormData({
          titulo: "",
          destino: "",
          // origem: '',
          valorTotal: "",
          descricao: "",
          categorias: ["2em1"],
          duracao: 7,
          dataDisponivel: new Date().toISOString().split("T")[0],
          quantidadeMaximaPessoas: "",
          imagens: [],
          videos: [],
        });

        showSuccess(
          editingPackage
            ? "Pacote atualizado com sucesso! 🎉"
            : "Pacote criado com sucesso! 🎉"
        );
      } else {
        const errorText = await response.text();
        console.error("Erro detalhado:", {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });

        try {
          const errorData = JSON.parse(errorText);
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Mostra erros de validação específicos
            const errorMessages = errorData.errors
              .map(err => `${err.Field}: ${err.Errors.join(', ')}`)
              .join('\n');
            showError(`Erro de validação:\n${errorMessages}`);
          } else {
            // Mostra erro geral
            showError(
              `Erro ${response.status}: ${
                errorData.message || errorData.title || "Erro ao salvar pacote"
              }`
            );
          }
        } catch (parseError) {
          showError(
            `Erro ${response.status}: ${response.statusText}\nDetalhes: ${errorText}`
          );
        }
      }
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      showError("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  // Detecta destinos comuns no texto do usuário
  const detectarDestino = async (userText) => {
    const destinosDetectados = ["maceió", "cancún", "rio", "salvador", "recife"]
      .filter(destino => userText.toLowerCase().includes(destino));

    if (destinosDetectados.length > 0) {
      // Buscar por destino específico
      const response = await axios.post("http://localhost:5295/api/pacote/buscar", {
        destino: destinosDetectados[0],
        // outros filtros...
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Package className="w-6 h-6" />
              {editingPackage ? "Editar Pacote" : "Novo Pacote"}
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
                  Título do Pacote *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Maceió + Maragogi"
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
                )}
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
                      errors.destino ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ex: Maceió e Maragogi, Brasil"
                  />
                </div>
                {errors.destino && (
                  <p className="text-red-500 text-sm mt-1">{errors.destino}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria * (Selecione uma ou mais)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {[
                    { value: "2em1", label: "2 em 1" },
                    { value: "nacional", label: "Nacional" },
                    { value: "internacional", label: "Internacional" },
                    { value: "praia", label: "Praia" },
                    { value: "cidade", label: "Cidade" },
                    { value: "aventura", label: "Aventura" },
                    { value: "cultura", label: "Cultura" },
                    { value: "romântico", label: "Romântico" },
                    { value: "familiar", label: "Familiar" },
                    { value: "ecoturismo", label: "Ecoturismo" },
                    { value: "histórico", label: "Histórico" },
                    { value: "gastronômico", label: "Gastronômico" }
                  ].map((categoria) => (
                    <label
                      key={categoria.value}
                      className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categorias.includes(categoria.value)}
                        onChange={() => handleCategoriaChange(categoria.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">{categoria.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Selecionadas: {formData.categorias.map(cat => {
                      const categoria = [
                        { value: "2em1", label: "2 em 1" },
                        { value: "nacional", label: "Nacional" },
                        { value: "internacional", label: "Internacional" },
                        { value: "praia", label: "Praia" },
                        { value: "cidade", label: "Cidade" },
                        { value: "aventura", label: "Aventura" },
                        { value: "cultura", label: "Cultura" },
                        { value: "romântico", label: "Romântico" },
                        { value: "familiar", label: "Familiar" },
                        { value: "ecoturismo", label: "Ecoturismo" },
                        { value: "histórico", label: "Histórico" },
                        { value: "gastronômico", label: "Gastronômico" }
                      ].find(c => c.value === cat);
                      return categoria ? categoria.label : cat;
                    }).join(", ")}
                  </p>
                </div>
                {errors.categorias && (
                  <p className="text-red-500 text-sm mt-1">{errors.categorias}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estrelas do Hotel *
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="estrelas"
                    value={formData.estrelas}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.estrelas ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} estrela{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.estrelas && (
                  <p className="text-red-500 text-sm mt-1">{errors.estrelas}</p>
                )}
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
                      errors.valorTotal ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="2554.00"
                  />
                </div>
                {errors.valorTotal && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.valorTotal}
                  </p>
                )}
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
                      errors.duracao ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="7"
                  />
                </div>
                {errors.duracao && (
                  <p className="text-red-500 text-sm mt-1">{errors.duracao}</p>
                )}
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
                      errors.quantidadeMaximaPessoas
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="8"
                  />
                </div>
                {errors.quantidadeMaximaPessoas && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quantidadeMaximaPessoas}
                  </p>
                )}
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
                  errors.descricao ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Descreva os principais atrativos do pacote..."
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
              )}
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
                      {formData.imagens.length > 0
                        ? `${formData.imagens.length} imagem(ns) selecionada(s)`
                        : "Clique para fazer upload das imagens"}
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
                      {formData.videos.length > 0
                        ? `${formData.videos.length} vídeo(s) selecionado(s)`
                        : "Clique para fazer upload dos vídeos"}
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
                {isLoading
                  ? "Salvando..."
                  : editingPackage
                  ? "Atualizar"
                  : "Criar Pacote"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default PackageFormModal;