import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Eye, Download, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './ui/Card';
import CardContent from './ui/CardContent';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { obterTipoUsuario } from '../../api/auth';
import { fetchReservas, normalizeReservaData } from '../../api/reservas';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 9;

  const tipoUsuario = parseInt(obterTipoUsuario());

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReservas();
        console.log(normalizeReservaData);
        
        setReservations(data.map(normalizeReservaData));
        //setReservations(mockReservations) // Caso eu quiser usar os dados mockados.
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.pacote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Lógica de paginação
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);
  const startIndex = (currentPage - 1) * reservationsPerPage;
  const endIndex = startIndex + reservationsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  // Reset da página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll para o topo da lista
    document.querySelector('.space-y-6')?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleCreate = () => {
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">Erro ao carregar reservas</div>
          <p className="text-gray-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

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
          {(tipoUsuario === 1 || tipoUsuario === 2) && (
            <Button
              onClick={handleCreate}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Nova Reserva</span>
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

      {/* Mensagem quando não há resultados */}
      {(filteredReservations.length === 0) && !isLoading && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova reserva.</p>
          </CardContent>
        </Card>
      )}      

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {/* Informações da paginação */}
        {!isLoading && filteredReservations.length > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredReservations.length)} de {filteredReservations.length} reservas
            </span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        )}

        {currentReservations.map((reservation) => (
          <Card key={reservation.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-blue-900">#RES{reservation.codigo}</h3>
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

         
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Controles de Paginação */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;