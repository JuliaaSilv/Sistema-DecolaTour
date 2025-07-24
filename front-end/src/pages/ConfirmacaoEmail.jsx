import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ConfirmacaoEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("carregando");

  useEffect(() => {
    if (!token) {
      setStatus("erro");
      setMensagem("Token não encontrado na URL.");
      return;
    }

    const confirmarEmail = async () => {
      try {
        const resposta = await fetch(`http://localhost:5295/api/auth/confirmar-email?token=${token}`);
        const dados = await resposta.json();

        console.log("Resposta do servidor:", dados);

        if (resposta.ok || dados.mensagem === "E-mail já confirmado.") {
          setStatus("sucesso");
          setMensagem(dados.mensagem);

          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setStatus("erro");
          setMensagem(dados.mensagem || "Erro ao confirmar o e-mail.");
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
        setStatus("erro");
        setMensagem("Erro na conexão com o servidor.");
      }
    };

    confirmarEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <h1
          className="text-4xl font-extrabold mb-2"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#1E3A8A' }} 
        >
          Decola Tour
        </h1>
        <p className="text-gray-500 mb-6 text-sm">Confirmação de E-mail</p>

        {status === "carregando" && (
          <p className="text-blue-600 text-lg font-medium animate-pulse">
            Confirmando seu e-mail...
          </p>
        )}

        {status === "sucesso" && (
          <>
            <svg
              className="mx-auto mb-6 w-20 h-20 text-green-500"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mensagem || "E-mail confirmado com sucesso!"}
            </h2>
            <p className="text-gray-600 mb-6">
              Você será redirecionado para o login em instantes...
            </p>
          </>
        )}

        {status === "erro" && (
          <>
            <svg
              className="mx-auto mb-6 w-20 h-20 text-red-500"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mensagem || "Erro ao confirmar e-mail"}
            </h2>
            <p className="text-gray-600 mb-6">
              Solicite um novo link de confirmação para continuar.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-700 font-semibold hover:underline focus:outline-none"
            >
              Voltar para a página inicial
            </button>
          </>
        )}
      </div>
    </div>
  );
}
