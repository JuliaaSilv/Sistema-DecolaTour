# 🚀 Migração do Sistema de Banco de Dados

## ❗ **IMPORTANTE - LEIA ANTES DE CONTINUAR**

O sistema foi migrado para usar **Entity Framework Migrations** ao invés de recriar o banco a cada inicialização.

## 🎯 **O QUE MUDOU:**

**ANTES:**
- ❌ Banco era **deletado e recriado** a cada reinicialização
- ❌ **Todos os dados** eram perdidos
- ❌ Apenas dados mockados eram mantidos

**AGORA:**
- ✅ Banco **persiste** entre reinicializações
- ✅ **Seus dados** são mantidos
- ✅ Dados iniciais inseridos apenas **uma vez**

## 📋 **DADOS INICIAIS (inseridos automaticamente):**

### **Tipos de Usuário:**
- Cliente
- Administrador  
- Atendente

### **Usuários de exemplo:**
- **admin@decolatour.com** (senha: admin123) - Administrador
- **atendente@decolatour.com** (senha: admin123) - Atendente

### **Dados de exemplo:**
- ✅ Sistema limpo - apenas usuários administrativos básicos
- ✅ Sem pacotes ou reservas de exemplo
- ✅ Pronto para cadastro de dados reais

## 🔧 **COMANDOS PARA A EQUIPE:**

### **1. Primeira vez após git pull:**

```bash
# Navegar para a pasta backend
cd backend

# Aplicar todas as migrations pendentes
dotnet ef database update

# Iniciar o servidor
dotnet run
```

### **2. Se der problema com migrations:**

```bash
# Verificar status das migrations
dotnet ef migrations list

# Se necessário, deletar o banco local e recriar
dotnet ef database drop
dotnet ef database update
```

### **3. Para criar novas migrations (quando alterar models):**

```bash
# Criar nova migration
dotnet ef migrations add DescricaoDaMudanca

# Aplicar a migration
dotnet ef database update
```

## ⚠️ **CUIDADOS:**

1. **NÃO delete** a pasta `Migrations/`
2. **Sempre aplique** `dotnet ef database update` após git pull
3. **Seus dados agora persistem** - não serão perdidos
4. **Dados iniciais** são inseridos automaticamente apenas na primeira vez

## 🐛 **Em caso de problemas:**

1. Deletar arquivo `DB_DecolaTuor.mdf` (se existir)
2. Executar `dotnet ef database update`
3. Iniciar o servidor normalmente

## 📞 **Dúvidas:**

Em caso de problemas, consulte este arquivo ou peça ajuda.

---

**Data da migração:** 05/08/2025
**Responsável:** [Alcides Neto]
