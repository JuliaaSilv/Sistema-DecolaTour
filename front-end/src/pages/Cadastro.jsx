import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fazerCadastro } from "../api/auth";
import { FaArrowLeft } from 'react-icons/fa';
import ToastContainer from "../components/ui/ToastContainer";
import useToast from "../hooks/useToast";

export default function Cadastro() {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  // Estados simples para os campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Funções para formatar CPF e telefone
  const formatarCpf = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatarTelefone = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleCpfChange = (e) => {
    const valorFormatado = formatarCpf(e.target.value);
    setCpf(valorFormatado);
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  // Função para enviar o formulário
  const enviarFormulario = async (e) => {
    e.preventDefault(); // Impede o reload da página
    setCarregando(true); // Mostra loading

    // Validações simples
    if (!nome) {
      showError('Nome é obrigatório');
      setCarregando(false);
      return;
    }
    if (!email) {
      showError('Email é obrigatório');
      setCarregando(false);
      return;
    }
    if (!cpf) {
      showError('CPF é obrigatório');
      setCarregando(false);
      return;
    }
    if (!telefone) {
      showError('Telefone é obrigatório');
      setCarregando(false);
      return;
    }
    if (!dataNascimento) {
      showError('Data de nascimento é obrigatória');
      setCarregando(false);
      return;
    }
    if (!senha) {
      showError('Senha é obrigatória');
      setCarregando(false);
      return;
    }
    if (senha.length < 6) {
      showError('Senha deve ter no mínimo 6 caracteres');
      setCarregando(false);
      return;
    }
    if (senha !== confirmarSenha) {
      showError('Senhas não conferem');
      setCarregando(false);
      return;
    }

    // Chama a API
    const resultado = await fazerCadastro(nome, email, senha, cpf, telefone, dataNascimento);

    if (resultado.sucesso) {

      // Mostra mensagem de sucesso
      showSuccess('Cadastro realizado com sucesso!');

      // Aguarda um pouco para mostrar a mensagem antes de navegar
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } else {
      // Deu erro, mostra toast de erro
      showError(resultado.erro);
    }
    
    setCarregando(false);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <section className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 flex items-center justify-center p-4">
      
      {/* Botão Voltar */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-all duration-200 cursor-pointer shadow-lg border border-white/20"
        >
          <FaArrowLeft size={16} />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      <div className="w-full max-w-2xl">

        {/* Container do Formulário */}
        <div className="bg-blue-500/75 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-blue-400/50 drop-shadow-lg">
            
            {/* Logo */}
            <div className="text-center mb-8">
              <img 
                src={logo} 
                alt="Decola Tour" 
                className="mx-auto h-16 w-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
              <p className="text-blue-100 font-medium">Junte-se à nossa comunidade de viajantes</p>
            </div>

            {/* Formulário */}
            <form onSubmit={enviarFormulario} className="space-y-6">
              {/* Grid de Campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* CPF */}
                <div>
                  <input
                    type="text"
                    placeholder="CPF: 123.456.789-01"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength="14"
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* Telefone */}
                <div>
                  <input
                    type="text"
                    placeholder="Telefone: (11) 99999-9999"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    maxLength="15"
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <input
                    type="date"
                    placeholder="Data de Nascimento"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* Senha */}
                <div>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>

                {/* Confirmar Senha */}
                <div>
                  <input
                    type="password"
                    placeholder="Repita sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-blue-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg cursor-pointer"
              >
                {carregando ? 'Criando conta...' : 'Criar Conta'}
              </button>

              {/* Link para Login */}
              <p className="text-center text-sm text-white/90 font-medium">
                Já tem uma conta?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-orange-300 hover:text-orange-200 underline transition-colors duration-200 cursor-pointer"
                >
                  Faça login!
                </button>
              </p>

            </form>
        </div>
      </div>
    </section>
    </>
  );
}
