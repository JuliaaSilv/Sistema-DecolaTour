# Sistema de Agência de Viagens (Backend).

Esta pasta trata do backend relacionado ao sistema de agências de viagens. Segue alguns detalhes técnicos e instruções para rodar.

# Pré-Requisitos

* .Net
* vscode
* Git Client

# Detalhes técnicos

A aplicação usa Entity Framework, o que significa que as classes feitas em C# são mapeadas para tabelas no banco de dados automaticamente se elas não existire, sem a necessidade de uso de um script específico para gerar o banco e criar as tabelas. A geração do banco e criação das tabelas é feita de forma automática assim que se roda a aplicação.

# Passos para executar o backend.

Em uma pasta escolhida para trabalho, no terminal execute:

```
git clone https://github.com/JuliaaSilv/Sistema-De-Viagem
cd Sistema-De-Viagem\back-end
```

Na pasta do sistema você precisa instalar alguns pacotes, na pasta do repositório que foi clonado, no terminal execute:

```
dotnet restore
```

Agora só é necessario rodar aplicação.

Se conecte ao banco para ver que as tabelas foram criadas e rodar o script de inserção inicial de dados que esta na pasta /Scripts



