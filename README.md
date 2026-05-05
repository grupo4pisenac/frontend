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
