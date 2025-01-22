# 🎥 Sistema de Gerenciamento de Filmes

Este projeto é um sistema completo para gerenciamento de filmes, desenvolvido utilizando tecnologias modernas, com foco em sincronização em tempo real e experiência offline-first. A aplicação possui backend em Django e frontend em React com RxDB.

---

## 🛠 Tecnologias Utilizadas

### 🔹 Frontend
- **React.js**: Biblioteca para construção de interfaces de usuário.
- **RxDB**: Banco de dados reativo local com suporte offline-first.
  - **IndexedDB** via **Dexie.js**: Motor de armazenamento local.
  - **RxDB Query Builder Plugin**: Consultas dinâmicas no banco de dados local.
- **RxDB Hooks**: Integração para usar RxDB com React.
- **WebSocket**: Sincronização em tempo real com o backend.

### 🔹 Backend
- **Django**: Framework web robusto.
- **Django REST Framework (DRF)**: Criação de APIs RESTful.
- **Django Channels**: Comunicação em tempo real via WebSocket.
- **SQLite**: Banco de dados relacional para persistência no backend.
- **Daphne**: Servidor ASGI para suporte a WebSocket e requisições assíncronas.

### 🔹 Infraestrutura
- **Docker**: Containerização para garantir consistência no ambiente de desenvolvimento e produção.
- **Makefile**: Automação de comandos no backend.
- **requirements.txt**: Lista de dependências Python necessárias para o backend.

---

## ✨ Funcionalidades

1. **Gerenciamento de Filmes (CRUD)**:
   - Adicionar, editar, excluir e visualizar filmes.
   - Avaliação de filmes com sistema de estrelas (1 a 5).

2. **Sincronização em Tempo Real**:
   - Alterações no backend são refletidas no frontend via WebSocket.

3. **Persistência Local com RxDB**:
   - Suporte offline-first para o frontend.

4. **Integração Backend-Frontend**:
   - API RESTful no backend para comunicação com o frontend.
   - Suporte a eventos em tempo real.

---

## 🚀 Pré-requisitos

- **Docker** instalado na máquina.
- **Python** (caso não utilize Docker).
- **Node.js** e **npm** instalados para executar o frontend.

---

## 🖥 Configuração e Execução

### ⚙️ Backend

1. **Clonar o repositório**:
   ```bash
   git clone <url-do-repo>
   cd <pasta-do-projeto>/backend
   ```

2. **Instalar dependências**:
   Caso não utilize Docker, instale as dependências do backend utilizando o arquivo `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar o banco de dados**:
   Aplicar as migrações para configurar o banco de dados:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Iniciar o servidor**:
   Utilize **Daphne** para executar o servidor:
   ```bash
   daphne movie_site.asgi:application --port 8001
   ```

5. **Usando Docker**:
   Inicie o backend utilizando Docker:
   ```bash
   docker-compose up --build
   ```

---

### 🖥 Frontend

1. **Navegar até a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar as dependências**:
   ```bash
   npm install
   ```

3. **Executar a aplicação**:
   ```bash
   npm start
   ```

---

## 📋 Observações

- Certifique-se de que o backend está rodando antes de iniciar o frontend.
- Caso necessário, configure variáveis de ambiente para apontar o frontend para a API backend (localhost ou IP do container Docker).
- SQLite é utilizado como banco de dados padrão no backend para simplificar o setup inicial.

---
