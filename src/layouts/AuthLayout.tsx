import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Cabeçalho mobile */}
      <div className="md:hidden flex flex-col items-center justify-center p-6 bg-primary">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="mb-4 relative flex justify-center items-center"
        >
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="NutrIA Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white"
        >
          NutrIA
        </motion.h1>
      </div>

      <div className="flex flex-1">
        {/* Lado esquerdo - Formulário */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
          
          {/* Rodapé com "Tecnologia do Grupo Lumina" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            Tecnologia do Grupo Lumina
          </motion.div>
        </div>
        
        {/* Lado direito - Logo e jargão (apenas desktop) */}
        <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center relative">
          <div className="text-center p-12 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="mb-12 relative flex justify-center items-center"
              style={{ height: '300px' }}
            >
              {/* Círculo branco simples */}
              <div className="absolute bg-white rounded-full w-60 h-60 flex items-center justify-center"></div>
              
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="NutrIA Logo" 
                className="relative z-10"
                style={{ 
                  width: '305px', 
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <h1 className="text-5xl font-bold text-white mb-4">NutrIA</h1>
              <p className="text-white text-xl">
                Inteligência artificial a serviço da sua saúde nutricional
              </p>
              
              {/* Adicionando "Tecnologia do Grupo Lumina" */}
              <p className="text-white text-sm mt-8 opacity-80">
                Tecnologia do Grupo Lumina
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 