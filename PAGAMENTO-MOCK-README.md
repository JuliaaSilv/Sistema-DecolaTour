# 💳 Sistema de Pagamento Mocado - DecolaTour

Este sistema implementa um **mock completo** de pagamentos para o sistema de reservas de pacotes turísticos, simulando todas as operações de pagamento sem utilizar gateways externos reais.

## 🎯 Funcionalidades Implementadas

### ✅ Backend (API .NET 9)
- **Mock de Pagamentos**: PIX, Cartão de Crédito, Cartão de Débito e Boleto
- **Webhook Automático**: Simula callbacks de status após processamento
- **Geração de Comprovantes**: Cria dados simulados de comprovantes
- **Validação e Lógica Fake**: Diferentes cenários de aprovação/rejeição
- **Envio de Email**: Integração com EmailService para notificações
- **API RESTful**: Endpoints completos para gestão de pagamentos

### 2. ✅ Frontend (React)
- **Interface de Pagamento**: Formulários dinâmicos por tipo de pagamento
- **Monitoramento em Tempo Real**: Atualização automática de status
- **Lista de Pagamentos**: Visualização e gestão de transações
- **Dashboard**: Resumo e estatísticas de pagamentos
- **Webhooks Manuais**: Simulação de alterações de status
- **Validação de Dados**: Verificação de campos obrigatórios

## 3. 🚀 Como Executar

### Backend
```bash
cd backend
dotnet restore
dotnet run
```
A API estará disponível em: `https://localhost:7042`

### Frontend
```bash
cd front-end
npm install
npm run dev
```
O frontend estará disponível em: `http://localhost:3000`

## 4. 📡 Endpoints da API

### Processar Pagamento Completo
```http
POST /api/Pagamento/processar
Content-Type: application/json

{
  "reservaId": 1,
  "formaDePagamento": 2,
  "email": "cliente@exemplo.com",
  "dadosPix": {
    "chavePix": "cliente@exemplo.com",
    "tipoChave": "email"
  }
}
```

### Listar Pagamentos
```http
GET /api/Pagamento
GET /api/Pagamento/reserva/{reservaId}
GET /api/Pagamento/{id}
```

### Webhook (Interno)
```http
POST /api/Pagamento/webhook/simular/{pagamentoId}?status=Pago
```

## 🧪 Cenários de Teste

### PIX
- ✅ **Sucesso**: Qualquer chave válida
- ❌ **Falha**: Chave PIX `teste@falha.com`
- ⏱️ **Webhook**: 3-5 segundos

### Cartão de Crédito/Débito
- ✅ **Sucesso**: Cartões normais
- ❌ **Falha**: Números terminados em `0000`
- ❌ **Falha**: CVV `000`
- ❌ **Falha**: Débito com valor > R$ 5.000
- ⏱️ **Webhook**: 1-3 segundos

### Boleto
- ✅ **Sucesso**: Sempre gera boleto
- ⏱️ **Webhook**: 10-15 segundos (simula pagamento)

## 🎬 Guia para Apresentação/Demonstração

### 📋 **Roteiro de Demonstração Recomendado:**

#### **1. Introdução (2 min)**
- Mostrar a interface principal
- Explicar que é um mock completo sem gateways externos
- Destacar que simula comportamentos reais

#### **2. Pagamento PIX - Sucesso (3 min)**
```
Reserva ID: 1
Email: cliente@exemplo.com
Chave PIX: cliente@exemplo.com
```
- Mostrar processamento instantâneo
- Exibir comprovante com QR Code
- Aguardar webhook (3-5s) e mostrar mudança de status

#### **3. Pagamento PIX - Falha (2 min)**
```
Reserva ID: 1
Email: cliente@exemplo.com
Chave PIX: teste@falha.com
```
- Mostrar rejeição imediata
- Explicar lógica de validação fake

