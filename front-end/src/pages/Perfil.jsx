import { useState, useEffect } from "react";
import { FaPen, FaUserCircle, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const [nome, setNome] = useState("Seu Nome");
    const [telefone, setTelefone] = useState("(11) 99999-9999");
    const [email, setEmail] = useState("Seu Email");
    const [dataNascimento, setDataNascimento] = useState("01/01/1990");
    const [endereco, setEndereco] = useState("Seu Endereço");
    const [cpf] = useState("123.456.789-10"); // CPF sem possibilidade de edição
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Hook para detectar mudanças no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Valores originais para comparação
    const [nomeOriginal] = useState("Seu Nome");
    const [telefoneOriginal] = useState("(11) 99999-9999");
    const [emailOriginal] = useState("Seu Email");
    const [dataNascimentoOriginal] = useState("01/01/1990");
    const [enderecoOriginal] = useState("Seu Endereço");

    const [editandoNome, setEditandoNome] = useState(false);
    const [editandoTelefone, setEditandoTelefone] = useState(false);
    const [editandoEmail, setEditandoEmail] = useState(false);
    const [editandoDataNascimento, setEditandoDataNascimento] = useState(false);
    const [editandoEndereco, setEditandoEndereco] = useState(false);

    const [novoNome, setNovoNome] = useState(nome);
    const [novoTelefone, setNovoTelefone] = useState(telefone);
    const [novoEmail, setNovoEmail] = useState(email);
    const [novaDataNascimento, setNovaDataNascimento] = useState(dataNascimento);
    const [novoEndereco, setNovoEndereco] = useState(endereco);

    const navigate = useNavigate();

    // Verifica se houve alterações nos valores finais ou se está editando com valores diferentes
    const houveMudancas = nome !== nomeOriginal || 
                         telefone !== telefoneOriginal || 
                         email !== emailOriginal ||
                         dataNascimento !== dataNascimentoOriginal ||
                         endereco !== enderecoOriginal ||
                         fotoPerfil !== null ||
                         (editandoNome && novoNome !== nome) ||
                         (editandoTelefone && novoTelefone !== telefone) ||
                         (editandoEmail && novoEmail !== email) ||
                         (editandoDataNascimento && novaDataNascimento !== dataNascimento) ||
                         (editandoEndereco && novoEndereco !== endereco);

    return (
        <section style={{
            width: "100%",
            minHeight: "100vh",
            background: "#f8f9fa",
            padding: windowWidth <= 768 ? "20px 10px" : "40px 20px"
        }}>
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
        </section>
    );
}