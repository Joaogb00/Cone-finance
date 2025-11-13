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
   }
  ],
})

export default router
