import React, { useState } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Eye, Filter, Download, User, MapPin } from 'lucide-react';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import Button from './ui/Button';
import Badge from './ui/Badge';

// Dados mockados - substituir por dados reais da API
const mockReservations = [
  {
    id: 1,
    codigo: "RES001",
    cliente: "Maria Silva",
    email: "maria@email.com",
    pacote: "Foz do Iguaçu",
    destino: "Foz do Iguaçu, Brasil",
    dataViagem: "2024-08-15",
    dataReserva: "2024-07-20",
    valor: 2110,
    status: "confirmada",
    pessoas: 2,
    pagamento: "pago"
  },
  {
    id: 2,
    codigo: "RES002", 
    cliente: "João Santos",
    email: "joao@email.com",
    pacote: "Rio de Janeiro",
    destino: "Rio de Janeiro, Brasil",
    dataViagem: "2024-08-20",
    dataReserva: "2024-07-18",
    valor: 1355,
    status: "pendente",
    pessoas: 1,
    pagamento: "pendente"
  },
  {
    id: 3,
    codigo: "RES003",
    cliente: "Ana Costa",
    email: "ana@email.com", 
    pacote: "Florianópolis",
    destino: "Florianópolis, Brasil",
    dataViagem: "2024-08-25",
    dataReserva: "2024-07-15",
    valor: 807,
    status: "cancelada",
    pessoas: 3,
    pagamento: "reembolsado"
  }
];

const ReservationManagement = () => {
  const [reservations, setReservations] = useState(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.pacote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (pagamento) => {
    switch(pagamento) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'reembolsado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      setReservations(reservations.filter(res => res.id !== id));
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Gerenciamento de Reservas
          </h1>
          <p className="text-blue-700 mt-1">Gerencie todas as reservas de viagem</p>
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
            <span>Nova Reserva</span>
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
                  placeholder="Buscar por cliente, código ou pacote..."
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
                <option value="confirmada">Confirmada</option>
                <option value="pendente">Pendente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-blue-900">#{reservation.codigo}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <Badge className={getPaymentColor(reservation.pagamento)}>
                          {reservation.pagamento}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {reservation.valor.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{reservation.pessoas} pessoa(s)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{reservation.cliente}</p>
                        <p className="text-gray-600">{reservation.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{reservation.pacote}</p>
                        <p className="text-gray-600">{reservation.destino}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Viagem: {reservation.dataViagem}</p>
                        <p className="text-gray-600">Reserva: {reservation.dataReserva}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center"
                    onClick={() => {}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span>Ver</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center justify-center"
                    onClick={() => handleEdit(reservation)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span>Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span>Excluir</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredReservations.length === 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova reserva.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReservationManagement;
