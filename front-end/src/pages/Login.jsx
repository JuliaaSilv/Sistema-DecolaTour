import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fazerLogin, obterTipoUsuario } from "../api/auth";
import { FaArrowLeft } from 'react-icons/fa';
import ToastContainer from "../components/ui/ToastContainer";
import useToast from "../hooks/useToast";

export default function Login() {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  // Estados simples para os campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Função para enviar o formulário
  const enviarFormulario = async (e) => {
    e.preventDefault(); // Impede o reload da página
    setCarregando(true); // Mostra loading

    // Validações simples
    if (!email) {
      showError('Email é obrigatório');
      setCarregando(false);
      return;
    }
    if (!senha) {
      showError('Senha é obrigatória');
      setCarregando(false);
      return;
    }

    // Chama a API
    const resultado = await fazerLogin(email, senha);

    if (resultado.sucesso) {

      // Mostra mensagem de sucesso
      showSuccess('Login realizado com sucesso!');
      
      // Verifica se há uma URL de redirecionamento salva
      const redirectUrl = localStorage.getItem('redirectAfterLogin');

      
      // Aguarda um pouco para mostrar a mensagem antes de navegar
      setTimeout(() => {
        // Verifica o tipo de usuário após login bem-sucedido
        const userRole = obterTipoUsuario();
        
        // Verifica se há uma URL de redirecionamento salva
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        if (redirectUrl) {
          // Remove a URL de redirecionamento do localStorage
          localStorage.removeItem('redirectAfterLogin');
          console.log('🔄 Redirecionando para:', redirectUrl);
          // Redireciona para a URL salva
          navigate(redirectUrl);
        } else if (userRole === "1" || userRole === "2") {
          // Se for administrador (1) ou atendente (2), redireciona para admin
          console.log('🔄 Administrador detectado, redirecionando para admin');
          navigate('/admin');
        } else {
          // Redireciona para home se não há URL salva e não é admin
          navigate('/home');
        }
      }, 1200); // Reduzido de 2000ms para 1200ms para redirecionamento mais rápido
    } else {
      // Deu erro, mostra toast de erro
      showError(resultado.erro);
    }
    
    setCarregando(false);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <section className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 relative overflow-hidden flex items-center justify-center px-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/3 w-36 h-36 bg-sky-200 rounded-full blur-2xl"></div>
      </div>
      
      {/* Botão Voltar */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-all duration-200 cursor-pointer shadow-lg border border-white/20"
        >
          <FaArrowLeft size={16} />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-blue-500/75 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-blue-400/50 drop-shadow-lg">
          <form onSubmit={enviarFormulario} className="space-y-6">
            
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logo} alt="logo" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Bem-vindo de volta!</h2>
              <p className="text-white/90 mt-2 font-medium">Entre na sua conta para continuar</p>
            </div>

            {/* Campo Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg placeholder-white/90 placeholder:font-medium text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
                required
              />
            </div>

            {/* Campo Senha */}
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg placeholder-white/90 placeholder:font-medium text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
                required
              />
            </div>

            {/* Lembrar de mim */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-white/20 focus:ring-white/50" />
                <label className="ml-2 text-sm text-white/90 font-medium">
                  Manter conectado
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="text-white/90 hover:text-white underline font-medium cursor-pointer"
                  onClick={() => navigate('/recuperar-senha')}
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <div>
              <button
                type="submit"
                disabled={carregando}
                className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-200 cursor-pointer ${
                  carregando 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            {/* Link para Cadastro */}
            <p className="text-center text-sm text-white/90 font-medium">
              Não tem uma conta?{' '}
              <button 
                type="button"
                onClick={() => navigate('/cadastro')}
                className="font-bold text-orange-300 hover:text-orange-200 underline transition-colors duration-200 cursor-pointer"
              >
                Crie agora!
              </button>
            </p>

            </form>
        </div>
      </div>
    </section>
    </>
  );
}
