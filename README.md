# 🎥 Movie Database - Gestão de Filmes com React, RxDB e WebSocket

**Movie Manager** é uma aplicação web para gerenciamento de filmes, permitindo visualizar, adicionar, editar, avaliar e deletar filmes. O projeto utiliza tecnologias modernas para criar uma experiência reativa, escalável e sincronizada em tempo real.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React**: Biblioteca para construção de interfaces de usuário reativas.
- **React Context API**: Gerenciamento de estado global para compartilhamento de dados entre componentes.
- **RxDB (Reactive Database)**: Banco de dados reativo para sincronização e armazenamento local.
  - **Dexie.js**: Usado como driver de armazenamento via IndexedDB.
  - **Query Builder Plugin**: Para realizar consultas avançadas no banco de dados.
  - **Validate Ajv Plugin**: Validação de esquemas com JSON Schema.
  - **Dev Mode Plugin**: Fornece ferramentas para depuração em ambiente de desenvolvimento.
- **WebSocket**: Comunicação bidirecional em tempo real para sincronização de dados entre cliente e servidor.
- **RxDB Hooks**: Hooks para integração do RxDB com React, otimizando as consultas e reatividade.

### **Backend**
- **API RESTful**: Criada para gerenciar filmes com operações CRUD (Create, Read, Update, Delete).
- **WebSocket Server**: Responsável por enviar atualizações em tempo real para o frontend.

### **Outras Dependências**
- **React Scripts**: Ferramentas para configuração e execução da aplicação React.
- **RxJS**: Biblioteca para programação reativa com observables.

---

## 📦 Funcionalidades
- **Gerenciamento de Filmes**:
  - Adicionar novos filmes com informações como nome, descrição, duração e imagem.
  - Editar informações de filmes existentes.
  - Avaliar filmes com um sistema de estrelas (1 a 5).
  - Excluir filmes.

- **Reatividade e Sincronização**:
  - A aplicação utiliza o RxDB para manter os dados sincronizados em tempo real com o backend e o WebSocket para refletir mudanças em todos os clientes conectados.

- **Offline-First**:
  - Com o RxDB, o app permite que os dados sejam acessados e manipulados mesmo sem conexão com a internet.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v16 ou superior)
- NPM ou Yarn
- Backend configurado com suporte a API REST e WebSocket

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/movie-manager.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto:
   ```bash
   npm start
   ```

---

