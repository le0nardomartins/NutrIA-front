import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { loginUser, saveUserToLocalStorage, saveTokenToLocalStorage } from '../services/authService';

interface LoginProps {
  onLogin: (userData: any) => void;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtém a página de origem, se houver
  const from = (location.state as LocationState)?.from?.pathname || '/welcome';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    console.log('Enviando dados de login:', { email, password });
    
    try {
      // Enviamos email e senha para o backend
      const loginResult = await loginUser(email, password);
      console.log("Resultado do login:", loginResult);
      
      // Se o login for bem-sucedido, salvamos os dados do usuário
      if (loginResult.user) {
        saveUserToLocalStorage(loginResult.user);
        if (loginResult.token) {
          saveTokenToLocalStorage(loginResult.token);
        }
        onLogin(loginResult.user);
        navigate(from); // Redireciona para a página original
      } else {
        setError('Erro ao processar login. Tente novamente.');
      }
    } catch (err: any) {
      // Tentar extrair a mensagem de erro da resposta
      let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
      
      if (err.message && err.message.includes('401')) {
        errorMessage = 'Senha incorreta. Por favor, verifique suas credenciais.';
      } else if (err.message && err.message.includes('404')) {
        errorMessage = 'Usuário não encontrado. Verifique seu e-mail ou registre-se.';
      }
      
      setError(errorMessage);
      console.error('Erro de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-2">Entrar</h2>
      <p className="text-gray-600 mb-8">Análise nutricional inteligente para suas refeições</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 flex items-center">
            <FaEnvelope className="mr-2 text-primary" />
            <span>E-mail</span>
          </label>
          <input
            type="email"
            className="input"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 flex items-center">
            <FaLock className="mr-2 text-primary" />
            <span>Senha</span>
          </label>
          <input
            type="password"
            className="input"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className={`btn btn-primary w-full flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <FaSignInAlt className="mr-2" />
          )}
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 