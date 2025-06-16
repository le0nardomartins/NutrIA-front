import { motion } from 'framer-motion';
import styled from 'styled-components';

interface FoodCardProps {
  name: string;
  calories: number;
  imageUrl: string;
  onClick?: () => void;
}

const CardContainer = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div<{ imageUrl: string }>`
  height: 180px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const CalorieTag = styled.span`
  display: inline-block;
  background: #4CAF50;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
`;

const FoodCard = ({ name, calories, imageUrl, onClick }: FoodCardProps) => {
  return (
    <CardContainer 
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardImage imageUrl={imageUrl} />
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <CalorieTag>{calories} calorias</CalorieTag>
      </CardContent>
    </CardContainer>
  );
};

export default FoodCard; 