import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaLeaf, FaRobot } from 'react-icons/fa';

// Interface para os dados do perfil do usuário
interface UserProfileData {
  birthDate?: string;
  age?: number | null;
  weight?: string;
  height?: string;
  healthIssues?: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
  nutritionalInfo?: string;
  goal?: string;
}

// Estilo para posicionar o widget no canto inferior direito
const widgetStyle = `
  .elevenlabs-convai-widget {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 1000 !important;
  }
`;

const Welcome = () => {
  const [currentTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  
  // Carregar dados do perfil do usuário
  useEffect(() => {
    const savedData = localStorage.getItem('userProfileData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserProfile(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    }
  }, []);
  
  // Determinar saudação baseada na hora do dia
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Dicas nutricionais
  const tips = [
    "Beba bastante água durante o dia para manter-se hidratado.",
    "Inclua pelo menos 5 porções de frutas e vegetais por dia.",
    "Prefira alimentos integrais aos refinados.",
    "Reduza o consumo de açúcar e alimentos ultraprocessados.",
    "Mantenha um equilíbrio entre proteínas, carboidratos e gorduras saudáveis."
  ];
  
  // Selecionar uma dica aleatória
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // Preparar o prompt personalizado com os dados do perfil
  const getCustomPrompt = () => {
    if (!userProfile) return '';

    let customPrompt = 'Informações do usuário:\n';
    
    if (userProfile.age) {
      customPrompt += `- Idade: ${userProfile.age} anos\n`;
    }
    
    if (userProfile.weight) {
      customPrompt += `- Peso: ${userProfile.weight} kg\n`;
    }
    
    if (userProfile.height) {
      customPrompt += `- Altura: ${userProfile.height} cm\n`;
    }
    
    if (userProfile.goal) {
      const objetivos = {
        'perder': 'Perder peso',
        'manter': 'Manter peso',
        'ganhar': 'Ganhar peso',
        'ganhar_muscular': 'Ganhar massa muscular',
        'saude': 'Melhorar saúde geral'
      };
      customPrompt += `- Objetivo: ${objetivos[userProfile.goal as keyof typeof objetivos] || userProfile.goal}\n`;
    }
    
    if (userProfile.healthIssues && userProfile.healthIssues.length > 0) {
      const problemasSaude = userProfile.healthIssues
        .filter(issue => issue.selected)
        .map(issue => issue.name);
      
      if (problemasSaude.length > 0) {
        customPrompt += `- Problemas de saúde/restrições: ${problemasSaude.join(', ')}\n`;
      }
    }
    
    if (userProfile.nutritionalInfo) {
      customPrompt += `- Informações nutricionais adicionais: ${userProfile.nutritionalInfo}\n`;
    }

    return customPrompt;
  };
  
  // Efeito para configurar o widget da ElevenLabs Convai
  useEffect(() => {
    // Verificar se o widget já existe
    const existingWidget = document.querySelector('[data-convai-id="agent_01jxwkax8rejmtzzcftr3kxfvv"]');
    if (existingWidget) return;

    // Adicionar o estilo para posicionar o widget
    const styleElement = document.createElement('style');
    styleElement.textContent = widgetStyle;
    document.head.appendChild(styleElement);

    // Criar o elemento do script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Criar o elemento do widget
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', 'agent_01jxwkax8rejmtzzcftr3kxfvv');
    widget.classList.add('elevenlabs-convai-widget');
    
    // Adicionar dados do perfil como parâmetros personalizados
    const customPrompt = getCustomPrompt();
    if (customPrompt) {
      widget.setAttribute('custom-prompt', customPrompt);
    }
    
    // Adicionar o widget ao DOM após o carregamento do script
    script.onload = () => {
      document.body.appendChild(widget);
    };

    return () => {
      // Limpar o script e o estilo quando o componente for desmontado
      document.body.removeChild(script);
      document.head.removeChild(styleElement);
      
      // Remover o widget se existir
      const widgetElement = document.querySelector('.elevenlabs-convai-widget');
      if (widgetElement) {
        document.body.removeChild(widgetElement);
      }
    };
  }, [userProfile]);
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {getGreeting()}, <span className="text-primary">Usuário</span>!
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Bem-vindo ao NutrIA, seu assistente de nutrição inteligente.
        </p>
      </motion.div>
      
      {/* Card de dica */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm mb-6 md:mb-8 overflow-hidden border-l-4 border-secondary"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="p-3 md:p-4 flex items-start">
          <div className="bg-green-100 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
            <FaLeaf className="text-secondary text-lg md:text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-base md:text-lg mb-1">Dica do dia</h3>
            <p className="text-gray-600 text-sm md:text-base">{randomTip}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Card de ação */}
      <Link to="/analysis">
        <motion.div 
          className="bg-primary rounded-lg shadow-md text-white cursor-pointer p-4 md:p-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 md:p-4 rounded-full mr-3 md:mr-4 flex-shrink-0">
              <FaCamera className="text-white text-xl md:text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-1">Analisar refeição</h3>
              <p className="text-white text-opacity-90 text-sm md:text-base">
                Tire uma foto do seu prato para obter informações nutricionais detalhadas.
              </p>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Card do Assistente Virtual */}
      <motion.div 
        className="bg-white rounded-lg shadow-md mt-6 md:mt-8 p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center mb-3 md:mb-4">
          <div className="bg-green-100 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
            <FaRobot className="text-primary text-lg md:text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-lg md:text-xl">Assistente Virtual NutrIA</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Tire suas dúvidas sobre alimentação saudável e nutrição personalizada.
            </p>
          </div>
        </div>

        <div className="mt-3 md:mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-sm md:text-base text-gray-700">
            <span className="font-medium">Está com dúvidas sobre sua dieta?</span> Nosso assistente virtual pode ajudar com:
          </p>
          <ul className="mt-2 space-y-1 text-sm md:text-base text-gray-600 pl-5 list-disc">
            <li>Informações nutricionais de alimentos</li>
            <li>Dicas para dietas específicas</li>
            <li>Alternativas para restrições alimentares</li>
          </ul>
        </div>
        
        {!userProfile && (
          <div className="mt-3 md:mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              Para obter recomendações personalizadas, 
              <Link to="/profile" className="ml-1 text-primary hover:text-green-700 underline">
                configure seu perfil nutricional
              </Link>.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Welcome; 