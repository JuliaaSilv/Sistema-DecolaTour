# 📚 DOCUMENTAÇÃO COMPLETA - SISTEMA DECOLATOUR

## 🎯 **VISÃO GERAL DO PROJETO**

O DecolaTour é uma plataforma completa de turismo desenvolvida com arquitetura moderna, separando claramente o back-end (API REST em .NET 9) do front-end (React.js). O sistema permite gestão de pacotes turísticos, reservas, pagamentos e avaliações.

---

## 🏗️ **ARQUITETURA GERAL DO SISTEMA**

```mermaid
graph TB
    subgraph "FRONT-END (React.js)"
        A[🌐 Páginas] --> B[⚡ Componentes]
        B --> C[🔧 Hooks/Context]
        C --> D[📡 API Calls]
    end
    
    subgraph "BACK-END (.NET 9)"
        E[🎮 Controllers] --> F[⚙️ Services]
        F --> G[🗃️ Repository]
        G --> H[💾 Entity Framework]
        H --> I[🏦 SQL Server LocalDB]
    end
    
    D --> E
    
    subgraph "RECURSOS"
        J[🔐 JWT Auth]
        K[📧 Email Service]
        L[📱 Web Speech API]
        M[♿ Accessibility]
    end
    
    style A fill:#61DAFB
    style E fill:#512BD4
    style I fill:#FFA500
```

---

## 🗄️ **MODELAGEM DO BANCO DE DADOS**

```mermaid
classDiagram

class Usuario {
  +id: int
  +nome: string
  +cpf: string
  +telefone: string
  +dataNascimento: date
  +email: string
  +senha: string

}

class TipoUsuario {
+idTipoUsuario: int
+nome: string // "administrador", "atendente", "cliente"
}

class TipoDocumento {
  +idUsuario: int
  +tipoDocumento: string
  +numeroDocumento: string
}

class Reserva {
  +idReserva: int
  +idUsuario: int
  +numeroReserva: int
  +dataReserva: date
  +status: string <<enum>> // "pendente", "confirmada", "cancelada"
  +idPacote: int
  +ValorUnitário: float
}

class Avaliacao {
  +idAvaliacao: int
  +nota: int
  +comentario: string
  +data: date
  +idReserva: int
}

class Pacote {
  +id: int
  +titulo: string
  +descricao: string
  +destino: string
  +duracao: int
  +dataDisponivel: date
  +valorTotal: float
}

class Midia {
  +id: int
  +tipo: string
  +url: string
  +idPacote: int
}

class Pagamento {
  +id: int
  +valor: float
  +formaDePagamento: string <<enum>> // "cartao", "pix", "boleto"
  +dataPagamento: date
  +idReserva: int
  +statusPagamento: string // "pendente", "confirmada", "cancelada"
}

class Viajante {
  +id: int
  +nome: string
  +documento: string
  +passaporte: string
  +idReserva: int
}

class Promocao {
  +id: int
  +nome: string
  +descricao: string
  +descontoPercentual: float
  +dataInicio: date
  +dataFim: date
}

%% ========= RELACIONAMENTOS =========

Usuario "1" --> "N" Reserva : faz
Usuario "1" --> "1" TipoDocumento : possui
Usuario "1" --> "1" TipoUsuario: possui

Reserva "1" --> "1" Avaliacao : possui
Reserva "1" --> "1" Pagamento : gera
Reserva "1" --> "N" Viajante : inclui
Reserva "N" --> "1" Pacote : seleciona

Pacote "1" --> "N" Midia : contém
Pacote "N" --> "N" Promocao : participa
```

---

## 🔧 **ARQUITETURA DO BACK-END (.NET 9)**

### **📁 Estrutura de Pastas:**

