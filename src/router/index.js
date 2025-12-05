import { createRouter, createWebHistory } from 'vue-router'


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
        {
            path:'/usuariocadastrado',
            name:'usuariocadastrado',
            component: () => import('../views/UsuarioCadastrado/Index.vue')
        },
        {
            path:'/minhaconta',
            name:'minhaconta',
            component:() => import ('../views/UsuarioCadastrado/MinhaConta.vue')
        },
        {
            path:'/dashboard',
            name:'dashboard',
            component:() => import ('../views/UsuarioCadastrado/Dashboard.vue')
        }
    ],
})

export default router