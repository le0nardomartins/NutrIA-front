import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      onLogin({ email });
      window.location.href = '/welcome';
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-2">Entrar</h2>
      <p className="text-gray-600 mb-8">Análise nutricional inteligente para suas refeições</p>
      
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