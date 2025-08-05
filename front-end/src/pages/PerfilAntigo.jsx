import { useState, useEffect } from "react";
import { FaPen, FaUserCircle, FaCheck, FaUser, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUserProfile, updateCurrentUserProfile } from "../api/users";
import useToast from "../hooks/useToast";
import ToastContainer from "../components/ui/ToastContainer";
import CartaoManager from "../components/CartaoManager";
import EnderecoManager from "../components/EnderecoManager";

export default function Perfil() {
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState('perfil');
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState(""); // CPF carregado do backend
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Hook para detectar mudanças no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            showSuccess('Perfil atualizado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setError(error.message);
            showError('Erro ao atualizar perfil: ' + error.message);
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

    // Valores originais para comparação (agora baseados nos dados carregados)
    const [nomeOriginal, setNomeOriginal] = useState("");
    const [telefoneOriginal, setTelefoneOriginal] = useState("");
    const [emailOriginal, setEmailOriginal] = useState("");
    const [dataNascimentoOriginal, setDataNascimentoOriginal] = useState("");

    // Atualizar valores originais quando os dados são carregados
    useEffect(() => {
        if (!isLoading) {
            setNomeOriginal(nome);
            setTelefoneOriginal(telefone);
            setEmailOriginal(email);
            setDataNascimentoOriginal(dataNascimento);
        }
    }, [isLoading, nome, telefone, email, dataNascimento]);

    const navigate = useNavigate();

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
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <section style={{
                width: "100%",
                minHeight: "100vh",
                background: "#f8f9fa",
                padding: windowWidth <= 768 ? "20px 10px" : "40px 20px"
            }}>
            {/* Loading state */}
            {isLoading && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh"
                }}>
                    <div style={{
                        textAlign: "center",
                        color: "#666"
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            border: "4px solid #f3f3f3",
                            borderTop: "4px solid #3498db",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 20px"
                        }}></div>
                        <p>Carregando perfil...</p>
                    </div>
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "8px",
                    color: "#721c24",
                    textAlign: "center"
                }}>
                    <h3>Erro ao carregar perfil</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Content */}
            {!isLoading && !error && (
            <div style={{
                maxWidth: 1200,
                margin: "0 auto"
            }}>
                <div style={{ 
                    display: "flex", 
                    gap: windowWidth <= 768 ? 20 : 40, 
                    alignItems: "flex-start",
                    flexDirection: windowWidth <= 768 ? "column" : "row"
                }}>
                    {/* Seção da foto */}
                    <div style={{ 
                        minWidth: windowWidth <= 768 ? "100%" : 300, 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        marginBottom: windowWidth <= 768 ? 20 : 0
                    }}>
                        <div style={{ position: "relative", marginBottom: 20 }}>
                            {fotoPerfil ? (
                                <img
                                    src={fotoPerfil}
                                    alt="Foto de perfil"
                                    style={{
                                        width: windowWidth <= 768 ? 200 : 250,
                                        height: windowWidth <= 768 ? 240 : 300,
                                        borderRadius: 12,
                                        objectFit: "cover",
                                        border: "3px solid #90caf9"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: windowWidth <= 768 ? 200 : 250,
                                    height: windowWidth <= 768 ? 240 : 300,
                                    borderRadius: 12,
                                    background: "#f5f5f5",
                                    border: "3px solid #90caf9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column"
                                }}>
                                    <FaUserCircle size={windowWidth <= 768 ? 80 : 120} color="#90caf9" />
                                    <p style={{ 
                                        color: "#666", 
                                        marginTop: 10, 
                                        fontSize: windowWidth <= 768 ? 12 : 14,
                                        textAlign: "center"
                                    }}>
                                        Clique no ícone para<br />adicionar uma foto
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setFotoPerfil(event.target.result);
                                        };
                                        reader.readAsDataURL(file);
                                        console.log("Arquivo selecionado:", file);
                                    }
                                }}
                            />
                            <button
                                onClick={() => document.getElementById('fileInput').click()}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    bottom: 10,
                                    background: "#90caf9",
                                    border: "none",
                                    borderRadius: "50%",
                                    padding: 12,
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                                }}
                                title="Editar foto"
                            >
                                <FaPen color="#fff" size={18} />
                            </button>
                        </div>
                        
                        {/* Opções da foto */}
                        {fotoPerfil && (
                            <div style={{ 
                                display: "flex", 
                                gap: 10, 
                                marginTop: 10,
                                flexDirection: windowWidth <= 480 ? "column" : "row",
                                width: windowWidth <= 480 ? "100%" : "auto"
                            }}>
                                <button
                                    onClick={() => document.getElementById('fileInput').click()}
                                    style={{
                                        background: "#90caf9",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 16px",
                                        color: "#fff",
                                        fontSize: 14,
                                        cursor: "pointer",
                                        width: windowWidth <= 480 ? "100%" : "auto"
                                    }}
                                >
                                    Trocar Foto
                                </button>
                                <button
                                    onClick={() => setFotoPerfil(null)}
                                    style={{
                                        background: "#dc3545",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 16px",
                                        color: "#fff",
                                        fontSize: 14,
                                        cursor: "pointer",
                                        width: windowWidth <= 480 ? "100%" : "auto"
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Seção dos campos */}
                    <div style={{ 
                        flex: 1,
                        width: windowWidth <= 768 ? "100%" : "auto",
                        maxWidth: windowWidth <= 768 ? "100%" : "none"
                    }}>
                        <form style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: 24,
                            width: "100%"
                        }}>
                            {/* Nome */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
                                gap: 8,
                                width: "100%"
                            }}>
                                <label style={{ 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    Nome:
                                    {editandoNome ? (
                                        <input
                                            type="text"
                                            value={novoNome}
                                            onChange={e => setNovoNome(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                borderRadius: 8,
                                                border: "1px solid #90caf9",
                                                marginTop: 4,
                                                outline: "none",
                                                transition: "border-color 0.3s ease",
                                                fontSize: 16
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#ff7722"}
                                            onBlur={(e) => e.target.style.borderColor = "#90caf9"}
                                        />
                                    ) : (
                                        <div style={{
                                            background: "#f5f5f5",
                                            borderRadius: 8,
                                            padding: "10px 16px",
                                            marginTop: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: 16
                                        }}>{nome}</div>
                                    )}
                                </label>
                                <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
                                    {editandoNome ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNome(novoNome);
                                                setEditandoNome(false);
                                            }}
                                            style={{
                                                background: "#ff7722",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Confirmar"
                                        >
                                            <FaCheck color="#fff" size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNovoNome(nome);
                                                setEditandoNome(true);
                                            }}
                                            style={{
                                                background: "#90caf9",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Editar nome"
                                        >
                                            <FaPen color="#fff" size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* CPF (sem edição) */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
                                gap: 8,
                                width: "100%"
                            }}>
                                <label style={{ 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    CPF:
                                    <div style={{
                                        background: "#e9ecef",
                                        borderRadius: 8,
                                        padding: "10px 16px",
                                        marginTop: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: 16,
                                        color: "#6c757d"
                                    }}>{cpf}</div>
                                </label>
                                <div style={{ marginTop: 20, display: "flex", alignItems: "center", width: 36 }}>
                                    {/* Espaço vazio para manter alinhamento */}
                                </div>
                            </div>

                            {/* Linha com Data de Nascimento e Telefone */}
                            <div style={{ 
                                display: "flex", 
                                gap: 20,
                                flexDirection: windowWidth <= 768 ? "column" : "row"
                            }}>
                                {/* Data de Nascimento */}
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "flex-start", 
                                    gap: 8, 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    <label style={{ 
                                        flex: 1,
                                        width: "100%"
                                    }}>
                                        Data de Nascimento:
                                        {editandoDataNascimento ? (
                                            <input
                                                type="date"
                                                value={novaDataNascimento}
                                                onChange={e => setNovaDataNascimento(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 16px",
                                                    borderRadius: 8,
                                                    border: "1px solid #90caf9",
                                                    marginTop: 4,
                                                    outline: "none",
                                                    transition: "border-color 0.3s ease",
                                                    fontSize: 16
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = "#ff7722"}
                                                onBlur={(e) => e.target.style.borderColor = "#90caf9"}
                                            />
                                        ) : (
                                            <div style={{
                                                background: "#f5f5f5",
                                                borderRadius: 8,
                                                padding: "10px 16px",
                                                marginTop: 4,
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: 16
                                            }}>{dataNascimento}</div>
                                        )}
                                    </label>
                                    <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
                                        {editandoDataNascimento ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDataNascimento(novaDataNascimento);
                                                    setEditandoDataNascimento(false);
                                                }}
                                                style={{
                                                    background: "#ff7722",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    padding: 8,
                                                    cursor: "pointer",
                                                    width: 36,
                                                    height: 36,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                title="Confirmar"
                                            >
                                                <FaCheck color="#fff" size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNovaDataNascimento(dataNascimento);
                                                    setEditandoDataNascimento(true);
                                                }}
                                                style={{
                                                    background: "#90caf9",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    padding: 8,
                                                    cursor: "pointer",
                                                    width: 36,
                                                    height: 36,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                title="Editar data"
                                            >
                                                <FaPen color="#fff" size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Telefone */}
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "flex-start", 
                                    gap: 8, 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    <label style={{ 
                                        flex: 1,
                                        width: "100%"
                                    }}>
                                        Telefone:
                                        {editandoTelefone ? (
                                            <input
                                                type="text"
                                                value={novoTelefone}
                                                onChange={e => setNovoTelefone(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 16px",
                                                    borderRadius: 8,
                                                    border: "1px solid #90caf9",
                                                    marginTop: 4,
                                                    outline: "none",
                                                    transition: "border-color 0.3s ease",
                                                    fontSize: 16
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = "#ff7722"}
                                                onBlur={(e) => e.target.style.borderColor = "#90caf9"}
                                            />
                                        ) : (
                                            <div style={{
                                                background: "#f5f5f5",
                                                borderRadius: 8,
                                                padding: "10px 16px",
                                                marginTop: 4,
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: 16
                                            }}>{telefone}</div>
                                        )}
                                    </label>
                                    <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
                                        {editandoTelefone ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTelefone(novoTelefone);
                                                    setEditandoTelefone(false);
                                                }}
                                                style={{
                                                    background: "#ff7722",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    padding: 8,
                                                    cursor: "pointer",
                                                    width: 36,
                                                    height: 36,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                title="Confirmar"
                                            >
                                                <FaCheck color="#fff" size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNovoTelefone(telefone);
                                                    setEditandoTelefone(true);
                                                }}
                                                style={{
                                                    background: "#90caf9",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    padding: 8,
                                                    cursor: "pointer",
                                                    width: 36,
                                                    height: 36,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                title="Editar telefone"
                                            >
                                                <FaPen color="#fff" size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Email */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
                                gap: 8,
                                width: "100%"
                            }}>
                                <label style={{ 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    Email:
                                    {editandoEmail ? (
                                        <input
                                            type="email"
                                            value={novoEmail}
                                            onChange={e => setNovoEmail(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                borderRadius: 8,
                                                border: "1px solid #90caf9",
                                                marginTop: 4,
                                                outline: "none",
                                                transition: "border-color 0.3s ease",
                                                fontSize: 16
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#ff7722"}
                                            onBlur={(e) => e.target.style.borderColor = "#90caf9"}
                                        />
                                    ) : (
                                        <div style={{
                                            background: "#f5f5f5",
                                            borderRadius: 8,
                                            padding: "10px 16px",
                                            marginTop: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: 16
                                        }}>{email}</div>
                                    )}
                                </label>
                                <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
                                    {editandoEmail ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEmail(novoEmail);
                                                setEditandoEmail(false);
                                            }}
                                            style={{
                                                background: "#ff7722",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Confirmar"
                                        >
                                            <FaCheck color="#fff" size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNovoEmail(email);
                                                setEditandoEmail(true);
                                            }}
                                            style={{
                                                background: "#90caf9",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Editar email"
                                        >
                                            <FaPen color="#fff" size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Endereço */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
                                gap: 8,
                                width: "100%"
                            }}>
                                <label style={{ 
                                    flex: 1,
                                    width: "100%"
                                }}>
                                    Endereço:
                                    {editandoEndereco ? (
                                        <input
                                            type="text"
                                            value={novoEndereco}
                                            onChange={e => setNovoEndereco(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                borderRadius: 8,
                                                border: "1px solid #90caf9",
                                                marginTop: 4,
                                                outline: "none",
                                                transition: "border-color 0.3s ease",
                                                fontSize: 16
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#ff7722"}
                                            onBlur={(e) => e.target.style.borderColor = "#90caf9"}
                                        />
                                    ) : (
                                        <div style={{
                                            background: "#f5f5f5",
                                            borderRadius: 8,
                                            padding: "10px 16px",
                                            marginTop: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: 16
                                        }}>{endereco}</div>
                                    )}
                                </label>
                                <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
                                    {editandoEndereco ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEndereco(novoEndereco);
                                                setEditandoEndereco(false);
                                            }}
                                            style={{
                                                background: "#ff7722",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Confirmar"
                                        >
                                            <FaCheck color="#fff" size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNovoEndereco(endereco);
                                                setEditandoEndereco(true);
                                            }}
                                            style={{
                                                background: "#90caf9",
                                                border: "none",
                                                borderRadius: "50%",
                                                padding: 8,
                                                cursor: "pointer",
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            title="Editar endereço"
                                        >
                                            <FaPen color="#fff" size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                        
                        {houveMudancas && (
                            <button
                                onClick={() => {
                                    // Lógica para confirmar as modificações do perfil
                                    console.log("Modificações confirmadas");
                                    // Aqui você pode adicionar a lógica para salvar os dados
                                }}
                                style={{
                                    marginTop: 32,
                                    background: "#ff7722",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "14px 24px",
                                    color: "#fff",
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    width: "100%",
                                    textAlign: "center"
                                }}
                            >
                                Confirmar modificação
                            </button>
                        )}
                    </div>
                </div>
            </div>
            )}
            <ToastContainer />
        </section>
        </>
    );
}