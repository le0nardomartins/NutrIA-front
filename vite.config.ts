import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Configuração para redirecionar todas as requisições para index.html
    // para que o React Router possa lidar com as rotas do lado do cliente
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Configuração de build para garantir que o roteamento funcione em produção
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Gerar arquivo 404.html que redireciona para index.html
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
