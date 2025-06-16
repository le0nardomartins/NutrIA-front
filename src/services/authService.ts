const API_BASE_URL = 'https://nutria-back-production.up.railway.app/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  user?: User;
  token?: string;
  message?: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const url = `${API_BASE_URL}/auth/login`;
  const body = { email, password };
  
  // Exibir detalhes completos da requisição
  console.log('%c === DETALHES COMPLETOS DA REQUISIÇÃO DE LOGIN ===', 'background: #222; color: #bada55');
  console.log('URL:', url);
  console.log('Método: POST');
  console.log('Headers:', { 'Content-Type': 'application/json' });
  
  // Mostrar cada parâmetro separadamente para facilitar a depuração
  console.log('Parâmetros enviados:');
  console.log(' - email:', email);
  console.log(' - password:', password);
  
  // Mostrar o body completo
  console.log('Body (JSON):', JSON.stringify(body, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('%c === DETALHES DA RESPOSTA ===', 'background: #222; color: #bada55');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Não foi possível ler o corpo da resposta');
      console.log('Corpo da resposta de erro:', errorText);
      
      // Tentar analisar a resposta de erro como JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Erro JSON analisado:', errorJson);
        console.log('Mensagem de erro:', errorJson.message);
      } catch (jsonError) {
        console.log('Resposta de erro não é um JSON válido');
      }
      
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('Corpo da resposta de sucesso:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const saveUserToLocalStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const saveTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', token);
};

export const getUserFromLocalStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}; 