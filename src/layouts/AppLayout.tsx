import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCamera, FaSignOutAlt, FaUser, FaBars, FaTimes, FaArrowUp } from 'react-icons/fa';

interface AppLayoutProps {
  onLogout?: () => void;
}

const AppLayout = ({ onLogout }: AppLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.classList.remove('menu-open');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Limpar a classe menu-open quando o componente é desmontado
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  // Mostrar botão de voltar ao topo quando o usuário rolar para baixo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header com menu superior */}
      <motion.header 
        className="bg-white shadow-md sticky top-0 z-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center"
            >
              <img 
                src="/logo.png" 
                alt="NutrIA Logo" 
                className="w-8 h-8 object-contain mr-2"
              />
              <span className="text-primary text-xl md:text-2xl font-bold">NutrIA</span>
            </motion.div>
          </div>
          
          {/* Menu de navegação desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/welcome" 
              className={({ isActive }) => 
                `flex items-center space-x-1 py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary bg-green-50 font-medium' 
                    : 'text-gray-600 hover:text-primary hover:bg-green-50'
                }`
              }
            >
              <FaHome className="text-lg" />
              <span>Início</span>
            </NavLink>
            
            <NavLink 
              to="/analysis" 
              className={({ isActive }) => 
                `flex items-center space-x-1 py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary bg-green-50 font-medium' 
                    : 'text-gray-600 hover:text-primary hover:bg-green-50'
                }`
              }
            >
              <FaCamera className="text-lg" />
              <span>Análise</span>
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center space-x-1 py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary bg-green-50 font-medium' 
                    : 'text-gray-600 hover:text-primary hover:bg-green-50'
                }`
              }
            >
              <FaUser className="text-lg" />
              <span>Perfil</span>
            </NavLink>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 py-2 px-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          </div>

          {/* Botão de menu mobile */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Cabeçalho do menu */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <img 
                      src="/logo.png" 
                      alt="NutrIA Logo" 
                      className="w-8 h-8 object-contain mr-2"
                    />
                    <span className="text-primary text-xl font-bold">NutrIA</span>
                  </div>
                  <button 
                    className="text-gray-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fechar menu"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                {/* Links do menu */}
                <div className="flex-grow overflow-y-auto py-2">
                  <NavLink 
                    to="/welcome" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 py-3 px-4 border-b border-gray-100 ${
                        isActive 
                          ? 'text-primary bg-green-50 font-medium' 
                          : 'text-gray-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaHome className="text-lg" />
                    <span>Início</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/analysis" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 py-3 px-4 border-b border-gray-100 ${
                        isActive 
                          ? 'text-primary bg-green-50 font-medium' 
                          : 'text-gray-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaCamera className="text-lg" />
                    <span>Análise</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `flex items-center space-x-3 py-3 px-4 border-b border-gray-100 ${
                        isActive 
                          ? 'text-primary bg-green-50 font-medium' 
                          : 'text-gray-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="text-lg" />
                    <span>Perfil</span>
                  </NavLink>
                </div>
                
                {/* Botão de sair */}
                <div className="p-4 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 py-3 px-4 text-red-500 w-full rounded-lg hover:bg-red-50"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Overlay para fechar o menu ao clicar fora */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
              onClick={() => {
                setMobileMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer mobile */}
      <footer className="md:hidden bg-white border-t border-gray-200 py-2 text-center text-xs text-gray-500">
        Tecnologia do Grupo Lumina
      </footer>

      {/* Botão de voltar ao topo */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="md:hidden fixed bottom-20 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-30"
            aria-label="Voltar ao topo"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout; 