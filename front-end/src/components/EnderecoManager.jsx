import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { fetchEnderecos, createEndereco, updateEndereco, deleteEndereco } from '../api/enderecos';
import useToast from '../hooks/useToast';
import useConfirm from '../hooks/useConfirm';
import ToastContainer from './ui/ToastContainer';
import ConfirmModal from './ui/ConfirmModal';

export default function EnderecoManager() {
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { isOpen: confirmOpen, config: confirmConfig, confirm, handleConfirm, handleCancel } = useConfirm();
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState(null);
  const [formData, setFormData] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    apelido: ''
  });

  useEffect(() => {
    loadEnderecos();
  }, []);

  const loadEnderecos = async () => {
    try {
      setLoading(true);
      const data = await fetchEnderecos();
      setEnderecos(data);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEndereco) {
        await updateEndereco(editingEndereco.id, formData);
      } else {
        await createEndereco(formData);
      }
      
      setShowForm(false);
      setEditingEndereco(null);
      setFormData({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil',
        apelido: ''
      });
      loadEnderecos();
      showSuccess('Endereço salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      showError('Erro ao salvar endereço: ' + error.message);
    }
  };

  const handleEdit = (endereco) => {
    setEditingEndereco(endereco);
    setFormData({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      pais: endereco.pais,
      apelido: endereco.apelido || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (enderecoId) => {
    const confirmed = await confirm({
      title: "Remover endereço",
      message: "Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita.",
      confirmText: "Remover",
      cancelText: "Cancelar",
      variant: "danger"
    });

    if (confirmed) {
      try {
        await deleteEndereco(enderecoId);
        loadEnderecos();
        showSuccess('Endereço removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover endereço:', error);
        showError('Erro ao remover endereço: ' + error.message);
      }
    }
  };

  const formatCEP = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 5) {
      return v.substring(0, 5) + '-' + v.substring(5, 8);
    }
    return v;
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || prev.logradouro,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
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
        <h3 className="text-xl font-semibold text-gray-800">Meus Endereços</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <FaPlus /> Adicionar Endereço
        </button>
      </div>

      {/* Lista de endereços */}
      <div className="grid gap-4">
        {enderecos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaMapMarkerAlt className="mx-auto text-4xl mb-4 opacity-50" />
            <p>Nenhum endereço cadastrado</p>
          </div>
        ) : (
          enderecos.map((endereco) => (
            <div key={endereco.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="font-medium">{endereco.apelido || 'Endereço'}</span>
                  </div>
                  <p className="text-gray-600">{endereco.enderecoCompleto}</p>
                  <p className="text-sm text-gray-500">CEP: {endereco.cep}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(endereco)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(endereco.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingEndereco ? 'Editar Endereço' : 'Adicionar Endereço'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEndereco(null);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formatCEP(formData.cep)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, cep: value});
                  }}
                  onBlur={(e) => buscarCEP(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                  maxLength="9"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro
                </label>
                <input
                  type="text"
                  value={formData.logradouro}
                  onChange={(e) => setFormData({...formData, logradouro: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.complemento}
                    onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength="2"
                    placeholder="SP"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  value={formData.pais}
                  onChange={(e) => setFormData({...formData, pais: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
                  placeholder="Casa, Trabalho, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEndereco(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  {editingEndereco ? 'Atualizar' : 'Adicionar'}
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
