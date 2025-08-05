import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaPlaneDeparture, FaArrowLeft } from "react-icons/fa";
import ToastContainer from "../components/ui/ToastContainer";
import useToast from "../hooks/useToast";

export default function ConfirmacaoEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("carregando");

  useEffect(() => {
    if (!token) {
      setStatus("erro");
      showError("Token não encontrado na URL.");
      return;
    }

    const confirmarEmail = async () => {
      try {
        const resposta = await fetch(`http://localhost:5295/api/auth/confirmar-email?token=${token}`);
        const dados = await resposta.json();

        if (resposta.ok || dados.mensagem === "E-mail já confirmado.") {
          setStatus("sucesso");
          showSuccess(dados.mensagem, 0);

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("erro");
          showError(dados.mensagem || "Erro ao confirmar o e-mail.");
        }
      } catch (erro) {
        setStatus("erro");
        showError("Erro na conexão com o servidor.");
      }
    };

    confirmarEmail();
  }, [token, navigate, showSuccess, showError]);

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

      {/* Botão Voltar no topo */}
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
        <div className="bg-blue-500/75 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-blue-400/50 drop-shadow-lg text-center">
          {/* Logo centralizada (apenas uma, igual login) */}
          <div className="text-center mb-8">
            <img src={logo} alt="logo" className="mx-auto mb-5 h-15 w-auto" />
            <p className="text-white/90 mt-2 font-medium text-base">Confirmação de E-mail</p>
          </div>

          {/* Status: carregando */}
          {status === "carregando" && (
            <p className="text-blue-50 text-lg font-medium animate-pulse">
              Confirmando seu e-mail...
            </p>
          )}

          {/* Status: sucesso */}
          {status === "sucesso" && (
            <>
              <svg
                className="mx-auto mb-6 w-20 h-20 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">
                {mensagem || "E-mail confirmado com sucesso!"}
              </h2>
              <p className="text-white/90 mb-6">
                Você será redirecionado para o login em instantes...
              </p>
            </>
          )}

          {/* Status: erro */}
          {status === "erro" && (
            <>
              <svg
                className="mx-auto mb-6 w-20 h-20 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">
                {mensagem || "Erro ao confirmar e-mail"}
              </h2>
              <p className="text-white/90 mb-6">
                Solicite um novo link de confirmação para continuar.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
