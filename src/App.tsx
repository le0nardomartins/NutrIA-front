import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import FoodAnalysis from './pages/FoodAnalysis';
import Profile from './pages/Profile';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Redirecionar a raiz para welcome */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login onLogin={() => {}} />} />
          </Route>
          
          <Route path="/register" element={<AuthLayout />}>
            <Route index element={<Register />} />
          </Route>

          {/* App Routes */}
          <Route element={<AppLayout onLogout={() => {}} />}>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/analysis" element={<FoodAnalysis />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Rota para lidar com páginas não encontradas */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
              <p className="mb-6">A página que você está procurando não existe.</p>
              <a href="/welcome" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Voltar para a página inicial
              </a>
            </div>
          } />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
