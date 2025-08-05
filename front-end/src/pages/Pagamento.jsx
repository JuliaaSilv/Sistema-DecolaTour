import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obterIdUsuario } from "../api/auth";
import { getAuthHeaders } from "../api/reservas";
import { fetchCartoes } from "../api/cartoes";
import { 
  processarPagamento, 
  criarReserva, 
  converterFormaPagamento,
  formatarDadosCartao,
  formatarDadosPix,
  formatarDadosBoleto,
  monitorarStatusPagamento,
  verificarViajantesReserva
} from "../api/payment";
import { 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  User,
  Calendar,
  Lock,
  DollarSign,
  Smartphone,
  Building2,
  Receipt,
  Check,
  Coins,
  Shield
} from "lucide-react";
import qrCodePix from "../assets/qrcodepix.png";
import boletoFake from "../assets/boletofake.png";

// Estilos CSS customizados para o efeito 3D
const customStyles = {
  perspective: {
    perspective: '1000px'
  }
};

// Componente de ícone personalizado para dois cartões sobrepostos
const DoubleCardIcon = ({ size = 16, className = "" }) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <CreditCard 
      size={size * 0.8} 
      className="absolute top-0 left-0 text-[#F28C38] opacity-60" 
    />
    <CreditCard 
      size={size * 0.8} 
      className="absolute top-1 left-1 text-[#F28C38]" 
    />
  </div>
);

