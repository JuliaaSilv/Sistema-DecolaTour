import { useState, useEffect } from "react";
import { FaPen, FaUserCircle, FaCheck, FaUser, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUserProfile, updateCurrentUserProfile } from "../api/users";
import CartaoManager from "../components/CartaoManager";
import EnderecoManager from "../components/EnderecoManager";

export default function Perfil() {
    const [activeTab, setActiveTab] = useState('perfil');
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Valores originais para comparação
    const [nomeOriginal, setNomeOriginal] = useState("");
    const [telefoneOriginal, setTelefoneOriginal] = useState("");
    const [emailOriginal, setEmailOriginal] = useState("");
    const [dataNascimentoOriginal, setDataNascimentoOriginal] = useState("");

    const navigate = useNavigate();

    // Carregar dados do usuário
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const userProfile = await fetchCurrentUserProfile();
                
                // Formattar data de nascimento
                const formatDate = (dateString) => {
                    if (!dateString) return "";
                    const date = new Date(dateString);
                    return date.toLocaleDateString('pt-BR');
                };

                setNome(userProfile.nome || "");
                setTelefone(userProfile.telefone || "");
                setEmail(userProfile.email || "");
                setDataNascimento(formatDate(userProfile.dataNascimento));
                setCpf(userProfile.cpf || "");
                
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    // Atualizar valores originais quando os dados são carregados
    useEffect(() => {
        if (!isLoading) {
            setNomeOriginal(nome);
            setTelefoneOriginal(telefone);
            setEmailOriginal(email);
            setDataNascimentoOriginal(dataNascimento);
        }
    }, [isLoading, nome, telefone, email, dataNascimento]);

    // Função para salvar alterações do perfil
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setError(null);
            
            const updateData = {
                nome,
                telefone,
                email,
                cpf,
                dataNascimento: dataNascimento ? formatDateForAPI(dataNascimento) : null
            };

            await updateCurrentUserProfile(updateData);
            alert('Perfil atualizado com sucesso!');
            
            // Atualizar valores originais
            setNomeOriginal(nome);
            setTelefoneOriginal(telefone);
            setEmailOriginal(email);
            setDataNascimentoOriginal(dataNascimento);
            
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setError(error.message);
            alert('Erro ao atualizar perfil: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Função para formatar data para a API
    const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD/MM/YYYY para YYYY-MM-DD
        }
        return dateString;
    };

    // Verificar se houve mudanças
    const houveMudancas = nome !== nomeOriginal || 
                         telefone !== telefoneOriginal || 
                         email !== emailOriginal ||
                         dataNascimento !== dataNascimentoOriginal ||
                         fotoPerfil !== null;

    const tabs = [
        { id: 'perfil', label: 'Dados Pessoais', icon: FaUser },
        { id: 'cartoes', label: 'Formas de Pagamento', icon: FaCreditCard },
        { id: 'enderecos', label: 'Meus Endereços', icon: FaMapMarkerAlt }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
                    <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e preferências</p>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando perfil...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar perfil</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Content */}
                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                                                activeTab === tab.id
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'perfil' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Profile Picture Section */}
                                        <div className="lg:w-1/3">
                                            <div className="text-center">
                                                <div className="relative inline-block">
                                                    {fotoPerfil ? (
                                                        <img
                                                            src={fotoPerfil}
                                                            alt="Foto de perfil"
                                                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                                                        />
                                                    ) : (
                                                        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <FaUserCircle className="w-20 h-20 text-blue-400" />
                                                        </div>
                                                    )}
                                                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                                                        <FaPen className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-4">
                                                    Clique no ícone para alterar sua foto
                                                </p>
                                            </div>
                                        </div>

                                        {/* Form Section */}
                                        <div className="lg:w-2/3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nome Completo
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={nome}
                                                        onChange={(e) => setNome(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        CPF
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cpf}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                                                        disabled
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">CPF não pode ser alterado</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        E-mail
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Telefone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={telefone}
                                                        onChange={(e) => setTelefone(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="(11) 99999-9999"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Data de Nascimento
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={dataNascimento}
                                                        onChange={(e) => setDataNascimento(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="DD/MM/AAAA"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            {houveMudancas && (
                                                <div className="mt-8 flex justify-end">
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isSaving}
                                                        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Salvando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCheck />
                                                                Salvar Alterações
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cartoes' && <CartaoManager />}
                            {activeTab === 'enderecos' && <EnderecoManager />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
