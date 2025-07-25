import React, { useState } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye, Filter, Download, Mail, Phone, Star, Crown, Award } from 'lucide-react';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import Button from './ui/Button';
import Badge from './ui/Badge';

// Dados mockados - substituir por dados reais da API
const mockUsers = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria@email.com",
    telefone: "(11) 99999-9999",
    tipo: "Cliente",
    status: "ativo",
    dataRegistro: "2024-01-15",
    ultimoLogin: "2024-07-20",
    reservas: 12,
    totalGasto: 45600,
    tier: "Platinum"
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao@email.com",
    telefone: "(11) 88888-8888",
    tipo: "Cliente",
    status: "ativo",
    dataRegistro: "2024-02-10",
    ultimoLogin: "2024-07-18",
    reservas: 8,
    totalGasto: 32400,
    tier: "Gold"
  },
  {
    id: 3,
    nome: "Admin User",
    email: "admin@decolatour.com",
    telefone: "(11) 77777-7777",
    tipo: "Administrador",
    status: "ativo",
    dataRegistro: "2023-12-01",
    ultimoLogin: "2024-07-21",
    reservas: 0,
    totalGasto: 0,
    tier: null
  },
  {
    id: 4,
    nome: "Pedro Lima",
    email: "pedro@email.com",
    telefone: "(11) 66666-6666",
    tipo: "Cliente",
    status: "inativo",
    dataRegistro: "2024-03-05",
    ultimoLogin: "2024-06-15",
    reservas: 6,
    totalGasto: 24300,
    tier: "Silver"
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || user.tipo.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (tipo) => {
    return tipo === 'Administrador' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "Platinum": return <Crown className="w-4 h-4" />;
      case "Gold": return <Award className="w-4 h-4" />;
      case "Silver": return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum": return "bg-purple-100 text-purple-800";
      case "Gold": return "bg-yellow-100 text-yellow-800";
      case "Silver": return "bg-gray-100 text-gray-800";
      default: return "";
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-blue-700 mt-1">Gerencie clientes e administradores</p>
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
            <span>Novo Usuário</span>
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
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="todos">Todos os Tipos</option>
                <option value="cliente">Cliente</option>
                <option value="administrador">Administrador</option>
              </select>
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

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header do usuário */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-blue-900">{user.nome}</h3>
                        {user.tier && (
                          <Badge className={`${getTierColor(user.tier)} px-2 py-1`}>
                            <div className="flex items-center gap-1">
                              {getTierIcon(user.tier)}
                              <span className="text-xs font-medium">{user.tier}</span>
                            </div>
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <Badge className={getTypeColor(user.tipo)}>
                          {user.tipo}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de contato */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{user.telefone}</span>
                  </div>
                </div>

                {/* Estatísticas (apenas para clientes) */}
                {user.tipo === 'Cliente' && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{user.reservas}</p>
                      <p className="text-xs text-gray-600">Reservas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {user.totalGasto.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Gasto</p>
                    </div>
                  </div>
                )}

                {/* Datas */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Registrado em: {user.dataRegistro}</p>
                  <p>Último login: {user.ultimoLogin}</p>
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
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span>Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center px-3"
                    onClick={() => handleDelete(user.id)}
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
      {filteredUsers.length === 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo usuário.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
