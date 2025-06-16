import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { analyzeImage } from '../services/openaiService';
import { Link } from 'react-router-dom';

// Interface para os dados do perfil do usuário
interface UserProfileData {
  birthDate: string;
  age: number | null;
  weight: string;
  height: string;
  healthIssues: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
  nutritionalInfo: string;
  goal: string;
}

<<<<<<< HEAD
// Interface para os dados da análise nutricional
interface NutritionalAnalysis {
  calorias: number;
  macronutrientes: {
    carboidratos_g: number;
    proteinas_g: number;
    gorduras_g: number;
  };
  micronutrientes?: {
    [key: string]: number;
  };
  ingredientes: string[];
  recomendacoes: string[];
  comentario_nutria: string;
}

=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
// Estilo para posicionar o widget no canto inferior direito
const widgetStyle = `
  .elevenlabs-convai-widget {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 1000 !important;
  }
`;

const ImageAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
<<<<<<< HEAD
  const [parsedAnalysis, setParsedAnalysis] = useState<NutritionalAnalysis | null>(null);
=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [useProfileData, setUseProfileData] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do perfil do localStorage ao iniciar
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

  // Preparar o prompt personalizado com os dados do perfil
  const getCustomPrompt = () => {
    if (!userProfile || !useProfileData) return '';

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

  // Configurar o widget da ElevenLabs Convai quando a análise for concluída
  useEffect(() => {
    if (analysis) {
      // Remover widget existente se houver
      const existingWidget = document.querySelector('.elevenlabs-convai-widget');
      if (existingWidget) {
        document.body.removeChild(existingWidget);
      }

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
      
      // Adicionar a análise e os dados do perfil como parâmetros personalizados
      const customPrompt = getCustomPrompt();
      const initialPrompt = `Análise da imagem do alimento: ${analysis}\n\n${customPrompt}`;
      widget.setAttribute('custom-prompt', initialPrompt);
      
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
    }
  }, [analysis]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Criar URL para preview da imagem
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Limpar análise anterior
      setAnalysis(null);
<<<<<<< HEAD
      setParsedAnalysis(null);
=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
      setError(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      setError('Por favor, selecione uma imagem primeiro.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Enviar dados do perfil apenas se a opção estiver marcada e houver dados disponíveis
      const result = await analyzeImage(
        selectedImage, 
        useProfileData && userProfile ? userProfile : undefined
      );
<<<<<<< HEAD
      
      setAnalysis(result);
      
      // Tentar fazer o parse do JSON da resposta
      try {
        // Procurar por JSON na resposta
        const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || 
                         result.match(/```\n([\s\S]*?)\n```/) || 
                         result.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          const jsonString = jsonMatch[1] || jsonMatch[0];
          const parsedData = JSON.parse(jsonString);
          setParsedAnalysis(parsedData);
        } else {
          console.warn('Não foi possível encontrar JSON válido na resposta');
        }
      } catch (jsonError) {
        console.error('Erro ao fazer parse do JSON:', jsonError);
      }
      
=======
      setAnalysis(result);
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProfileData = () => {
    setUseProfileData(!useProfileData);
  };

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Analisador de Imagem</h2>
      
      <div className="w-full mb-4 md:mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        <button
          onClick={handleSelectImageClick}
          className="w-full py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          Selecionar Imagem
        </button>
      </div>

      {previewUrl && (
        <div className="w-full mb-4 md:mb-6">
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {userProfile && (
        <div className="w-full mb-4 md:mb-6 flex items-center">
          <input
            type="checkbox"
            id="useProfileData"
            checked={useProfileData}
            onChange={handleToggleProfileData}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
          />
          <label htmlFor="useProfileData" className="text-xs md:text-sm text-gray-700">
            Incluir dados do meu perfil na análise
          </label>
          
          {useProfileData && (
            <div className="ml-auto">
              <Link 
                to="/profile" 
                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Editar perfil
              </Link>
            </div>
          )}
        </div>
      )}

      {!userProfile && (
        <div className="w-full mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs md:text-sm text-yellow-700">
            Você ainda não configurou seu perfil nutricional. 
            <Link to="/profile" className="ml-1 text-blue-600 hover:text-blue-800 underline">
              Configurar agora
            </Link>
          </p>
        </div>
      )}

      <button
        onClick={handleAnalyzeClick}
        disabled={!selectedImage || loading}
        className={`w-full py-2 md:py-3 ${
          !selectedImage || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } text-white rounded-lg transition-colors mb-4 md:mb-6 text-sm md:text-base`}
      >
        {loading ? 'Analisando...' : 'Analisar Imagem'}
      </button>

      {error && (
        <div className="w-full p-3 md:p-4 bg-red-100 border border-red-300 rounded-lg mb-4 md:mb-6">
          <p className="text-xs md:text-sm text-red-700">{error}</p>
        </div>
      )}

<<<<<<< HEAD
      {parsedAnalysis && (
        <div className="w-full p-3 md:p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Resultado da Análise:</h3>
          
          {/* Calorias e Macronutrientes */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">Calorias:</h4>
              <span className="text-green-600 font-semibold">{parsedAnalysis.calorias} kcal</span>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2">Macronutrientes:</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-600">Carboidratos</div>
                <div className="font-semibold text-blue-600">{parsedAnalysis.macronutrientes.carboidratos_g}g</div>
              </div>
              <div className="bg-red-50 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-600">Proteínas</div>
                <div className="font-semibold text-red-600">{parsedAnalysis.macronutrientes.proteinas_g}g</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-600">Gorduras</div>
                <div className="font-semibold text-yellow-600">{parsedAnalysis.macronutrientes.gorduras_g}g</div>
              </div>
            </div>
          </div>
          
          {/* Micronutrientes */}
          {parsedAnalysis.micronutrientes && Object.keys(parsedAnalysis.micronutrientes).length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Micronutrientes:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(parsedAnalysis.micronutrientes).map(([key, value]) => (
                  <div key={key} className="bg-green-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-600">{key.replace(/_/g, ' ')}</div>
                    <div className="font-semibold text-green-600">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Ingredientes */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Ingredientes:</h4>
            <div className="flex flex-wrap gap-2">
              {parsedAnalysis.ingredientes.map((ingrediente, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {ingrediente}
                </span>
              ))}
            </div>
          </div>
          
          {/* Recomendações */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Recomendações:</h4>
            <ul className="list-disc pl-5 text-xs md:text-sm text-gray-700 space-y-1">
              {parsedAnalysis.recomendacoes.map((recomendacao, index) => (
                <li key={index}>{recomendacao}</li>
              ))}
            </ul>
          </div>
          
          {/* Comentário da Nutria */}
          {parsedAnalysis.comentario_nutria && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-1">Comentário da Nutria:</h4>
              <p className="text-xs md:text-sm text-gray-700">{parsedAnalysis.comentario_nutria}</p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs md:text-sm text-blue-700">
              Um assistente virtual foi ativado no canto inferior direito da tela.
              Converse com ele para tirar dúvidas sobre esta análise!
            </p>
          </div>
        </div>
      )}
      
      {analysis && !parsedAnalysis && (
=======
      {analysis && (
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
        <div className="w-full p-3 md:p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">Resultado da Análise:</h3>
          <pre className="whitespace-pre-wrap text-xs md:text-sm text-gray-700 overflow-x-auto">{analysis}</pre>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs md:text-sm text-blue-700">
              Um assistente virtual foi ativado no canto inferior direito da tela.
              Converse com ele para tirar dúvidas sobre esta análise!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer; 