#### **4. Cartão de Crédito - Sucesso (3 min)**
```
Reserva ID: 1
Email: cliente@exemplo.com
Número: 4111111111111111
Nome: João Silva
Validade: 12/2028
CVV: 123
Parcelas: 3x
```
- Mostrar processamento com delay
- Exibir comprovante com código de autorização
- Webhook mais rápido (1-3s)

#### **5. Cartão - Falha Demonstrativa (2 min)**
```
Número: 4111111111110000 (termina em 0000)
CVV: 000
```
- Mostrar diferentes tipos de rejeição
- Explicar lógicas implementadas

#### **6. Boleto (2 min)**
```
CPF: 12345678901
Nome: Pedro Costa
```
- Mostrar geração instantânea
- Exibir código de barras simulado
- Explicar webhook de 10-15s (não aguardar)

#### **7. Dashboard e Gestão (2 min)**
- Mostrar lista de pagamentos
- Demonstrar webhook manual
- Exibir estatísticas

### 🎯 **Pontos-Chave para Destacar:**

#### **Aspectos Técnicos:**
- ✅ **Zero dependência externa** - Funciona offline
- ✅ **Webhooks automáticos** - Simula comportamento real
- ✅ **Diferentes delays** - PIX (3-5s), Cartão (1-3s), Boleto (10-15s)
- ✅ **Comprovantes completos** - QR codes, códigos de barras, autorizações
- ✅ **Emails automáticos** - Notificações de status
- ✅ **Interface responsiva** - Funciona mobile e desktop

#### **Lógicas de Negócio:**
- ✅ **Validações realistas** - Cartões inválidos, limites, etc.
- ✅ **Status progressivos** - Pendente → Pago/Rejeitado
- ✅ **Formas de pagamento** - PIX, Cartão, Boleto
- ✅ **Gestão de reservas** - Integrado com sistema existente

#### **Funcionalidades Demo:**
- ✅ **Cenários controlados** - Sucesso/falha previsíveis
- ✅ **Monitoramento real-time** - Status atualiza automaticamente
- ✅ **Dados simulados** - Códigos, IDs, transações
- ✅ **Interface intuitiva** - Fácil de usar e entender

### 📊 **Dados para Demonstração Rápida:**

#### **PIX - Sucesso Garantido:**
```
Chave: qualquer@email.com
```

#### **PIX - Falha Garantida:**
```
Chave: teste@falha.com
```

#### **Cartão - Sucesso Garantido:**
```
Número: 4111111111111111
CVV: 123
```

#### **Cartão - Falha Garantida:**
```
Número: 4111111111110000
CVV: 000
```

### ⚡ **Scripts de Demonstração Prontos:**

No arquivo `pagamento-mock-tests.http` há requests prontos para copiar/colar durante a apresentação, organizados por cenário.

## 📊 Estrutura dos Dados

### Formas de Pagamento (Enum)
```csharp
public enum FormaDePagamento
{
    CartaoCredito = 0,
    CartaoDebito = 1,
    Pix = 2,
    Boleto = 3
}
```

### Status de Pagamento (Enum)
```csharp
public enum StatusPagamento
{
    Pendente = 0,
    Pago = 1,
    Rejeitado = 2,
    Reembolsado = 3
}
```

### Resposta do Pagamento
```json
{
  "sucesso": true,
  "mensagem": "PIX processado com sucesso. Aguarde a confirmação.",
  "pagamentoId": 123,
  "status": "Pendente",
  "comprovante": {
    "idComprovante": "ABC123DEF456",
    "codigoTransacao": "TXN20250103154230001",
    "qrCodePix": "base64_encoded_qr_code",
    "valor": 1500.00,
    "formaPagamento": "Pix"
  },
  "tempoEstimadoWebhook": 5
}
```

## 🔄 Fluxo de Pagamento

