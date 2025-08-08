import { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { fetchCartoes, createCartao, updateCartao, deleteCartao } from '../api/cartoes';
import useToast from '../hooks/useToast';
import useConfirm from '../hooks/useConfirm';
import ToastContainer from './ui/ToastContainer';
import ConfirmModal from './ui/ConfirmModal';

export default function CartaoManager() {
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { isOpen: confirmOpen, config: confirmConfig, confirm, handleConfirm, handleCancel } = useConfirm();
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCartao, setEditingCartao] = useState(null);
  const [formData, setFormData] = useState({
    nomeTitular: '',
    numeroCartao: '',
    validade: '',
    cvv: '',
    tipoCartao: 'Crédito',
    apelido: ''
  });

  useEffect(() => {
    loadCartoes();
  }, []);

  const loadCartoes = async () => {
    try {
      setLoading(true);
      const data = await fetchCartoes();
      setCartoes(data);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCartao) {
        await updateCartao(editingCartao.id, formData);
      } else {
        await createCartao(formData);
      }
      
      setShowForm(false);
      setEditingCartao(null);
      setFormData({
        nomeTitular: '',
        numeroCartao: '',
        validade: '',
        cvv: '',
        tipoCartao: 'Crédito',
        apelido: ''
      });
      loadCartoes();
      showSuccess('Cartão salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      showError('Erro ao salvar cartão: ' + error.message);
    }
  };

  const handleEdit = (cartao) => {
    setEditingCartao(cartao);
    setFormData({
      nomeTitular: cartao.nomeTitular,
      numeroCartao: '', // Não preenchemos o número por segurança
      validade: cartao.validade,
      cvv: '',
      tipoCartao: cartao.tipoCartao,
      apelido: cartao.apelido || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (cartaoId) => {
    const confirmed = await confirm({
      title: "Remover cartão",
      message: "Tem certeza que deseja remover este cartão? Esta ação não pode ser desfeita.",
      confirmText: "Remover",
      cancelText: "Cancelar",
      variant: "danger"
    });

    if (confirmed) {
      try {
        await deleteCartao(cartaoId);
        loadCartoes();
        showSuccess('Cartão removido com sucesso! 🗑️');
      } catch (error) {
        console.error('Erro ao remover cartão:', error);
        showError('Erro ao remover cartão: ' + error.message);
      }
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatValidade = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Formas de Pagamento</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <FaPlus /> Adicionar Cartão
        </button>
      </div>

      {/* Lista de cartões */}
      <div className="grid gap-4">
        {cartoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaCreditCard className="mx-auto text-4xl mb-4 opacity-50" />
            <p>Nenhum cartão cadastrado</p>
          </div>
        ) : (
          cartoes.map((cartao) => (
            <div key={cartao.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCreditCard className="text-blue-500" />
                    <span className="font-medium">{cartao.apelido || 'Cartão'}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{cartao.tipoCartao}</span>
                  </div>
                  <p className="text-gray-600">{cartao.nomeTitular}</p>
                  <p className="text-gray-500 font-mono">{cartao.numeroCartaoMascarado}</p>
                  <p className="text-sm text-gray-500">Válido até: {cartao.validade}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cartao)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cartao.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingCartao ? 'Editar Cartão' : 'Adicionar Cartão'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCartao(null);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Titular
                </label>
                <input
                  type="text"
                  value={formData.nomeTitular}
                  onChange={(e) => setFormData({...formData, nomeTitular: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {!editingCartao && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={formatCardNumber(formData.numeroCartao)}
                    onChange={(e) => setFormData({...formData, numeroCartao: e.target.value.replace(/\s/g, '')})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={formatValidade(formData.validade)}
                    onChange={(e) => setFormData({...formData, validade: e.target.value.replace(/\D/g, '')})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/AA"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="000"
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo do Cartão
                </label>
                <select
                  value={formData.tipoCartao}
                  onChange={(e) => setFormData({...formData, tipoCartao: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Crédito">Crédito</option>
                  <option value="Débito">Débito</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apelido (opcional)
                </label>
                <input
                  type="text"
                  value={formData.apelido}
                  onChange={(e) => setFormData({...formData, apelido: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cartão principal, Cartão trabalho, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCartao(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  {editingCartao ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        {...confirmConfig}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
