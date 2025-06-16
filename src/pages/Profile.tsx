import { motion } from 'framer-motion';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Perfil Nutricional
      </h1>
      
      <UserProfile />
    </motion.div>
  );
};

export default Profile; 