function getCardFlag(number) {
  if (!number) return null;
  const cleanNumber = number.replace(/\s/g, "");
  const first = cleanNumber[0];
  const firstTwo = cleanNumber.substring(0, 2);
  
  if (first === "4") return "visa";
  if (first === "5" || (firstTwo >= "51" && firstTwo <= "55")) return "mastercard";
  if (first === "3" && (cleanNumber[1] === "4" || cleanNumber[1] === "7")) return "amex";
  return null;
}

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { travelerData, pacote } = location.state || {};
  
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [selected, setSelected] = useState("credito");
  const [parcelas, setParcelas] = useState(1);
  
  // Estados para cartões salvos
  const [cartoesSalvos, setCartoesSalvos] = useState([]);
  const [usarCartaoSalvo, setUsarCartaoSalvo] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState('');
  
  // Estados para controle do pagamento
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [reservaId, setReservaId] = useState(null);
  const [pagamentoId, setPagamentoId] = useState(null);
  const [statusPagamento, setStatusPagamento] = useState(null);
  const [erro, setErro] = useState(null);
  const [chavePix, setChavePix] = useState('');
  const [monitorandoStatus, setMonitorandoStatus] = useState(false);

  const flag = getCardFlag(card.number.replace(/\s/g, ""));

  // Carregar cartões salvos do usuário
  useEffect(() => {
    const carregarCartoes = async () => {
      try {
        const cartoes = await fetchCartoes();
        setCartoesSalvos(cartoes || []);
        
        // Se tem cartões cadastrados, definir como padrão usar cartão salvo
        if (cartoes && cartoes.length > 0) {
          setUsarCartaoSalvo(true);
          setCartaoSelecionado(cartoes[0].id.toString());
          preencherCartaoSalvo(cartoes[0]);
        }
      } catch (error) {
        console.log('Usuário não possui cartões cadastrados:', error.message);
      }
    };
    
    carregarCartoes();
  }, []);

  // Verificar se temos os dados necessários
  if (!travelerData || !pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados da reserva não encontrados</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#F28C38] text-white rounded-xl"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    const basePrice = (pacote?.preco || 0) * (travelerData?.numeroViajantes || 1);
    const installmentFee = parcelas > 1 ? basePrice * 0.02 : 0;
    return basePrice + installmentFee;
  };

  const calculateDiscount = () => {
    if (selected === 'pix') {
      return calculateTotal() * 0.05;
    }
    return 0;
  };

  const getFinalTotal = () => {
    const basePrice = parseFloat(pacote.preco);
    
    // Contar apenas os viajantes da seção "Dados dos Viajantes" 
    // (NÃO incluir os "Dados Pessoais" do usuário principal)
    let quantidadeViajantes = 0;
    
    if (travelerData.viajantes && travelerData.viajantes.length > 0) {
      // Contar apenas viajantes com nome preenchido
      quantidadeViajantes = travelerData.viajantes.filter(v => v.nome && v.nome.trim()).length;
    }
    
    // Se não conseguir pegar dos dados do formulário, usar numeroViajantes
    if (quantidadeViajantes === 0 && travelerData.numeroViajantes) {
      quantidadeViajantes = parseInt(travelerData.numeroViajantes);
    }
    
    // Se ainda for 0, assumir 1 viajante como mínimo
    if (quantidadeViajantes === 0) {
      quantidadeViajantes = 1;
    }
    
    const valorTotal = basePrice * quantidadeViajantes;
    
    console.log(`Cálculo valor total: R$ ${basePrice} × ${quantidadeViajantes} viajantes = R$ ${valorTotal}`);
    
    return valorTotal;
  };

  const getOldTotal = () => {
    const total = calculateTotal() - calculateDiscount();
    return isNaN(total) ? 0 : total;
  };

  const getInstallmentValue = (installments) => {
    const baseTotal = getFinalTotal();
    const totalWithFee = installments > 1 ? baseTotal * 1.02 : baseTotal;
    const discount = selected === 'pix' ? totalWithFee * 0.05 : 0;
    const finalTotal = totalWithFee - discount;
    return finalTotal / installments;
  };

  const getPaymentButtonText = () => {
    const total = getFinalTotal();
    if (selected === 'credito' && parcelas > 1) {
      const installmentValue = getInstallmentValue(parcelas);
      return `R$ ${total.toLocaleString('pt-BR')} (${parcelas}x de R$ ${installmentValue.toLocaleString('pt-BR')})`;
    }
    return `R$ ${total.toLocaleString('pt-BR')}`;
  };

  // Validação dos campos de pagamento
  const isFormValid = () => {
    if (selected === 'credito' || selected === 'debito') {
      return (
        card.number.replace(/\s/g, '').length === 16 &&
        card.name.trim() !== '' &&
        card.expiry.length === 5 &&
        card.cvv.length === 3
      );
    }
    if (selected === 'pix') {
      return chavePix.trim() !== '';
    }
    return true;
  };

  // Função principal para processar pagamento
  const handleFinalizarCompra = async () => {
    if (!isFormValid()) {
      setErro('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setProcessandoPagamento(true);
    setErro(null);

    try {
      // Passo 1: Criar a reserva se ainda não foi criada
      let reservaIdFinal = reservaId;
      
      if (!reservaIdFinal) {
        console.log('Criando reserva...');
        
        // Criar lista de viajantes baseada APENAS nos "Dados dos Viajantes"
        // (NÃO incluir os "Dados Pessoais" do usuário principal)
        const viagantesReserva = [];
        
        // Adicionar apenas viajantes da seção "Dados dos Viajantes"
        if (travelerData.viajantes && travelerData.viajantes.length > 0) {
          travelerData.viajantes.forEach((viajante, index) => {
            if (viajante.nome && viajante.nome.trim()) { // Só adiciona se tiver nome
              viagantesReserva.push({
                nome: viajante.nome,
                documento: viajante.cpf || viajante.documento || `11111111${String(index + 1).padStart(3, '0')}`,
                passaporte: viajante.passaporte || `BR12345678${index + 1}`
              });
            }
          });
        }
        
        // Se não tiver nenhum viajante, criar um viajante genérico
        if (viagantesReserva.length === 0) {
          viagantesReserva.push({
            nome: 'Viajante 1',
            documento: '11111111111',
            passaporte: 'BR123456789'
          });
        }
        
        console.log(`Criando reserva com ${viagantesReserva.length} viajante(s) (apenas da seção Dados dos Viajantes)`);
        console.log('Viajantes da reserva:', viagantesReserva.map(v => v.nome));
        
        const dadosReserva = {
          pacoteId: pacote.id,
          usuarioId: obterIdUsuario(),
          valorUnitario: pacote.preco,
          dataViagem: travelerData.dataViagem, // Adicionar a data da viagem
          viajantes: viagantesReserva
        };

        const resultadoReserva = await criarReserva(dadosReserva);
        
        console.log('Resultado da criação da reserva:', resultadoReserva);
        
        if (!resultadoReserva.sucesso) {
          // Se falhar ao criar reserva, tentar criar uma reserva básica como fallback
          console.warn('Falha ao criar reserva, tentando fallback:', resultadoReserva.erro);
          
          // Criar uma reserva básica sem formulário complexo
          console.log('Tentando criar reserva básica como fallback...');
          const reservaBasica = {
            pacoteId: pacote.id,
            usuarioId: obterIdUsuario(),
            valorUnitario: pacote.preco,
            dataViagem: travelerData.dataViagem, // Adicionar a data da viagem também no fallback
            viajantes: [{
              nome: 'Viajante Principal',
              documento: '12345678901',
              passaporte: 'BR123456789'
            }]
          };
          
          const tentativaReserva = await criarReserva(reservaBasica);
          if (tentativaReserva.sucesso) {
            reservaIdFinal = tentativaReserva.dados.id;
            console.log('Reserva básica criada com sucesso:', reservaIdFinal);
          } else {
            throw new Error('Não foi possível criar a reserva');
          }
        } else {
          reservaIdFinal = resultadoReserva.dados.id;
          
          if (!reservaIdFinal) {
            console.error('ID da reserva não encontrado:', resultadoReserva.dados);
            throw new Error('ID da reserva não foi retornado pelo servidor');
          }
        }
        
        setReservaId(reservaIdFinal);
        console.log('Usando reserva com ID:', reservaIdFinal);
      }

      // Passo 2: Verificar se a reserva tem viajantes antes de processar pagamento
      console.log('Verificando se a reserva tem viajantes...');
      const verificacaoViajantes = await verificarViajantesReserva(reservaIdFinal);
      
      if (verificacaoViajantes.sucesso && !verificacaoViajantes.temViajantes) {
        console.log('Reserva não tem viajantes, criando viajante automaticamente...');
        
        // Criar viajante usando os dados do formulário
        const viajanteData = {
          nome: travelerData.nome || 'Viajante Principal',
          documento: travelerData.cpf || '11111111111',
          passaporte: 'BR123456789',
          reservaId: reservaIdFinal
        };
        
        try {
          const token = localStorage.getItem('token');
          const viajanteResponse = await fetch('http://localhost:5295/api/Viajante', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(viajanteData),
          });
          
          if (viajanteResponse.ok) {
            console.log('Viajante criado com sucesso para reserva existente');
          } else {
            console.warn('Falha ao criar viajante para reserva existente');
          }
        } catch (error) {
          console.warn('Erro ao criar viajante:', error);
        }
      }

      // Passo 3: Processar o pagamento
      console.log('Processando pagamento...');
      const dadosPagamento = {
        reservaId: reservaIdFinal,
        formaDePagamento: converterFormaPagamento(selected),
        email: travelerData.email || ''
      };

      // Adicionar dados específicos por forma de pagamento
      if (selected === 'credito' || selected === 'debito') {
        dadosPagamento.dadosCartao = formatarDadosCartao(card, parcelas);
      } else if (selected === 'pix') {
        dadosPagamento.dadosPix = formatarDadosPix(chavePix);
      } else if (selected === 'boleto') {
        dadosPagamento.dadosBoleto = formatarDadosBoleto();
      }

      const resultadoPagamento = await processarPagamento(dadosPagamento);
      
      if (!resultadoPagamento.sucesso) {
        throw new Error(resultadoPagamento.erro);
      }

      const pagamento = resultadoPagamento.dados;
      setPagamentoId(pagamento.pagamentoId || pagamento.PagamentoId);
      setStatusPagamento(pagamento.status || pagamento.Status);

      console.log('Pagamento iniciado:', pagamento);

      // Verificar se o pagamento foi bem-sucedido
      if (!pagamento.sucesso && pagamento.Sucesso !== true) {
        throw new Error(pagamento.mensagem || pagamento.Mensagem || 'Pagamento rejeitado');
      }

      // Passo 4: Verificar se precisamos monitorar o status
      const statusAtual = pagamento.status || pagamento.Status;
      const pagamentoIdAtual = pagamento.pagamentoId || pagamento.PagamentoId;
      
      console.log('Status do pagamento:', statusAtual);
      console.log('ID do pagamento:', pagamentoIdAtual);

      if ((pagamento.sucesso || pagamento.Sucesso) && ['Pendente'].includes(statusAtual)) {
        setMonitorandoStatus(true);
        
        // Monitorar status do pagamento
        monitorarStatusPagamento(pagamentoIdAtual, (resultado) => {
          if (resultado.sucesso) {
            setStatusPagamento(resultado.dados.statusPagamento);
            
            // Se o pagamento foi aprovado ou rejeitado, parar monitoramento
            if (['Pago', 'Rejeitado'].includes(resultado.dados.statusPagamento)) {
              setMonitorandoStatus(false);
              
              // Se aprovado, ir direto para página de confirmação
              if (resultado.dados.statusPagamento === 'Pago') {
                // Ir para booking-confirmation sem alertas
                setTimeout(() => {
                  navigate('/booking-confirmation', {
                    state: {
                      travelerData,
                      paymentData: {
                        method: selected,
                        total: getFinalTotal(),
                        installments: parcelas,
                        status: resultado.dados.statusPagamento,
                        pagamentoId: pagamentoIdAtual,
                        comprovante: pagamento.comprovante || pagamento.Comprovante
                      },
                      pacote,
                      reservaId: reservaIdFinal
                    }
                  });
                }, 1500); // Aguardar 1.5 segundos para mostrar feedback visual
              } else {
                // Pagamento rejeitado - ir para página de erro
                navigate('/booking-confirmation', {
                  state: {
                    travelerData,
                    paymentData: {
                      method: selected,
                      total: getFinalTotal(),
                      installments: parcelas,
                      status: resultado.dados.statusPagamento,
                      pagamentoId: pagamentoIdAtual,
                      comprovante: pagamento.comprovante || pagamento.Comprovante
                    },
                    pacote,
                    reservaId: reservaIdFinal
                  }
                });
              }
            }
          } else if (resultado.erro) {
            setErro(resultado.erro);
            setMonitorandoStatus(false);
          }
        });
      } else {
        // Pagamento processado imediatamente (aprovado ou rejeitado)
        const statusFinal = statusAtual || 'Pago'; // Assume aprovado se não tiver status específico
        
        setTimeout(() => {
          if (['Pago', 'Aprovado'].includes(statusFinal)) {
            // Pagamento aprovado - ir direto para booking-confirmation sem alertas
            navigate('/booking-confirmation', {
              state: {
                travelerData,
                paymentData: {
                  method: selected,
                  total: getFinalTotal(),
                  installments: parcelas,
                  status: statusFinal,
                  pagamentoId: pagamentoIdAtual,
                  comprovante: pagamento.comprovante || pagamento.Comprovante
                },
                pacote,
                reservaId: reservaIdFinal
              }
            });
          } else {
            // Pagamento rejeitado ou com problema
            navigate('/booking-confirmation', {
              state: {
                travelerData,
                paymentData: {
                  method: selected,
                  total: getFinalTotal(),
                  installments: parcelas,
                  status: statusFinal,
                  pagamentoId: pagamentoIdAtual,
                  comprovante: pagamento.comprovante || pagamento.Comprovante
                },
                pacote,
                reservaId: reservaIdFinal
              }
            });
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setErro(error.message || 'Erro ao processar pagamento');
    } finally {
      setProcessandoPagamento(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação do número do cartão
    if (name === "number") {
      formattedValue = value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{4})(?=\d)/g, "$1 ") // Adiciona espaço a cada 4 dígitos
        .substring(0, 19); // Limita a 19 caracteres (16 dígitos + 3 espaços)
    }

    // Formatação da validade
    if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "") // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, "$1/$2") // Adiciona / após os dois primeiros dígitos
        .substring(0, 5); // Limita a 5 caracteres (MM/AA)
    }

    // Formatação do CVV (apenas dígitos)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 3);
    }

    // Formatação do nome (apenas letras e espaços)
    if (name === "name") {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").toUpperCase();
    }

    setCard((prev) => ({ ...prev, [name]: formattedValue }));
    
    if (name === "cvv") {
      setIsFlipped(formattedValue.length > 0);
    }
  };

  // Função para alternar entre usar cartão salvo ou novo
  const handleTipoCartaoChange = (usarSalvo) => {
    setUsarCartaoSalvo(usarSalvo);
    
    if (usarSalvo && cartoesSalvos.length > 0) {
      // Se escolher usar cartão salvo, selecionar o primeiro
      const cartaoPrincipal = cartoesSalvos[0];
      setCartaoSelecionado(cartaoPrincipal.id.toString());
      preencherCartaoSalvo(cartaoPrincipal);
    } else {
      // Se escolher novo cartão, limpar campos
      setCartaoSelecionado('');
      setCard({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
      });
    }
  };

  // Função para preencher dados do cartão selecionado
  // Função para buscar cartão com número completo para pagamento
  const buscarCartaoCompleto = async (cartaoId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/Cartao/${cartaoId}/for-payment`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar cartão para pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cartão completo:', error);
      return null;
    }
  };

  const preencherCartaoSalvo = async (cartao) => {
    if (cartao) {
      console.log('Preenchendo cartão:', cartao); // Debug
      
      // Buscar o cartão completo para pagamento
      const cartaoCompleto = await buscarCartaoCompleto(cartao.id);
      
      // Formatar a validade para MM/AA se não estiver formatada
      let validadeFormatada = cartao.validade || '';
      if (validadeFormatada && !validadeFormatada.includes('/')) {
        validadeFormatada = validadeFormatada.replace(/(\d{2})(\d{2})/, '$1/$2');
      }
      
      setCard({
        number: cartaoCompleto?.numeroCartao || cartao.numeroCartaoMascarado || "", // Usar número completo se disponível
        name: (cartao.nomeTitular || "").toUpperCase(), // Nome sempre em maiúscula
        expiry: validadeFormatada,
        cvv: "", // CVV nunca é preenchido por segurança
      });
    }
  };

  // Função para quando o usuário seleciona um cartão específico
  const handleCartaoSelecionadoChange = (cartaoId) => {
    setCartaoSelecionado(cartaoId);
    const cartao = cartoesSalvos.find(c => c.id.toString() === cartaoId);
    if (cartao) {
      preencherCartaoSalvo(cartao);
    }
  };

  return (
    <section className="pt-6 pb-10 min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <div className="flex justify-start mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#F28C38] hover:text-orange-600 transition-colors duration-300 cursor-pointer"
            >
              <ArrowLeft size={20} />
              Voltar aos dados do viajante
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#F28C38] mb-2">Finalizar Pagamento</h1>
            <p className="text-gray-600">Etapa 2 de 3 - Complete sua reserva de forma segura</p>
          </div>
        </div>

        {/* Resumo da reserva */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-[#F28C38] to-orange-500 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Resumo da Reserva</h2>
            <p className="text-orange-100">Verifique os detalhes antes de prosseguir</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={pacote.imagens && pacote.imagens.length > 0
                  ? `http://localhost:5295${pacote.imagens[0].url}`
                  : '/default-package.jpg'
                }
                alt={pacote.titulo}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{pacote.titulo}</h3>
                <h4 className="text-gray-600">{`${pacote.titulo}, ${pacote.destino}`}</h4>
                <p className="text-gray-600">
                  {travelerData.numeroViajantes} {travelerData.numeroViajantes === 1 ? 'pessoa' : 'pessoas'} •
                  {' '}{new Date(travelerData.dataViagem).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Pacote ({travelerData.numeroViajantes}x)</span>
                <span>R$ {(pacote.preco * travelerData.numeroViajantes).toLocaleString('pt-BR')}</span>
              </div>
              {parcelas > 1 && (
                <div className="flex justify-between text-sm mb-2 text-orange-600">
                  <span>Taxa de parcelamento (2%)</span>
                  <span>R$ {(pacote.preco * travelerData.numeroViajantes * 0.02).toLocaleString('pt-BR')}</span>
                </div>
              )}
              {selected === 'pix' && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {calculateDiscount().toLocaleString('pt-BR')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-[#F28C38]">R$ {getFinalTotal().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Pagamento */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[#F28C38] text-white p-4">
            <h3 className="text-xl font-bold">Forma de Pagamento</h3>
          </div>
          
          {/* Opções de pagamento */}
          <div className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "credito" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("credito")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">
                    <CreditCard className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="font-semibold text-sm">Cartão de Crédito</div>
                  <div className="text-xs opacity-75 mt-1">Até 12x sem juros</div>
                </div>
                {selected === "credito" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "debito" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("debito")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">
                    <Building2 className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="font-semibold text-sm">Cartão de Débito</div>
                  <div className="text-xs opacity-75 mt-1">À vista</div>
                </div>
                {selected === "debito" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "pix" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("pix")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">
                    <Smartphone className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="font-semibold text-sm">Pix</div>
                  <div className="text-xs opacity-75 mt-1">Instantâneo</div>
                </div>
                {selected === "pix" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
              
              <button
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selected === "boleto" 
                    ? "bg-[#F28C38] text-white border-[#F28C38] shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#F28C38] hover:text-[#F28C38]"
                }`}
                onClick={() => setSelected("boleto")}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">
                    <Receipt className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="font-semibold text-sm">Boleto</div>
                  <div className="text-xs opacity-75 mt-1">Até 3 dias úteis</div>
                </div>
                {selected === "boleto" && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            </div>

            {/* Formulário e cartão animado para crédito/débito */}
            {(selected === "credito" || selected === "debito") && (
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                {/* Opções de cartão - só mostra se usuário tem cartões cadastrados */}
                {cartoesSalvos.length > 0 && (
                  <div className="lg:col-span-2 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Como deseja preencher os dados do cartão?</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tipoCartao"
                          checked={usarCartaoSalvo}
                          onChange={() => handleTipoCartaoChange(true)}
                          className="mr-2 text-[#F28C38] focus:ring-[#F28C38]"
                        />
                        <span className="text-sm text-gray-700">Usar cartão cadastrado</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tipoCartao"
                          checked={!usarCartaoSalvo}
                          onChange={() => handleTipoCartaoChange(false)}
                          className="mr-2 text-[#F28C38] focus:ring-[#F28C38]"
                        />
                        <span className="text-sm text-gray-700">Inserir novo cartão</span>
                      </label>
                    </div>
                    
                    {/* Seletor de cartão cadastrado */}
                    {usarCartaoSalvo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selecionar cartão:
                        </label>
                        <select
                          value={cartaoSelecionado}
                          onChange={(e) => handleCartaoSelecionadoChange(e.target.value)}
                          className="w-full p-3 border-2 rounded-xl border-gray-200 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100"
                        >
                          {cartoesSalvos.map((cartao) => (
                            <option key={cartao.id} value={cartao.id}>
                              {cartao.apelido ? `${cartao.apelido} - ` : ''}
                              {cartao.numeroCartaoMascarado} - {cartao.nomeTitular}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          Por segurança, você ainda precisará inserir o CVV do cartão selecionado.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Formulário */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Cartão</h4>
                  <form className="space-y-3">
                    <div className="relative group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <CreditCard className="w-4 h-4 text-orange-500" />
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        name="number"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        disabled={usarCartaoSalvo}
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 ${
                          usarCartaoSalvo 
                            ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
                            : 'border-gray-200 focus:border-[#F28C38] cursor-text'
                        }`}
                        value={card.number}
                        onChange={handleChange}
                      />
                      {/* Bandeira do cartão */}
                      {flag && (
                        <div className="absolute right-3 top-10 bg-white p-1 rounded shadow-sm">
                          {flag === "visa" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" />
                          )}
                          {flag === "mastercard" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                          )}
                          {flag === "amex" && (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-5" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 text-orange-500" />
                        Nome do titular
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Digite seu nome completo"
                        disabled={usarCartaoSalvo}
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 ${
                          usarCartaoSalvo 
                            ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
                            : 'border-gray-200 focus:border-[#F28C38] cursor-text'
                        }`}
                        value={card.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          Validade
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          maxLength={5}
                          placeholder="MM/AA"
                          disabled={usarCartaoSalvo}
                          className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 ${
                            usarCartaoSalvo 
                              ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
                              : 'border-gray-200 focus:border-[#F28C38] cursor-text'
                          }`}
                          value={card.expiry}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Lock className="w-4 h-4 text-orange-500" />
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          maxLength={3}
                          placeholder="000"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-text"
                          value={card.cvv}
                          onChange={handleChange}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                        />
                      </div>
                    </div>
                    
                    {/* Parcelamento apenas para crédito */}
                    {selected === "credito" && (
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parcelamento
                        </label>
                        <select
                          className="w-full p-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-[#F28C38] focus:ring-4 focus:ring-orange-100 group-hover:border-gray-300 cursor-pointer"
                          value={parcelas}
                          onChange={e => setParcelas(Number(e.target.value))}
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}x de R$ {getInstallmentValue(i + 1).toLocaleString('pt-BR')} {i === 0 ? '(à vista)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </form>
                </div>
                
                {/* Cartão animado */}
                <div className="flex items-center justify-center">
                  <div className="relative w-72 h-44" style={customStyles.perspective}>
                    <div
                      className={`absolute w-full h-full transition-transform duration-700 ease-in-out`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Frente do cartão */}
                      <div 
                        className="absolute w-full h-full bg-[#F28C38] text-white rounded-2xl shadow-2xl flex flex-col justify-between p-5 transform hover:scale-105 transition-transform duration-300"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Header com logo e bandeira */}
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-semibold opacity-90">DECOLA TOUR</div>
                          <div className="h-7">
                            {flag === "visa" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-7 filter brightness-0 invert" />
                            )}
                            {flag === "mastercard" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" />
                            )}
                            {flag === "amex" && (
                              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-7 filter brightness-0 invert" />
                            )}
                          </div>
                        </div>
                        
                        {/* Chip */}
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-inner"></div>
                        
                        {/* Número do cartão */}
                        <div className="t
                        ext-lg lg:text-xl font-bold tracking-widest">
                          {card.number || "•••• •••• •••• ••••"}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-75">Nome do titular</div>
                            <div className="font-semibold text-sm">
                              {card.name || "SEU NOME AQUI"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Validade</div>
                            <div className="font-semibold">{card.expiry || "MM/AA"}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Verso do cartão */}
                      <div 
                        className="absolute w-full h-full bg-[#F28C38] text-white rounded-2xl shadow-2xl overflow-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Faixa magnética */}
                        <div className="w-full h-10 bg-gray-800 mt-5"></div>
                        
                        {/* CVV */}
                        <div className="p-5 pt-6">
                          <div className="bg-white h-7 rounded flex items-center justify-end px-3 mb-3">
                            <span className="text-gray-800 font-bold tracking-wider">
                              {card.cvv || "•••"}
                            </span>
                          </div>
                          <div className="text-xs opacity-75">
                            Para sua segurança, não compartilhe o código CVV
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pix ou Boleto selecionado */}
            {selected === "pix" && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Smartphone className="w-16 h-16 text-orange-500" />
                  </div>
                  <h4 className="text-xl font-bold text-[#F28C38] mb-4">Pagamento via Pix</h4>
                  
                  {/* QR Code de exemplo */}
                  <div className="flex justify-center mb-6">
                    <img 
                      src={qrCodePix} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 object-contain rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                  
                  {/* Campo para chave PIX do usuário */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Sua Chave PIX *
                    </label>
                    <input
                      type="text"
                      value={chavePix}
                      onChange={(e) => setChavePix(e.target.value)}
                      placeholder="Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C38] focus:border-transparent text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Esta chave será usada para processar seu pagamento PIX
                    </p>
                  </div>
                  
                  {/* Informações de exemplo */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-blue-800 mb-2">Como funciona:</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>1. Digite sua chave PIX acima</p>
                      <p>2. Clique em "Finalizar Pagamento"</p>
                      <p>3. Você receberá os dados para pagamento por email</p>
                      <p>4. Complete o pagamento em até 30 minutos</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                        <Coins className="w-4 h-4 text-orange-500" />
                        Desconto de 5% aplicado no pagamento via PIX
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selected === "boleto" && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Receipt className="w-16 h-16 text-orange-500" />
                  </div>
                  <h4 className="text-xl font-bold text-[#F28C38] mb-3">Pagamento via Boleto</h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="text-gray-700">
                      O boleto será gerado após a confirmação e enviado para o seu e-mail.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Prazo de vencimento: 3 dias úteis
                    </p>
                  </div>
                  
                  {/* Imagem do boleto de exemplo */}
                  <div className="flex justify-center">
                    <img 
                      src={boletoFake} 
                      alt="Exemplo de Boleto" 
                      className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status do pagamento */}
        {(processandoPagamento || monitorandoStatus || erro || statusPagamento) && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {erro && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="text-red-500 text-xl" />
                <div>
                  <h4 className="font-semibold text-red-800">Erro no Pagamento</h4>
                  <p className="text-red-600">{erro}</p>
                </div>
              </div>
            )}
            
            {processandoPagamento && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="text-blue-500 text-xl animate-spin" />
                <div>
                  <h4 className="font-semibold text-blue-800">Processando Pagamento</h4>
                  <p className="text-blue-600">
                    {reservaId ? 'Processando seu pagamento...' : 'Criando sua reserva...'}
                  </p>
                </div>
              </div>
            )}
            
            {monitorandoStatus && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Loader2 className="text-yellow-500 text-xl animate-spin" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Aguardando Confirmação</h4>
                  <p className="text-yellow-600">
                    Monitorando status do pagamento... Status atual: {statusPagamento}
                  </p>
                </div>
              </div>
            )}
            
            {statusPagamento === 'Pago' && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="text-green-500 text-xl" />
                <div>
                  <h4 className="font-semibold text-green-800">Pagamento Aprovado!</h4>
                  <p className="text-green-600">Redirecionando para confirmação...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botão de confirmação */}
        <form onSubmit={e => { e.preventDefault(); handleFinalizarCompra(); }} className="mt-8">
          <button
            type="submit"
            disabled={processandoPagamento || monitorandoStatus || !isFormValid()}
            className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              processandoPagamento || monitorandoStatus || !isFormValid()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[#F28C38] text-white hover:bg-orange-600 hover:scale-[1.02] hover:shadow-xl cursor-pointer focus:ring-4 focus:ring-orange-200 focus:outline-none'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {(processandoPagamento || monitorandoStatus) ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>
                    {processandoPagamento ? 'Processando...' : 'Aguardando confirmação...'}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Confirmar Pagamento Seguro</span>
                  <span className="text-sm opacity-90">- {getPaymentButtonText()}</span>
                </>
              )}
            </div>
          </button>
        </form>
        
        {/* Informações de segurança */}
        <div className="mt-5 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-orange-500" />
              <span>SSL Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-orange-500" />
              <span>Dados Protegidos</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>Site Verificado</span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}