```
backend/
├── 🎮 Controllers/          # Endpoints da API (10 controllers)
├── ⚙️ Services/            # Lógica de negócio (14 services)
├── 🗃️ Repository/          # Acesso a dados (Repository Pattern)
├── 📊 DTOs/               # Data Transfer Objects (29 classes)
├── 🗄️ Models/             # Entidades do banco (19 models)
├── 🔄 Migrations/         # Versionamento do banco
├── 🌐 Interfaces/         # Contratos das dependências
├── 🗺️ Mapper/             # AutoMapper profiles
├── ⚙️ Configuration/      # Configurações (Swagger, DI)
├── 📧 Templates/          # Templates de email
├── 📜 Scripts/            # Scripts SQL de seed
└── 🌍 wwwroot/           # Arquivos estáticos
```

### **🎮 Controllers (Camada de Apresentação):**

```mermaid
graph LR
    A[🌐 HTTP Request] --> B[🎮 Controller]
    B --> C[⚙️ Service]
    C --> D[🗃️ Repository]
    D --> E[💾 Database]
    
    B --> F[📊 DTO Validation]
    B --> G[🔐 JWT Auth]
    B --> H[📤 HTTP Response]
```

**Controllers Implementados:**
- `AuthController` - Autenticação e autorização
- `UserController` - Gestão de usuários
- `PacotesController` - CRUD de pacotes turísticos
- `ReservaController` - Gestão de reservas
- `PagamentoController` - Processamento de pagamentos
- `AvaliacaoController` - Sistema de avaliações
- `CartaoController` - Gestão de cartões salvos
- `EnderecoController` - Gestão de endereços
- `ViajanteController` - Gestão de viajantes
- `AdminDashboardController` - Painel administrativo

### **⚙️ Services (Camada de Negócio):**

```mermaid
graph TB
    subgraph "🔐 Autenticação"
        A1[UserService]
        A2[EmailService]
    end
    
    subgraph "📦 Pacotes"
        B1[PacoteService]
        B2[ImageProcessingService]
    end
    
    subgraph "💰 Pagamentos"
        C1[PagamentoService]
        C2[PagamentoMockService]
    end
    
    subgraph "📋 Reservas"
        D1[ReservaService]
        D2[ViajanteService]
        D3[AvaliacaoService]
    end
    
    subgraph "👤 Perfil"
        E1[CartaoService]
        E2[EnderecoService]
    end
    
    subgraph "📊 Administrativo"
        F1[AdminDashboardService]
    end
```

### **🗃️ Repository Pattern:**

```csharp
// Exemplo de interface
public interface IPacoteRepository
{
    Task<List<Pacote>> GetAllAsync();
    Task<Pacote> GetByIdAsync(int id);
    Task<Pacote> CreateAsync(Pacote pacote);
    Task<Pacote> UpdateAsync(Pacote pacote);
    Task DeleteAsync(int id);
}
```

### **🔧 Tecnologias do Back-end:**

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **.NET** | 9.0 | Framework principal |
| **Entity Framework Core** | 9.0.7 | ORM para banco de dados |
| **AutoMapper** | 12.0.1 | Mapeamento objeto-objeto |
| **BCrypt.Net** | 4.0.3 | Hash de senhas |
| **JWT Bearer** | 9.0.7 | Autenticação JWT |
| **MailKit** | 4.13.0 | Envio de emails |
| **Dapper** | 2.1.66 | Queries SQL otimizadas |

---

## ⚛️ **ARQUITETURA DO FRONT-END (React.js)**

### **📁 Estrutura de Pastas:**

```
front-end/src/
├── 📄 pages/                    # Páginas da aplicação
├── 🧩 components/               # Componentes reutilizáveis
│   ├── 🏠 common/              # Componentes gerais
│   ├── ♿ accessibility/        # Recursos de acessibilidade
│   ├── 📦 package-details/     # Detalhes de pacotes
│   └── 🎨 ui/                  # Componentes de UI
├── 🌐 api/                     # Chamadas para API
├── 🖼️ assets/                  # Imagens e recursos
├── 🎯 hooks/                   # Custom hooks
├── 🗺️ layouts/                 # Layouts das páginas
└── 🎨 styles/                  # Estilos CSS
```

