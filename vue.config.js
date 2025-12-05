module.exports = {
  devServer: {
    // Redireciona todas as requisições que começam com /api
    // para o seu backend que está rodando na porta 3000.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Necessário para evitar erros de CORS/Headers
      }
    }
  }
}