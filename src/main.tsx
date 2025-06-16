import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Função para lidar com redirecionamentos
const handleRedirect = () => {
  // Verificar se há um redirecionamento armazenado
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    // Limpar o redirecionamento
    sessionStorage.removeItem('redirect');
    // Navegar para a rota armazenada após a renderização
    setTimeout(() => {
      window.history.pushState({}, '', redirect);
    }, 0);
  }
};

// Executar a função de redirecionamento
handleRedirect();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
