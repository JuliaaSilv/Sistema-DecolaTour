import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import Button from './ui/Button';
import Badge from './ui/Badge';

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
  },
  {
    id: 2,
    nome: "Rio de Janeiro",
    destino: "Rio de Janeiro, Brasil", 
    preco: 1355,
    categoria: "completo",
    status: "ativo",
    reservas: 18,
    dataUltimaReserva: "2024-07-18",
    imagem: "/packages/rio.jpg"
  },
  {
    id: 3,
    nome: "Florianópolis",
    destino: "Florianópolis, Brasil",
    preco: 807,
    categoria: "hospedagem",
    status: "inativo",
    reservas: 12,
    dataUltimaReserva: "2024-07-15",
    imagem: "/packages/floripa.jpg"
  }
];

const PackageManagement = () => {
  const [packages, setPackages] = useState(mockPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destino.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
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
            onClick={() => {}} 
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Exportar</span>
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Novo Pacote</span>
          </Button>
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

      {/* Lista de Pacotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPackages.map((packageItem) => (
          <Card key={packageItem.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {/* Imagem do pacote */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-white/50" />
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
                    onClick={() => {}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span>Ver</span>
                  </Button>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredPackages.length === 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pacote encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo pacote.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageManagement;
