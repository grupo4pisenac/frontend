import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.removeItem('@EduManage:token');
    localStorage.removeItem('@EduManage:perfil');
    localStorage.removeItem('@EduManage:nome');

    try {
      const response = await api.post('/auth/login', { email, senha });

      const { token, perfil, nome } = response.data;

      localStorage.setItem('@EduManage:token', token);
      localStorage.setItem('@EduManage:perfil', perfil);
      localStorage.setItem('@EduManage:nome', nome);

      // Redireciona por perfil
      if (perfil === 'SUPER_ADMIN') {
        navigate('/app/super');
      } else if (perfil === 'COORDENADOR') {
        navigate('/app/coord');
      } else {
        alert('Perfil não autorizado nesta plataforma.');
        localStorage.clear();
      }

    } catch (error) {
      console.error(error);
      alert('Falha no login. Verifique suas credenciais e se o servidor está respondendo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-5 w-full max-w-sm"
      >
        <div className="text-center mb-2">
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