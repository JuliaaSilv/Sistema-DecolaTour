import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const dicas = [
  "Dica do dia: Sempre leve protetor solar em viagens para praias.",
  "Dica do dia: Conheça a culinária local para uma experiência autêntica.",
  "Dica do dia: Verifique o clima antes de viajar para evitar surpresas.",
  "Dica do dia: Use sapatos confortáveis para explorar cidades históricas.",
];

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Eu sou a TurIA. Como posso te ajudar hoje?" },
    {
      sender: "botSuggestions",
      suggestions: [
        "Quais são os pacotes disponíveis?",
        "Qual é a melhor época para viajar para o nordeste?",
        "Quais as praias mais populares no Brasil?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [dicaDoDia, setDicaDoDia] = useState("");

  type Pacote = {
    id: number;
    destino: string;
    imagemUrl: string;
    valorTotal?: number;
    titulo: string;
    Categorias?: string[];
  };



  const GEMINI_API_KEY = "AIzaSyA8j4dMHgq2WGXXvs1OTbqNbC6ElAXtq2o";

  useEffect(() => {
    if (isOpen) {
      const dica = dicas[Math.floor(Math.random() * dicas.length)];
      setDicaDoDia(dica);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

const handleSend = async (userText: string) => {
  const userMessage = { sender: "user", text: userText };
  setMessages((prev) =>
    prev.filter((msg) => msg.sender !== "botSuggestions").concat(userMessage)
  );
  setInput(""); 
  setIsTyping(true);

  try {
    const categoriasPossiveis = [
      "praia", "aventura", "cultura", "gastronomia", "natureza",
      "romântico", "familiar", "história", "cidade", "lazer",
      "nordeste", "sul", "serra", "internacional", "ecoturismo"
    ];

    const categoriasDetectadas = categoriasPossiveis.filter((categoria) =>
      userText.toLowerCase().includes(categoria)
    );

    let pacotesTexto = "";
    let pacotes: Pacote[] = [];

    if (categoriasDetectadas.length > 0) {
      const response = await axios.post("http://localhost:5295/api/pacote/buscar", {
        Categorias: categoriasDetectadas,
        origem: "",
        destino: "",
        dataIda: null,
        dataVolta: null,
        valorTotal: ""
      });

      pacotes = response.data || [];

      pacotesTexto =
        pacotes.length > 0
          ? `Você mencionou: ${categoriasDetectadas.join(", ")}. Veja alguns pacotes que combinam:\n\n` +
            pacotes
              .slice(0, 5)
              .map(
                (p) =>
                  `✈️ ${p.titulo}\n📍 ${p.destino}\n💰 R$ ${p.valorTotal?.toFixed(2) || "N/A"}`
              )
              .join("\n\n")
          : `Você mencionou: ${categoriasDetectadas.join(", ")}, mas nenhum pacote foi encontrado com essas preferências.`;
    }

    const promptParts = [
      {
        text: `Você é TurIA, a assistente virtual da agência de viagens Decola Tour, especializada em turismo, seja gentil, educada, e não use * nas mensagens...
${pacotesTexto ? "\n\n" + pacotesTexto : ""}\n\nHistórico da conversa:\n`
      },
      ...messages.map((msg) => ({
        text: `${msg.sender === "user" ? "Usuário" : "TurIA"}: ${msg.text}`
      })),
      { text: `Usuário: ${userText}` },
      { text: "TurIA:" },
    ];

    const responseIA = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: promptParts }],
      },
      {
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const candidate = responseIA.data.candidates?.[0];
    const botText = candidate?.content?.parts?.[0]?.text || "Desculpe, não entendi.";

    setMessages((prev) => [...prev, { sender: "bot", text: botText.trim() }]);
  } catch (error) {
    console.error("Erro:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Erro ao se comunicar com o servidor." },
    ]);
  }

  setIsTyping(false);
};

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 ${isOpen ? "w-96 h-[520px]" : "w-14 h-14"} transition-all duration-300 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg flex flex-col overflow-hidden`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-blue-400 text-white text-2xl w-full h-full flex items-center justify-center rounded-full shadow-md hover:scale-105 transition"
        >
          TurIA
        </button>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3 flex justify-between items-center rounded-t-2xl shadow-md">
            <span className="font-bold text-lg select-none">TurIA</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold"
            >
              ×
            </button>
          </div>

          {dicaDoDia && (
            <div className="bg-yellow-100 text-yellow-900 px-4 py-2 text-sm font-medium border-b border-yellow-300">
              {dicaDoDia}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
            {messages.map((msg, idx) =>
              msg.sender === "botSuggestions" ? (
                <div key={idx} className="bg-blue-100 text-blue-900 p-3 rounded-lg space-y-2">
                  <div className="font-semibold">Sugestões:</div>
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestions?.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(suggestion)}
                        className="bg-blue-200 hover:bg-blue-300 text-sm px-3 py-1 rounded-md transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className={`max-w-[80%] p-2 rounded-lg whitespace-pre-wrap break-words relative ${
                    msg.sender === "bot"
                      ? "bg-blue-100 text-blue-900 self-start animate-fadeIn shadow"
                      : "bg-orange-100 text-orange-800 self-end ml-auto"
                  }`}
                  style={{ animationDuration: msg.sender === "bot" ? "0.5s" : undefined }}
                >
                  {msg.text}
                </div>
              )
            )}

            {isTyping && <div className="text-sm text-gray-500 italic">Digitando...</div>}
            <div ref={messagesEndRef} />

 
                      
          
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-orange-400 to-orange-300 text-white px-4 py-2 rounded-md shadow-md hover:from-orange-500 hover:to-orange-400 transition"
            >
              ➤
            </button>
          </form>
        </>
      )}
      <style>
        {`
          @keyframes fadeIn {
            0% {opacity: 0; transform: translateY(10px);}
            100% {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation-name: fadeIn;
            animation-fill-mode: forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ChatbotPopup;
