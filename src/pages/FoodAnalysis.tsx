import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { FaCamera, FaUpload, FaRedo, FaCheck, FaSpinner } from 'react-icons/fa';
import NutritionCard from '../components/NutritionCard';

// Componentes estilizados
const CameraContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
`;

const FileInput = styled.input`
  display: none;
`;

// Dados simulados de análise nutricional
const mockAnalysisResult = {
  name: 'Salada com frango grelhado',
  calories: 320,
  nutrients: [
    { name: 'Proteínas', value: '28g' },
    { name: 'Carboidratos', value: '12g' },
    { name: 'Gorduras', value: '14g' },
    { name: 'Fibras', value: '6g' },
    { name: 'Sódio', value: '320mg' },
    { name: 'Vitamina C', value: '45mg' },
    { name: 'Ferro', value: '2.5mg' },
    { name: 'Cálcio', value: '120mg' }
  ]
};

const FoodAnalysis = () => {
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload'>('camera');
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Capturar foto da webcam
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setFoodImage(imageSrc);
    }
  }, [webcamRef]);
  
  // Lidar com upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reiniciar processo
  const resetCapture = () => {
    setFoodImage(null);
    setAnalysisResult(null);
  };
  
  // Analisar a imagem (simulação)
  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulação de análise com delay
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
    }, 2000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-1">Análise Nutricional</h1>
        <p className="text-gray-600">
          Tire uma foto ou faça upload de uma imagem do seu prato para análise.
        </p>
      </motion.div>
      
      {!foodImage ? (
        <>
          {/* Opções de captura */}
          <div className="flex mb-6 bg-white rounded-lg shadow-sm p-1">
            <button
              className={`flex-1 py-3 rounded-lg transition-all ${
                captureMode === 'camera' ? 'bg-primary text-white' : 'text-gray-600'
              }`}
              onClick={() => setCaptureMode('camera')}
            >
              <FaCamera className="inline mr-2" /> Câmera
            </button>
            <button
              className={`flex-1 py-3 rounded-lg transition-all ${
                captureMode === 'upload' ? 'bg-primary text-white' : 'text-gray-600'
              }`}
              onClick={() => setCaptureMode('upload')}
            >
              <FaUpload className="inline mr-2" /> Upload
            </button>
          </div>
          
          {/* Captura de câmera */}
          {captureMode === 'camera' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CameraContainer className="mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                  className="w-full rounded-lg"
                />
              </CameraContainer>
              <button
                onClick={capturePhoto}
                className="btn btn-primary w-full"
              >
                <FaCamera className="mr-2" /> Tirar Foto
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="bg-white rounded-lg shadow-sm mb-4 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300">
                <FaUpload className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Clique para selecionar uma imagem</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  Selecionar Arquivo
                </button>
                <FileInput
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Imagem capturada */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <div className="mb-4">
              <img
                src={foodImage}
                alt="Alimento para análise"
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={resetCapture}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center"
              >
                <FaRedo className="mr-2" /> Nova Foto
              </button>
              
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className={`flex-1 py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" /> Analisando...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Analisar
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Resultados da análise */}
          {analysisResult && (
            <NutritionCard 
              foodName={analysisResult.name}
              calories={analysisResult.calories}
              nutrients={analysisResult.nutrients}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FoodAnalysis; 