import React from 'react';
import { X, MapPin, Calendar, Users, Star, Package, DollarSign } from 'lucide-react';

const PackageViewModal = ({ isOpen, onClose, packageData }) => {
  if (!isOpen || !packageData) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Detalhes do Pacote
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-4">
              <div className="h-64 rounded-lg overflow-hidden bg-gray-100">
                {packageData.imagem ? (
                  <img 
                    src={packageData.imagem} 
                    alt={packageData.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
                    packageData.imagem ? 'hidden' : 'flex'
                  }`}
                >
                  <Package className="w-16 h-16 text-white/50" />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{packageData.nome}</h3>
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{packageData.destino}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{packageData.estrelas || 4} estrelas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{packageData.duracao || 'N/A'} dias</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Até {packageData.quantidadeMaximaPessoas || 'N/A'} pessoas</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Preço</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(packageData.preco)}
                </p>
                <p className="text-sm text-green-700">por pessoa</p>
              </div>

              {/* Category and Status */}
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  packageData.categoria === 'completo' ? 'bg-blue-100 text-blue-800' :
                  packageData.categoria === 'hospedagem' ? 'bg-purple-100 text-purple-800' :
                  packageData.categoria === 'aereo' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {packageData.categoria}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  packageData.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {packageData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {packageData.descricao && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Descrição</h4>
              <p className="text-gray-700 leading-relaxed">{packageData.descricao}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{packageData.reservas}</div>
              <div className="text-sm text-blue-700">Total de Reservas</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(packageData.preco * packageData.reservas)}
              </div>
              <div className="text-sm text-orange-700">Receita Total</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatDate(packageData.dataUltimaReserva)}
              </div>
              <div className="text-sm text-green-700">Última Reserva</div>
            </div>
          </div>

          {/* Additional Details */}
          {packageData.detalhes && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Detalhes Adicionais</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {typeof packageData.detalhes === 'string' 
                    ? packageData.detalhes 
                    : JSON.stringify(packageData.detalhes, null, 2)
                  }
                </pre>
              </div>
            </div>
          )}

          {/* Policies */}
          {packageData.politicas && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Políticas</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">{packageData.politicas}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageViewModal;
