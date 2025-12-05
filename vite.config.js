import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Redireciona todas as requisições que começam com /api
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Desativa SSL (bom para desenvolvimento local)
        // Opcional: reescreve o caminho se necessário, mas geralmente não é preciso
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      }
    }
  }
})