# 🎓 Senac - Frontend PWA (Portal Acadêmico)

Este repositório contém a interface web (Progressive Web App) desenvolvida para o **Sistema de Gestão de Atividades Complementares**. O foco principal é oferecer uma experiência fluida para que alunos submetam seus certificados e coordenadores realizem a auditoria de horas.

---

## 🛠️ Tecnologias Utilizadas

A aplicação foi construída utilizando as melhores práticas de desenvolvimento moderno:

* **React + Vite:** Ambiente de desenvolvimento de alta performance.
* **Tailwind CSS & Shadcn UI:** Estilização baseada em utilitários e componentes de interface consistentes.
* **Lucide React:** Conjunto de ícones minimalistas e otimizados.
* **Axios:** Cliente HTTP para comunicação com a API REST em Java.
* **React Router Dom:** Gerenciamento de navegação e proteção de rotas.

---

## ⚙️ Pré-requisitos

Para rodar o frontend, você precisará de:
* [Node.js](https://nodejs.org/) instalado (recomenda-se a versão 18 ou superior).
* O backend (Spring Boot) rodando localmente na porta `8080`.

---

## 🚀 Como Rodar o Projeto

Siga estes dois passos principais para colocar a interface de pé:

### 1. Instalar as Dependências
Abra o terminal na pasta raiz do projeto e execute:

```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
Após a instalação, inicie o Vite:

```bash
npm run dev
```

O sistema estará disponível em: 👉 [http://localhost:5173](http://localhost:5173)

---

## 🔌 Integração com a API

A aplicação consome os dados da API Java de forma assíncrona. 

**Pontos de Atenção:**
* **CORS:** O backend deve estar configurado para permitir requisições da origem `http://localhost:5173`.
* **Endpoints:** As rotas de submissão e avaliação apontam para o `localhost:8080`. Certifique-se de que o backend foi iniciado antes de testar as funcionalidades de rede.

---

## 📁 Estrutura de Pastas (Principais)

```text
src/
├── components/     # Componentes reutilizáveis (UI)
├── views/          # Páginas principais da aplicação
├── services/       # Configuração do Axios e chamadas à API
├── hooks/          # Hooks customizados
└── App.tsx         # Configuração de rotas e provedores
```
