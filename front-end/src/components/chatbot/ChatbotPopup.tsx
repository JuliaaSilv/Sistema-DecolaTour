import React, { useState } from "react";
import axios from "axios";

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Eu sou a AVA, sua assistente de viagens da Decola Tour ✈️. Como posso te ajudar hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const GEMINI_API_KEY = "AIzaSyA8j4dMHgq2WGXXvs1OTbqNbC6ElAXtq2o";

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: `
              Você é AVA, a assistente virtual da agência de viagens Decola Tour. Seu objetivo é ajudar o usuário a:

              - Descobrir destinos turísticos no Brasil e no mundo.
              - Sugerir roteiros de viagem personalizados com base nos interesses do usuário (natureza, praias, cidades históricas, gastronomia etc).
              - Falar sobre pacotes e experiências que a Decola Tour oferece.
              - Encaminhar para um agente humano, se necessário.

              Se o usuário fizer perguntas fora do tema de turismo e viagens, responda educadamente que seu foco é turismo.
              REGRAS:
              1. NUNCA diga que é uma IA ou chatbot.
              2. NÃO use asteriscos ou formatações como texto em negrito.
              3. NÃO envie mensagens muito longas. Seja objetiva e simpática.
              4. NÃO sugira pacotes diretamente. Se perguntarem, diga:
                "Temos várias opções incríveis! Vou te encaminhar para um atendente que pode te ajudar melhor com isso."
              5. Você pode sugerir destinos, dar dicas de viagem, clima, época ideal, atrações e montar ideias de roteiro.

              Responda sempre com simpatia, em português e em tom amigável.
`.trim(),
                },
                {
                  text: input,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": GEMINI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const candidate = response.data.candidates?.[0];
      const botText = candidate?.content?.parts?.[0]?.text;

      const botReply = {
        sender: "bot",
        text: botText || "Desculpe, não consegui entender sua pergunta 😕",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const botError = {
        sender: "bot",
        text: "Desculpe, ocorreu um erro ao buscar sua resposta. Tente novamente mais tarde.",
      };
      setMessages((prev) => [...prev, botError]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-96 h-[520px] bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-xl" : ""
      }`}
      onClick={() => !isOpen && setIsOpen(true)}
      aria-label="Chatbot AVA"
      role="region"
    >
      {!isOpen ? (
        
        <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-xl cursor-pointer">
          AVA
        </div>
      ) : (
        <>
          {/* CABEÇALHO */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-400 rounded-t-2xl">
            <h2 className="text-white font-bold text-lg select-none">AVA</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl material-symbols-rounded select-none"
              aria-label="Fechar chatbot"
              type="button"
            >
              expand_more
            </button>
          </div>

          {/* CORPO DA CONVERSA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm whitespace-pre-line break-words ${
                  msg.sender === "bot"
                    ? "bg-blue-50 text-blue-900 self-start border border-blue-200"
                    : "bg-orange-50 text-orange-900 self-end border border-orange-300"
                }`}
                style={{ fontSize: "0.95rem", lineHeight: "1.4" }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div
                className="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-blue-50 text-blue-900 self-start italic border border-blue-200"
                style={{ fontSize: "0.9rem" }}
              >
                Digitando...
              </div>
            )}
          </div>

          {/* INPUT DE MENSAGEM */}
          <form
            onSubmit={handleFormSubmit}
            className="flex gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl"
          >
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              aria-label="Mensagem do usuário"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-300 rounded-lg text-white hover:from-orange-500 hover:to-orange-400 transition"
              aria-label="Enviar mensagem"
            >
              <span className="material-symbols-rounded">arrow_upward</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatbotPopup;