1. **Criação**: Cliente seleciona forma de pagamento e preenche dados
2. **Validação**: Sistema valida dados de entrada
3. **Processamento Mock**: Aplica lógica fake baseada nos dados
4. **Resposta Imediata**: Retorna sucesso/erro e comprovante
5. **Webhook Simulado**: Após delay, atualiza status automaticamente
6. **Notificação**: Envia email com resultado final

## 🎨 Componentes React

### `PagamentoComponent`
Interface principal para processar pagamentos:
```jsx
<PagamentoComponent 
  reservaId={1}
  onPagamentoCompleto={(resposta) => console.log(resposta)}
  onPagamentoErro={(erro) => console.log(erro)}
/>
```

### `PagamentosList`
Lista e gerencia pagamentos existentes:
```jsx
<PagamentosList 
  reservaId={1} // Opcional, para filtrar por reserva
  showActions={true} // Mostrar botões de ação
/>
```

### `PagamentosPage`
Página completa com abas e funcionalidades:
```jsx
<PagamentosPage />
```

## 🔧 Hooks Personalizados

### `usePagamento`
Hook para operações de pagamento:
```javascript
const {
  pagamentos,
  loading,
  error,
  processarPagamento,
  simularWebhook,
  monitorarStatusPagamento
} = usePagamento();
```

### `usePagamentoUtils`
Hook para formatação e utilitários:
```javascript
const {
  formatarMoeda,
  formatarStatusPagamento,
  validarDadosPagamento
} = usePagamentoUtils();
```

## 🛠️ Arquivos Criados/Modificados

### Backend
```
DTOs/
├── PagamentoCompletoRequestDTO.cs
├── ComprovantePagamentoDTO.cs

Interfaces/Services/
├── IPagamentoMockService.cs

Service/
├── PagamentoMockService.cs
├── PagamentoService.cs (modificado)

Controller/
├── PagamentoController.cs (modificado)

pagamento-mock-tests.http
```

### Frontend
```
src/
├── components/
│   ├── PagamentoComponent.jsx
│   └── PagamentosList.jsx
├── hooks/
│   └── usePagamento.js
└── pages/
    └── PagamentosPage.jsx
```

## 📝 Testes Manuais

Use o arquivo `pagamento-mock-tests.http` no VS Code com a extensão REST Client para testar todos os cenários:

1. **PIX Sucesso** - Chave válida
2. **PIX Falha** - Chave `teste@falha.com`
3. **Cartão Sucesso** - Dados válidos
4. **Cartão Falha** - Número `4111111111110000`
5. **Boleto** - Sempre sucesso
6. **Webhook Manual** - Simular alterações de status

## 🔐 Segurança e Produção

⚠️ **IMPORTANTE**: Este é um sistema de MOCK para desenvolvimento/testes. Para produção:

1. Remover todas as lógicas fake
2. Integrar com gateway real (MercadoPago, Stripe, etc.)
3. Implementar autenticação/autorização adequada
4. Adicionar logs de auditoria
5. Configurar HTTPS obrigatório
6. Implementar rate limiting
7. Validar todos os dados de entrada
8. Criptografar dados sensíveis

## 📧 Notificações por Email

O sistema está integrado com o `IEmailService` existente. Os emails são enviados automaticamente:

- ✅ **Comprovante**: Quando pagamento é processado com sucesso
- ❌ **Erro**: Quando pagamento é rejeitado
- 🔄 **Atualização**: Quando status muda via webhook

## 🎯 Próximos Passos

1. **Testes de Integração**: Implementar testes automatizados
2. **Logs Detalhados**: Adicionar logging estruturado
3. **Métricas**: Implementar coleta de métricas de performance
4. **Cache**: Adicionar cache para consultas frequentes
5. **Documentação API**: Swagger/OpenAPI detalhado
6. **Monitoramento**: Implementar health checks

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Sistema de Pagamento Mocado - DecolaTour** 🚀
Desenvolvido para simular operações de pagamento de forma completa e realista!
