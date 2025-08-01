import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import Button from './ui/Button';
import Badge from './ui/Badge';
import PackageFormModal from './PackageFormModal';
import PackageViewModal from './PackageViewModal';
import { obterTipoUsuario } from '../../api/auth';

// Dados mockados - substituir por dados reais da API
const mockPackages = [
  {
    id: 1,
    nome: "Foz do Iguaçu",
    destino: "Foz do Iguaçu, Brasil",
    preco: 2110,
    categoria: "completo",
    status: "ativo",
    reservas: 24,
    dataUltimaReserva: "2024-07-20",
    imagem: "/packages/foz.jpg"
  }
];

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtenha o tipo do usuário
  const tipoUsuario = parseInt(obterTipoUsuario());

  // Carrega os pacotes do backend
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log('PackageManagement - Token:', token ? 'Presente' : 'Ausente');
      
      const response = await fetch('http://localhost:5295/api/Pacote', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      console.log('PackageManagement - Response status:', response.status);
      console.log('PackageManagement - Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('PackageManagement - Dados brutos do backend:', data);
        console.log('PackageManagement - Quantidade de pacotes:', data.length);
        
        // Se não há dados do backend, usa dados mockados temporariamente
        if (!data || data.length === 0) {
          console.log('PackageManagement - Nenhum pacote encontrado no backend, usando dados mockados');
          setPackages(mockPackages);
          return;
        }
        
        // Adapta os dados do backend para o formato esperado pelo frontend
        const adaptedPackages = data.map(pkg => {
          // Adapta categoria: pega a primeira se vier separada por vírgula
          let categoria = 'completo';
          if (pkg.categorias) {
            categoria = pkg.categorias.split(',')[0].toLowerCase();
          }
          return {
            id: pkg.id,
            nome: pkg.titulo || pkg.nome,
            destino: pkg.destino,
            preco: parseFloat(pkg.valorTotal || 0),
            categoria,
            status: 'ativo', // Status padrão até implementar no backend
            reservas: Math.floor(Math.random() * 50), // Dados fictícios até implementar
            dataUltimaReserva: new Date().toISOString().split('T')[0],
            imagem: pkg.imagemUrl && pkg.imagemUrl.trim() !== ''
              ? pkg.imagemUrl
              : (pkg.imagens && pkg.imagens.length > 0
                  ? `http://localhost:5295${pkg.imagens[0].url}`
                  : ''), // Deixe vazio se não houver imagem
            descricao: pkg.descricao,
            quantidadeMaximaPessoas: pkg.quantidadeMaximaPessoas,
            duracao: pkg.duracao,
            estrelas: pkg.estrelas,
            // origem: pkg.origem,
            email: pkg.email,
            detalhes: typeof pkg.detalhes === 'string' ? JSON.parse(pkg.detalhes) : pkg.detalhes,
            politicas: pkg.politicas
          };
        });
        console.log('PackageManagement - Pacotes adaptados:', adaptedPackages);
        setPackages(adaptedPackages);
      } else {
        console.error('PackageManagement - Erro ao carregar pacotes, status:', response.status);
        const errorText = await response.text();
        console.error('PackageManagement - Erro detalhado:', errorText);
        setError('Erro ao carregar pacotes do servidor');
        // Fallback para dados mockados se não conseguir carregar do backend
        setPackages(mockPackages);
      }
    } catch (error) {
      console.error('PackageManagement - Erro de conexão:', error);
      setError('Erro de conexão com o servidor');
      // Fallback para dados mockados
      setPackages(mockPackages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePackage = (savedPackage) => {
    // Atualiza a lista de pacotes
    fetchPackages();
    // Mostra mensagem de sucesso
    alert(editingPackage ? 'Pacote atualizado com sucesso!' : 'Pacote criado com sucesso!');
  };

  const filteredPackages = packages.filter(pkg => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (pkg.nome?.toLowerCase() || '').includes(searchLower) ||
                         (pkg.destino?.toLowerCase() || '').includes(searchLower);
    const matchesStatus = filterStatus === 'todos' || pkg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (categoria) => {
    switch(categoria) {
      case 'completo': return 'bg-blue-100 text-blue-800';
      case 'hospedagem': return 'bg-purple-100 text-purple-800';
      case 'aereo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (packageItem) => {
    setEditingPackage(packageItem);
    setIsModalOpen(true);
  };

  const handleView = (packageItem) => {
    setViewingPackage(packageItem);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote? Esta ação não pode ser desfeita.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Você precisa estar logado para excluir um pacote');
          return;
        }

        const response = await fetch(`http://localhost:5295/api/Pacote/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          // Remove da lista local
          setPackages(packages.filter(pkg => pkg.id !== id));
          alert('Pacote excluído com sucesso!');
        } else {
          const errorText = await response.text();
          console.error('Erro ao excluir pacote:', errorText);
          alert('Erro ao excluir pacote. Verifique se não há reservas associadas.');
        }
      } catch (error) {
        console.error('Erro ao excluir pacote:', error);
        alert('Erro de conexão ao tentar excluir o pacote.');
      }
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    try {
      // Prepara os dados para exportação
      const exportData = filteredPackages.map(pkg => ({
        ID: pkg.id,
        Nome: pkg.nome,
        Destino: pkg.destino,
        Preço: `R$ ${pkg.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        Categoria: pkg.categoria,
        Status: pkg.status,
        Reservas: pkg.reservas,
        'Última Reserva': pkg.dataUltimaReserva,
        'Capacidade Máxima': pkg.quantidadeMaximaPessoas || 'N/A',
        Descrição: pkg.descricao || 'N/A'
      }));

      // Converte para CSV
      const headers = Object.keys(exportData[0]).join(',');
      const csvContent = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${csvContent}`;
      
      // Cria e baixa o arquivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pacotes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Gerenciamento de Pacotes
          </h1>
          <p className="text-blue-700 mt-1">Gerencie todos os pacotes de viagem</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleExport} 
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center"
            disabled={filteredPackages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Exportar</span>
          </Button>
          {(tipoUsuario === 1 || tipoUsuario === 2) && (
            <Button
              onClick={handleCreate}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Novo Pacote</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou destino..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de erro */}
      {error && (
        <Card className="bg-red-50 border border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Package className="w-5 h-5" />
              <span className="font-medium">Atenção:</span>
              <span>{error}</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Alguns dados podem estar sendo exibidos offline.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pacotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredPackages.map((packageItem) => (
          <Card key={packageItem.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {/* Imagem do pacote */}
              <div className="h-48 rounded-t-lg overflow-hidden">
                {packageItem.imagem ? (
                  <img 
                    src={packageItem.imagem} 
                    alt={packageItem.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
                    packageItem.imagem ? 'hidden' : 'flex'
                  }`}
                >
                  <Package className="w-16 h-16 text-white/50" />
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Título e badges */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-blue-900">{packageItem.nome}</h3>
                    <Badge className={getStatusColor(packageItem.status)}>
                      {packageItem.status}
                    </Badge>
                  </div>
                  <p className="text-blue-700 text-sm">{packageItem.destino}</p>
                  <Badge className={`${getCategoryColor(packageItem.categoria)} mt-1`}>
                    {packageItem.categoria}
                  </Badge>
                </div>

                {/* Estatísticas */}
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Preço:</span>
                    <p className="font-bold text-green-600">R$ {packageItem.preco.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">Reservas:</span>
                    <p className="font-bold text-blue-600">{packageItem.reservas}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Última reserva: {packageItem.dataUltimaReserva}
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center"
                    onClick={() => handleView(packageItem)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span>Ver</span>
                  </Button>
                  {(tipoUsuario === 1 || tipoUsuario === 2) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center justify-center"
                        onClick={() => handleEdit(packageItem)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center px-3"
                        onClick={() => handleDelete(packageItem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Mensagem quando não há resultados */}
      {!isLoading && filteredPackages.length === 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pacote encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo pacote.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Cadastro/Edição */}
      {(tipoUsuario === 1 || tipoUsuario === 2) && (
        <PackageFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPackage(null);
          }}
          editingPackage={editingPackage}
          onSave={handleSavePackage}
        />
      )}

      {/* Modal de Visualização */}
      <PackageViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingPackage(null);
        }}
        packageData={viewingPackage}
      />
    </div>
  );
};

export default PackageManagement;
