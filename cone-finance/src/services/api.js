import axios from 'axios';

// 1. Configuração da URL Base
// Use '/api' para que o proxy do Vue/Vite funcione perfeitamente.
const API_BASE_URL = '/api'; 

// Cria uma instância configurada do Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. INTERCEPTOR DE REQUISIÇÃO (Para Enviar o Token)
// Esta função é executada antes de cada requisição ser enviada.
api.interceptors.request.use(
    (config) => {
        // Pega o token do armazenamento local (onde foi salvo no login)
        const token = localStorage.getItem('userToken'); 

        // 🚨 CRUCIAL: Se o token existe, ele é anexado ao cabeçalho 'Authorization' 
        // no formato esperado pelo seu backend (Bearer <token>).
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. INTERCEPTOR DE RESPOSTA (Para Lidar com Erros 401)
// Esta função é executada em cada resposta do servidor.
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        
        // Verifica se o erro é 401 (Não Autorizado) e se não é a própria rota de login
        if (error.response.status === 401 && originalRequest.url !== '/api/login') {
            // 🛑 Lógica de Logout
            
            // 1. (O SEU ALERT AQUI): 
            alert('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
            
            // 2. Limpa o token e força o logout
            localStorage.removeItem('userToken');
            
            // 3. Redireciona para a página de login (depende do seu roteador Vue)
            // (Você deve substituir window.location por router.push('/login') no Vue)
            window.location.href = '/login'; 
        }

        return Promise.reject(error);
    }
);

export default api;