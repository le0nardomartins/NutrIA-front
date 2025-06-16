import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

interface NutrientInfo {
  name: string;
  value: string;
}

interface NutritionCardProps {
  foodName: string;
  calories: number;
  nutrients: NutrientInfo[];
}

const NutritionCard = ({ foodName, calories, nutrients }: NutritionCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-primary text-white p-6">
        <h3 className="text-2xl font-bold mb-1">{foodName}</h3>
        <div className="flex items-center">
          <FaFire className="text-yellow-300 mr-2" />
          <span className="text-lg">{calories} kcal</span>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-4">Informações Nutricionais</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {nutrients.map((nutrient, index) => (
            <div key={index} className="border-b border-gray-100 pb-2">
              <div className="text-gray-600 text-sm">{nutrient.name}</div>
              <div className="font-medium">{nutrient.value}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            * Valores aproximados baseados em análise visual. Consulte um nutricionista para informações mais precisas.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionCard; 