### **📄 Páginas Principais:**

```mermaid
graph TB
    A[🏠 Home] --> B[🔍 SearchResults]
    A --> C[📝 Login/Cadastro]
    C --> D[👤 Perfil]
    B --> E[📦 PackageDetails]
    E --> F[📋 BookingForm]
    F --> G[💳 Pagamento]
    G --> H[✅ BookingConfirmation]
    
    C --> I[🛡️ AdminLogin]
    I --> J[📊 AdminPainel]
    
    D --> K[📜 ReservaDetalhes]
    
    style A fill:#61DAFB
    style J fill:#FF6B6B
```

### **🧩 Componentes por Categoria:**

#### **♿ Acessibilidade (WCAG 2.1):**
```mermaid
graph LR
    A[AccessibilityButton] --> B[AccessibilityPanel]
    B --> C[Font Size Control]
    B --> D[Contrast Modes]
    B --> E[ScreenReader]
    
    F[AccessibilityContext] --> A
```

**Recursos de Acessibilidade:**
- 🔤 **Controle de fonte** (0.8x - 1.2x)
- 🎨 **3 modos de contraste** (Alto, Amarelo/Preto, Branco/Amarelo)
- 🔊 **Leitor de tela** com Web Speech API
- ⌨️ **Navegação por teclado**
- 🏷️ **ARIA labels** em todos os elementos

#### **🌐 Integração com API:**
```mermaid
graph TB
    A[React Component] --> B[API Call]
    B --> C{Status}
    C -->|200| D[Success State]
    C -->|401| E[Redirect Login]
    C -->|Error| F[Error Handling]
    
    G[JWT Token] --> B
    H[Loading State] --> B
```

### **🎯 Hooks Customizados:**

```javascript
// Exemplo de hook de acessibilidade
const useAccessibility = () => {
  const [fontSize, setFontSize] = useState(1);
  const [contrastMode, setContrastMode] = useState('none');
  
  return { fontSize, setFontSize, contrastMode, setContrastMode };
};
```

### **🔧 Tecnologias do Front-end:**

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18.3.1 | Framework principal |
| **Vite** | 5.3.4 | Build tool e dev server |
| **React Router** | 6.24.1 | Roteamento SPA |
| **Tailwind CSS** | 3.4.6 | Framework CSS |
| **Lucide React** | 0.400.0 | Ícones |
| **React Icons** | 5.2.1 | Biblioteca de ícones |

---

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### **🔑 Fluxo de Autenticação JWT:**

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as ⚛️ Front-end
    participant A as 🔐 AuthController
    participant S as ⚙️ UserService
    participant D as 💾 Database

    U->>F: Login (email, senha)
    F->>A: POST /api/Auth/login
    A->>S: ValidateUser()
    S->>D: Buscar usuário
    D-->>S: Dados do usuário
    S->>S: BCrypt.Verify(senha)
    S-->>A: Usuário válido
    A->>A: Gerar JWT Token
    A-->>F: { token, user }
    F->>F: localStorage.setItem('token')
    F-->>U: Redirect Dashboard
```

### **🛡️ Middleware de Autorização:**

```csharp
[Authorize] // Requer autenticação
[Authorize(Roles = "Administrador")] // Requer role específica
```

---

## 💳 **SISTEMA DE PAGAMENTOS**

### **💰 Fluxo de Pagamento:**

```mermaid
graph TB
    A[📋 BookingForm] --> B[💳 Pagamento]
    B --> C{Forma de Pagamento}
    
    C -->|Cartão| D[💳 Dados do Cartão]
    C -->|PIX| E[📱 Chave PIX]
    C -->|Boleto| F[🧾 Dados Pessoais]
    
    D --> G[🔒 PagamentoService]
    E --> G
    F --> G
    
    G --> H[💾 Salvar Reserva]
    H --> I[📧 Email Confirmação]
    I --> J[✅ BookingConfirmation]
