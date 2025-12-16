import { createRouter, createWebHistory } from 'vue-router'

// 💡 Chave do Token para verificação de autenticação
const AUTH_TOKEN_KEY = 'userToken';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/',
            name:'Inicio',
            component: () => import('../components/Index.vue')
        },
        {
            path: '/cadastro',
            name:'cadastro',
            component: () => import('../views/Cadastrar.vue')
        },
        // 1. Rota Pai /usuariocadastrado
        {
            path:'/usuariocadastrado',
            name:'usuariocadastrado',
            component: () => import('../views/UsuarioCadastrado/Index.vue'),
            meta: { requiresAuth: true }, // Protege o Index (rota pai)
            
            // 🚀 Rotas Filhas para a URL Mascarada
            children: [
                { 
                    path: '', // ✅ CORREÇÃO: Removido o path '/home', usando o path vazio para ser o INDEX.
                    name: 'user_home', 
                    // Se o componente Index.vue tem o Header, este componente deve ser SÓ O CONTEÚDO 
                    // de boas-vindas, não o Index.vue (que é o layout pai).
                    // Mas manteremos Index.vue para não quebrar sua estrutura, assumindo que ele lida com isso.
                    component:null
                    
                },
                {
                    // URL Mascarada: /usuariocadastrado/minhaconta/TOKEN
                    path:'minhaconta/:id', 
                    name:'minhaconta', // Mantém o nome original da rota
                    component:() => import ('../views/UsuarioCadastrado/MinhaConta.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    // URL Mascarada: /usuariocadastrado/dashboard/TOKEN
                    path:'dashboard/:id',
                    name:'dashboard', // Mantém o nome original da rota
                    component:() => import ('../views/UsuarioCadastrado/Dashboard.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        
        // 2. Redirecionamentos para Rotas Antigas
        {
            path: '/minhaconta',
            redirect: () => {
                const token = localStorage.getItem(AUTH_TOKEN_KEY);
                return { name: 'minhaconta', params: { id: token || 'guest' } };
            }
        },
        {
            path: '/dashboard',
            redirect: () => {
                const token = localStorage.getItem(AUTH_TOKEN_KEY);
                return { name: 'dashboard', params: { id: token || 'guest' } };
            }
        }
    ],
})

// ----------------------------------------------------
// 🛡️ GUARDA DE ROTAS (Navegação Segura e Injeção do Token na URL)
// ----------------------------------------------------
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem(AUTH_TOKEN_KEY);

    if (to.meta.requiresAuth) {
        if (!isAuthenticated) {
            return next({ name: 'cadastro' });
        } else {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            
            // 1. CASO DE ROTAS COM ID (minhaconta ou dashboard)
            if (to.name === 'minhaconta' || to.name === 'dashboard') {
                if (to.params.id === undefined || to.params.id === 'guest' || to.params.id !== token) {
                    const destination = { name: to.name, params: { id: token } };
                    console.log('Redirecionando com token:', destination);
                    return next(destination);
                }
            } 
            
            // 2. CASO DA ROTA PRINCIPAL (usuariocadastrado ou user_home)
            if (to.name === 'usuariocadastrado' || to.name === 'user_home') {
                // ✅ CORRIGIDO: Permite navegação direta para o layout.
                return next(); 
            }
            
            // Caso padrão (ID já correto ou outra rota autenticada)
            next(); 
        }
    } else {
        next();
    }
});

export default router