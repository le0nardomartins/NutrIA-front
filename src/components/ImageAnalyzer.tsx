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
  const [parsedAnalysis, setParsedAnalysis] = useState<NutritionalAnalysis | null>(null);
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
      setParsedAnalysis(null);
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
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Análise Nutricional</h2>
      
      {/* Entrada de arquivo oculta */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="hidden" 
        ref={fileInputRef}
      />
      
      {/* Área de upload de imagem */}
      <div 
        className={`w-full border-2 border-dashed rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-center cursor-pointer
          ${previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-300 bg-gray-50 hover:bg-green-50'}`}
        onClick={handleSelectImageClick}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 max-w-full mb-3 rounded-lg" 
            />
            <p className="text-sm text-gray-600">Clique para selecionar outra imagem</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 md:py-8">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-1">Selecione uma imagem</p>
            <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
          </div>
        )}
      </div>
      
      {/* Opção para usar dados do perfil */}
      {userProfile && (
        <div className="w-full mb-4 md:mb-6 flex items-center">
          <input
            type="checkbox"
            id="useProfileData"
            checked={useProfileData}
            onChange={handleToggleProfileData}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="useProfileData" className="ml-2 text-sm text-gray-700">
            Usar meus dados de perfil para personalizar a análise
          </label>
        </div>
      )}
      
      {/* Botão de análise */}
      <button
        onClick={handleAnalyzeClick}
        disabled={!selectedImage || loading}
        className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center
          ${!selectedImage || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analisando...
          </>
        ) : (
          'Analisar Imagem'
        )}
      </button>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <p>{error}</p>
        </div>
      )}
      
      {/* Resultados da análise */}
      {parsedAnalysis && (
        <div className="w-full mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">Resultados da Análise</h3>
          
          {/* Calorias e macronutrientes */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Calorias</h4>
              <span className="text-lg font-bold text-green-700">{parsedAnalysis.calorias} kcal</span>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2">Macronutrientes</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Carboidratos</p>
                <p className="font-semibold text-gray-800">{parsedAnalysis.macronutrientes.carboidratos_g}g</p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Proteínas</p>
                <p className="font-semibold text-gray-800">{parsedAnalysis.macronutrientes.proteinas_g}g</p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Gorduras</p>
                <p className="font-semibold text-gray-800">{parsedAnalysis.macronutrientes.gorduras_g}g</p>
              </div>
            </div>
          </div>
          
          {/* Ingredientes */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Ingredientes Identificados</h4>
            <ul className="bg-white border border-gray-200 rounded-lg p-3 list-disc pl-5 text-sm text-gray-700">
              {parsedAnalysis.ingredientes.map((ingrediente, index) => (
                <li key={index} className="mb-1">{ingrediente}</li>
              ))}
            </ul>
          </div>
          
          {/* Recomendações */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Recomendações</h4>
            <ul className="bg-white border border-gray-200 rounded-lg p-3 list-disc pl-5 text-sm text-gray-700">
              {parsedAnalysis.recomendacoes.map((recomendacao, index) => (
                <li key={index} className="mb-1">{recomendacao}</li>
              ))}
            </ul>
          </div>
          
          {/* Comentário da Nutria */}
          {parsedAnalysis.comentario_nutria && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                Comentário da NutrIA
              </h4>
              <p className="text-sm text-gray-700">{parsedAnalysis.comentario_nutria}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Análise em texto (caso não consiga fazer parse do JSON) */}
      {analysis && !parsedAnalysis && (
        <div className="w-full mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">Resultados da Análise</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
      
      {/* Link para o perfil */}
      {!userProfile && analysis && (
        <div className="w-full mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Para obter recomendações personalizadas, 
            <Link to="/profile" className="ml-1 text-green-600 hover:text-green-800 underline">
              configure seu perfil nutricional
            </Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer; 