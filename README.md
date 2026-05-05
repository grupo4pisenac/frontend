# 🎓 Senac Recife — Sistema de Gestão de Horas Complementares (PWA)

Interface web progressiva (PWA) desenvolvida para o gerenciamento de atividades complementares do Senac Recife. Permite que Super Admins e Coordenadores gerenciem cursos, regras, alunos e validações de horas complementares.

## 🔗 Links

* **Frontend (PWA):** [Acessar a aplicação](https://frontend-two-xi-zk2ps4oz7r.vercel.app/)
* **Backend (API):** [Acessar a API](https://backend-production-a784.up.railway.app)
* **Repositório Backend:** [GitHub - Grupo 4 API Senac](https://github.com/grupo4pisenac/backend)

---

## 🧩 Sobre o Projeto

O sistema é composto por duas aplicações integradas a um backend único:

* **PWA (este repositório):** Voltada para Super Admins e Coordenadores — gerenciamento de cursos, regras, alunos, coordenadores e validação de certificados.
* **App Mobile (React Native):** Destinado aos alunos para submissão de atividades complementares — repositório separado.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| :--- | :--- |
| **React + Vite** | Framework e ambiente de desenvolvimento de alta performance |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS + Shadcn/UI** | Estilização e componentes de interface consistentes |
| **Lucide React** | Ícones minimalistas e otimizados |
| **Axios** | Comunicação com a API REST em Java |
| **React Router DOM** | Gerenciamento de navegação e proteção de rotas por perfil |
| **Recharts** | Gráficos e visualizações do dashboard |

---

## 👤 Perfis de Acesso

| Perfil | Acesso |
| :--- | :--- |
| **SUPER_ADMIN** | Acesso total — cursos, regras, coordenadores, estudantes, submissões e dashboard |
| **COORDENADOR** | Acesso restrito — estudantes, submissões do seu curso e dashboard |

---

## ⚙️ Pré-requisitos

* **Node.js 18** ou superior — [nodejs.org](https://nodejs.org/)
* Acesso à internet (API hospedada no Railway)

---

## 🚀 Como Rodar o Projeto

**1. Instalar as dependências**
```bash
npm install
```

**2. Iniciar o servidor de desenvolvimento**
```bash
npm run dev
```
*A aplicação estará disponível em:* 👉 `http://localhost:5173`

**3. Build de produção**
```bash
npm run build
```

---

## 🔌 Integração com a API

A aplicação consome a API Java hospedada no Railway de forma assíncrona via Axios. 
O arquivo de configuração está em `src/services/api.ts`:

```typescript
// Produção (padrão)
baseURL: '[https://backend-production-a784.up.railway.app](https://backend-production-a784.up.railway.app)'

// Para desenvolvimento local (substituir temporariamente)
// baseURL: 'http://localhost:8080'
```
**Autenticação:** Todas as requisições autenticadas injetam automaticamente o token JWT via interceptor do Axios.

---

## 📁 Estrutura de Pastas

```text
src/
├── app/
│   └── components/              # Componentes de tela
│       ├── ui/                  # Componentes Shadcn/UI
│       ├── AnalisarSubmissoes.tsx
│       ├── ConfigurarRegrasSuperAdmin.tsx
│       ├── Coordenadores.tsx
│       ├── DashboardGlobal.tsx
│       ├── Estudantes.tsx
│       ├── GerenciarCursosSuperAdmin.tsx
│       └── SuperAdminLayout.tsx
├── pages/
│   └── login.tsx                # Tela de autenticação
├── services/
│   └── api.ts                   # Configuração Axios + interceptors JWT
├── routes.tsx                   # Rotas protegidas por perfil
├── App.tsx
└── main.tsx
```

---

## 📱 Funcionalidades

- [x] Login com autenticação JWT
- [x] Separação de acesso por perfil (Super Admin / Coordenador)
- [x] Gerenciamento de cursos
- [x] Configuração de regras de atividades por curso
- [x] Gerenciamento de coordenadores
- [x] Gerenciamento de estudantes
- [x] Analisar e aprovar/reprovar submissões de horas
- [x] Dashboard global com métricas em tempo real
- [x] Interface responsiva (mobile e desktop)
- [ ] Upload de certificados — *responsabilidade do app mobile*
- [ ] OCR de certificados — *em desenvolvimento no backend*

---

## 🌐 Deploy

A aplicação está configurada para deploy na **Vercel**, com deploy automático a cada push na branch `main`.

---

## 👥 Equipe — Grupo 4

**Projeto Integrador — Análise e Desenvolvimento de Sistemas (ADS 3)**
Senac Recife | Professor: Geraldo Gomes

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos no Senac Recife.
```
