import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // importa o router

createApp(App)
  .use(router) // registra o router
  .mount('#app')