```

### **🃏 Gestão de Cartões:**

```mermaid
graph LR
    A[💳 Inserir Cartão] --> B[🔒 Validação]
    B --> C[🎭 Mascarar Número]
    C --> D[💾 Salvar Seguro]
    
    E[🔄 Reutilizar] --> F[🔍 Buscar Salvos]
    F --> G[🔐 CVV Necessário]
```

---

## 📧 **SISTEMA DE EMAILS**

### **📮 Templates de Email:**

```mermaid
graph TB
    A[📧 EmailService] --> B{Tipo de Email}
    
    B -->|Confirmação| C[✅ booking-confirmation.html]
    B -->|Recuperação| D[🔑 password-reset.html]
    B -->|Boas-vindas| E[👋 welcome.html]
    
    C --> F[📤 MailKit SMTP]
    D --> F
    E --> F
```

---

## 📱 **RESPONSIVIDADE E DESIGN**

### **🎨 Sistema de Design:**

```mermaid
graph LR
    A[🎨 Tailwind CSS] --> B[📱 Mobile First]
    B --> C[💻 Desktop]
    C --> D[🖥️ Large Screens]
    
    E[🎯 Design Tokens] --> F[🧡 Primary: #F28C38]
    F --> G[⚫ Dark Mode Support]
```

### **📐 Breakpoints:**

| Dispositivo | Tamanho | Classes Tailwind |
|-------------|---------|------------------|
| 📱 Mobile | < 640px | `mobile-first` |
| 📱 Tablet | 640px+ | `sm:` |
| 💻 Laptop | 1024px+ | `lg:` |
| 🖥️ Desktop | 1280px+ | `xl:` |

---

## 🧪 **QUALIDADE E TESTES**

### **✅ Padrões de Qualidade:**

```mermaid
graph TB
    A[📝 Clean Code] --> B[🏗️ SOLID Principles]
    B --> C[🧪 Repository Pattern]
    C --> D[🔧 Dependency Injection]
    D --> E[📊 DTO Validation]
    E --> F[🛡️ Error Handling]
```

### **🔍 Validações Implementadas:**

- ✅ **Front-end:** Validação em tempo real de formulários
- ✅ **Back-end:** Model validation com Data Annotations
- ✅ **Banco:** Constraints e foreign keys
- ✅ **Autenticação:** JWT validation em todas as rotas protegidas

---

## 🚀 **DEPLOY E AMBIENTES**

### **🌍 Ambientes:**

```mermaid
graph LR
    A[💻 Development] --> B[🧪 Testing]
    B --> C[🎭 Staging]
    C --> D[🚀 Production]
    
    E[📦 LocalDB] --> F[🌐 SQL Server]
    G[🔧 Vite Dev] --> H[📦 Build Static]
```

### **⚙️ Configurações por Ambiente:**

| Ambiente | Database | URL | Build |
|----------|----------|-----|-------|
| **Dev** | LocalDB | localhost:5295 | Hot Reload |
| **Prod** | SQL Server | decolatour.com | Optimized |

---

## 📊 **MÉTRICAS E MONITORAMENTO**

### **📈 KPIs do Sistema:**

- 🚀 **Performance:** < 2s loading time
- ♿ **Acessibilidade:** WCAG 2.1 AA compliant
- 📱 **Responsividade:** 100% dispositivos suportados
- 🔒 **Segurança:** JWT + BCrypt + HTTPS
---

### **🧑‍💻 Desenvolvedores:**

- **Back-end:** Arquitetura .NET 9 com Clean Architecture
- **Front-end:** React.js com foco em UX/UI
- **Database:** SQL Server com Entity Framework Migrations


---

**📅 Data da documentação:** 07/08/2025  
**🔄 Última atualização:** Implementação completa do sistema de acessibilidade  
**📝 Responsável:** Equipe DecolaTour
