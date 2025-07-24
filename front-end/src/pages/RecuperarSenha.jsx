import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from 'react-icons/fa';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarRecuperacao = async (e) => {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:5295/api/auth/solicitar-recuperacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email), // envia string pura no body
      });

      const texto = await response.text();
      setMensagem(texto);
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
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
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-all duration-200 cursor-pointer shadow-lg border border-white/20"
        >
          <FaArrowLeft size={16} />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-blue-500/75 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-blue-400/50 drop-shadow-lg">
          <form onSubmit={enviarRecuperacao} className="space-y-6">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logo} alt="logo" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Esqueceu a senha?</h2>
              <p className="text-white/90 mt-2 font-medium">
                Informe seu email para receber instruções de recuperação.
              </p>
            </div>

            {/* Mensagem de feedback */}
            {mensagem && (
              <div className="p-4 bg-green-500/30 border border-green-400/60 text-white rounded-lg backdrop-blur-sm">
                <span className="font-semibold">{mensagem}</span>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/25 backdrop-blur-sm border border-white/40 rounded-lg placeholder-white/90 placeholder:font-medium text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
                required
              />
            </div>

            {/* Botão Recuperar Senha */}
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
                {carregando ? 'Enviando...' : 'Recuperar senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
