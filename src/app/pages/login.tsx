import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- MODO DE TESTE (SEM BACK-END) ---
    // Vai pular a validação e entrar direto pra você testar o visual e o Logout:
    localStorage.setItem('@EduManage:token', 'token-fake-teste');
    navigate('/app'); 

    /* 
    // --- MODO PRODUÇÃO (COM BACK-END REAL) ---
    // try {
    //   const response = await api.post('/auth/login', { email, senha });
    //   localStorage.setItem('@EduManage:token', response.data.token || response.data);
    //   navigate('/app'); 
    // } catch (error) {
    //   console.error(error);
    //   alert('Falha no login. Verifique seu e-mail e senha e se o backend está rodando.');
    // }
    */
  };

  return (
    // Fundo da tela ocupando 100% da altura, centralizando tudo e com padding no mobile
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      
      {/* Container do formulário: largura total (w-full), mas com limite máximo (max-w-sm) */}
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-5 w-full max-w-sm"
      >
        <div className="text-center mb-2">
          {/* Logo do Senac direto da Wikipedia (sempre em alta qualidade) */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/8/86/Senac_logo.svg" 
            alt="Logo Senac" 
            className="h-16 w-auto mx-auto mb-3 block object-contain" 
          />
          <p className="text-gray-500 text-sm font-medium">Gestão de Alunos</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">E-mail</label>
          <input 
            type="email" 
            placeholder="exemplo@senac.com.br" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb8220] transition-shadow"
            required 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb8220] transition-shadow"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-[#eb8220] hover:bg-[#d67219] text-white rounded-md font-bold text-base mt-2 transition-colors"
        >
          ENTRAR
        </button>
      </form>
    </div>
  );
}