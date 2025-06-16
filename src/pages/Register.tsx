import { Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

const Register = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-black mb-4">Criar Conta</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <FaInfoCircle className="text-primary text-2xl" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
        <p className="text-gray-700 mb-4">
          Para criar uma conta no sistema NutrIA, é necessário solicitar acesso ao departamento de RH da empresa.
        </p>
        <p className="text-gray-700 mb-4">
          Entre em contato com o RH para obter suas credenciais de acesso.
        </p>
      </div>
      
      <div className="mt-6">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 