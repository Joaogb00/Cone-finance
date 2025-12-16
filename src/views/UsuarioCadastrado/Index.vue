<template>
    <main id="fundo">
        <section>
            

            <div 
                class="welcome-content"
             v-if="$route.name === 'user_home'"
            >
                <h1 class="welcome-title">
                    Bem-vindo(a), <span class="user-name">{{ userName }}</span>!
                </h1>
                
                <p class="welcome-slogan">
                    "Cone-Finance: Sua bússola para decisões financeiras claras."
                </p>

                <div class="action-cards">
                    <router-link :to="{ name: 'dashboard', params: { id: $route.params.id } }" class="card-item fade-in-delay-1">
                        <i class="bi bi-arrow-up-circle"></i>
                        <h3>Adicionar Receita</h3>
                        <p>Registre seus ganhos rapidamente.</p>
                    </router-link>

                    <router-link :to="{ name: 'dashboard', params: { id: $route.params.id } }" class="card-item fade-in-delay-2">
                        <i class="bi bi-arrow-down-circle"></i>
                        <h3>Registrar Despesa</h3>
                        <p>Monitore cada gasto para manter o controle.</p>
                    </router-link>

                    <router-link :to="{ name: 'dashboard', params: { id: $route.params.id } }" class="card-item fade-in-delay-3">
                        <i class="bi bi-speedometer2"></i>
                        <h3>Ver Dashboard</h3>
                        <p>Visão geral instantânea das suas finanças.</p>
                    </router-link>
                </div>
            </div>
            
            <router-view></router-view>
            
        </section>
    </main>
    <Footer/>
</template>

<script>
// Ajustado para o caminho mais comum de componentes (assumindo que estão em src/components)
import Footer from '../../components/Footer.vue';
import HeaderCadastrado from '../UsuarioCadastrado/Header-cadastrado.vue'; // 🛑 CAMINHO CORRIGIDO

export default{
    name:'UsuarioCadastradoIndex', // Renomeado para melhor clareza (era 'Index')
    components:{
        HeaderCadastrado,
        Footer
    },
    data() {
        return {
            userName: '' 
        };
    },
    mounted() {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            this.userName = storedName.split(' ')[0];
        } else {
            this.userName = 'Cliente'; 
        }
    }
}
</script>
<style scoped>
#fundo {
  background-color: #000;
  height: 100vh;
  overflow: hidden;
  width: 100%;
}

section {
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.5)
    ),
    url("../../assets/img/img-de-olhodanota.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
  animation: fadeIn 2s ease-in-out forwards;
}

/* ===== CONTEÚDO DE BOAS-VINDAS ===== */
.welcome-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    width: 90%;
    max-width: 1200px;
    padding-top: 10vh; /* Espaço para o Header fixo */
}

.welcome-title {
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
    animation: floatIn 1.5s ease-out;
}

.user-name {
    color: #00aaff;
}

.welcome-slogan {
    font-size: 1.2rem;
    font-weight: 300;
    margin-bottom: 40px;
    opacity: 0;
    animation: fadeInSub 2s ease forwards 1s; /* Atraso de 1s */
}

/* ===== CARDS DE AÇÃO RÁPIDA ===== */
.action-cards {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 40px;
}

.card-item {
    background: rgba(0, 20, 30, 0.7);
    border: 1px solid #00aaff88;
    backdrop-filter: blur(4px);
    border-radius: 12px;
    padding: 30px;
    width: 300px;
    text-align: center;
    text-decoration: none;
    color: #eaffff;
    transition: all 0.4s ease;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 170, 255, 0.2);
    
    opacity: 0; /* Inicialmente invisível para animação */
    transform: translateY(20px);
}

.card-item:hover {
    background: rgba(0, 30, 40, 0.9);
    border-color: #00aaff;
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 5px 20px rgba(0, 170, 255, 0.5);
}

.card-item h3 {
    margin-top: 10px;
    color: #00aaff;
    font-weight: 600;
}

.card-item i {
    font-size: 3rem;
    color: #00ffd9;
}

.card-item p {
    font-size: 0.9rem;
    margin-top: 5px;
    color: #c4ffff;
}


/* ===== ANIMAÇÕES GERAIS ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInSub {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Animações Sequenciais dos Cards */
.fade-in-delay-1 {
    animation: floatIn 1s ease forwards 1.8s;
}
.fade-in-delay-2 {
    animation: floatIn 1s ease forwards 2.2s;
}
.fade-in-delay-3 {
    animation: floatIn 1s ease forwards 2.6s;
}
</style>