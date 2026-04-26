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
    // Use isso para testar o visual e entrar no sistema agora:
    localStorage.setItem('@EduManage:token', 'token-fake-teste');
    navigate('/app'); 

    /* // --- MODO PRODUÇÃO (COM BACK-END) ---
    // Seu amigo deve descomentar isso e comentar o modo de teste acima:
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('@EduManage:token', response.data.token);
      navigate('/app');
    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
    }
    */
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f4f4f7',
      fontFamily: 'sans-serif' 
    }}>
      <form onSubmit={handleLogin} style={{ 
        background: 'white', 
        padding: '2.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.2rem', 
        width: '350px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#004587', margin: 0, fontSize: '24px' }}>EduManage</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Painel do Coordenador</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>E-mail</label>
          <input 
            type="email" 
            placeholder="exemplo@senac.com.br" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', outlineColor: '#eb8220' }} 
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', outlineColor: '#eb8220' }} 
            required 
          />
        </div>

        <button type="submit" style={{ 
          padding: '1rem', 
          background: '#eb8220', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          fontSize: '15px',
          marginTop: '0.5rem',
          transition: 'background 0.2s'
        }}>
          ENTRAR NO SISTEMA
        </button>
      </form>
    </div>
  );
}