<template>
  <main id="fundo">
    <section class="fade-section">
      <Header />

      <div class="slogan fade-item">
        <h1 class="typing">Você ainda não possui cadastro.</h1>

        <div class="sub-slogan">
          <h2 class="sub">
            Clique em <strong>Cadastre-se</strong> para criar sua conta <br />
            ou faça <strong>Login</strong> para entrar na plataforma.
          </h2>
        </div>

        <div class="botoes">
          <a class="btn-plataforma" @click="mudarAba('login')">Realizar Login</a>
          <a class="btn-plataforma" @click="mudarAba('cadastro')">Realizar Cadastro</a>
        </div>
      </div>
      <div class="conteiner-form">

        <div class="card animate-card">

          <div class="tabs">
            <button :class="{ active: aba === 'login' }" @click="aba = 'login'">Entrar</button>
            <button :class="{ active: aba === 'cadastro' }" @click="aba = 'cadastro'">Cadastrar</button>
          </div>

          <form v-if="aba === 'login'" @submit.prevent="loginUser" class="form-anim">
            <h2 class="titulo animate-title">Bem-vindo de volta</h2>

            <div class="ele-form">
              <label>Email:</label>
              <input v-model="login.email" type="email" placeholder="Digite seu email" required />
            </div>

            <div class="ele-form">
              <label>Senha:</label>
              <input v-model="login.senha" type="password" placeholder="Digite sua senha" required />
            </div>

            <button class="btn-finance animate-btn">Entrar</button>
          </form>

          <form v-else-if="aba === 'cadastro'" @submit.prevent="registerUser" class="form-anim">
            <h2 class="titulo animate-title">Crie sua conta financeira</h2>

            <div class="line-form">
              <div class="ele-form">
                <label>Nome:</label>
                <input v-model="cadastro.nome" type="text" placeholder="Digite seu nome" required />
              </div>

              <div class="ele-form">
                <label>Sobrenome:</label>
                <input v-model="cadastro.sobrenome" type="text" placeholder="Digite seu sobrenome" required />
              </div>
            </div>

            <div class="ele-form">
              <label>Email:</label>
              <input v-model="cadastro.email" type="email" placeholder="Digite seu email" required />
            </div>

            <div class="ele-form">
              <label>Senha:</label>
              <input v-model="cadastro.senha" type="password" placeholder="Digite sua senha" required />
            </div>

            <div class="ele-form">
              <label>Confirmar Senha:</label>
              <input v-model="cadastro.confSenha" type="password" placeholder="Confirme sua senha" required />
            </div>

            <div class="ele-form">
              <label>Renda Mensal (R$):</label>
              <input v-model="cadastro.renda" type="number" placeholder="Exemplo: 2500" min="0" required />
            </div>

            <button class="btn-finance animate-btn">Cadastrar</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import axios from 'axios'; 

// 🛑 PONTO CRÍTICO: Se a porta 3000 estiver bloqueada (comum), altere aqui para 3001
const API_BASE_URL = 'http://localhost:3000/api'; 

export default {
  name: "Cadastrar",
  components: { Header, Footer },

  data() {
    return {
      aba: "login",
      login: {
        email: "",
        senha: ""
      },
      cadastro: {
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        confSenha: "",
        renda: ""
      }
    };
  },

  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('show');
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.fade-item, .fade-section').forEach((el) => {
      observer.observe(el);
    });
  },

  methods: {
    mudarAba(novaAba) {
      this.aba = novaAba;
    },

    /**
     * 🚀 MÉTODO DE LOGIN COM TRATAMENTO DE ERRO MELHORADO E TIMEOUT
     */
    async loginUser() {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: this.login.email ? this.login.email.trim() : '',
          senha: this.login.senha ? this.login.senha.trim() : ''
        }, {
          // Adiciona um timeout de 5 segundos para evitar requisições penduradas
          timeout: 5000 
        });

        if (response.data && response.data.token) {
          const token = response.data.token;
          localStorage.setItem('userToken', token);
          localStorage.setItem('userName', response.data.userName);
          
          if (response.data.userId) {
              localStorage.setItem('userId', response.data.userId); 
          }
          
          // Redirecionamento para a dashboard
          this.$router.push({ 
              name: 'user_home', // Confirme se o nome da rota é 'dashboard'
              params: { id: token } 
          });
        }
      } catch (error) {
        console.error("Erro durante o login:", error);
        
        if (error.response) {
            // O servidor respondeu, mas com status de erro (4xx ou 5xx)
            const status = error.response.status;
            if (status === 404) {
                alert('E-mail não encontrado.');
            } else if (status === 401) {
                alert('Senha incorreta.');
            } else {
                alert(`Falha ao realizar login (Código: ${status}). Tente novamente mais tarde.`);
            }
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            // Erro de Timeout
            alert('A requisição demorou muito para responder (Timeout). Verifique sua conexão e o backend.');
        } else {
            // 🛑 ERRO DE REDE/CORS/CONEXÃO RECUSADA
            alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000.');
        }
      }
    },

    /**
     * MÉTODO REGISTERUSER (Mantido)
     */
    async registerUser() {
      if (this.cadastro.senha !== this.cadastro.confSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      
      const dadosParaEnviar = {
        nome: this.cadastro.nome.trim(),
        sobrenome: this.cadastro.sobrenome.trim(),
        email: this.cadastro.email.trim(), 
        senha: this.cadastro.senha,
        renda: parseFloat(this.cadastro.renda)
      };
      
      try {
        const res = await axios.post(`${API_BASE_URL}/usuarios`, dadosParaEnviar);

        alert(res.data.message || "Usuário cadastrado com sucesso! Faça login.");
        
        this.login.email = this.cadastro.email.trim();
        this.login.senha = "";
        this.aba = 'login'; 
        this.cadastro = { nome: "", sobrenome: "", email: "", senha: "", confSenha: "", renda: "" };

      } catch (error) {
        console.error("Erro no cadastro:", error.response || error);
        
        if (error.response && error.response.data.error) {
              alert(`Erro ao cadastrar: ${error.response.data.error}`);
        } else {
              alert('Erro ao cadastrar. Verifique sua conexão e tente novamente.');
        }
      }
    }
  }
};
</script>

<style scoped>
/* ESTILOS (MANTIDOS IGUAIS) */
#fundo {
  background-color: #000;
  height: 120vh;
  overflow: hidden;
  width: 100%;
}

.fade-section {
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.5)
    ),
    url("../assets/img/Fundo cadastro.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 120vh;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
  animation: fadeIn 2s ease-in-out forwards;
}

.slogan {
  text-align: left;
  position: absolute;
  top: 35%;
  left: 10%;
  transform: translate(-50%, -50%);
  animation: floatUp 2.5s ease-out;
}

.typing {
  font-size: 2.4rem;
  font-weight: 700;
  color: #00aaff;
  letter-spacing: 1.2px;
  white-space: nowrap;

  width: 0;
  animation: typing 2.0s steps(35, end) 0.8s forwards, blink 0.75s step-end infinite;
  text-shadow: 2px 2px 2px black;
}

.sub-slogan {
  margin-top: 20px;
}

.sub {
  font-weight: 300;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInSub 2s ease forwards;
  animation-delay: 1.8s;
  line-height: 1.6rem;
  max-width: 700px;
}

.btn-plataforma {
  display: inline-block;
  margin-top: 35px;
  padding: 14px 32px;
  background: linear-gradient(145deg, #000 30%, #0a0a0a 100%);
  color: #00aaff;
  font-weight: 600;
  border: 1px solid #00aaff;
  border-radius: 25px;
  text-decoration: none;
  font-size: 1rem;
  box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.5s ease;
  animation: fadeInButton 1.2s ease forwards;
  animation-delay: 3s;
  cursor: pointer;
}

.btn-plataforma:hover {
  background: #00aaff;
  color: #000;
  box-shadow: 0 0 25px rgba(0, 170, 255, 0.8);
  transform: scale(1.05);
}

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

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 27ch;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

@keyframes floatUp {
  0% {
    transform: translateY(15px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInSub {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInButton {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-item,
.fade-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.fade-item.show,
.fade-section.show {
  opacity: 1;
  transform: translateY(0);
}
.botoes {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.card {
  background: rgba(0, 20, 30, 0.6);
  border: 1px solid #00aaff;
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 30px;
  width: 400px;
  color: #eaffff;
  box-shadow: 0 0 18px #00aaff3d;
}

.tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  font-weight: 600;
  color: #0375ae;
  border-bottom: 2px solid transparent;
  transition: 0.25s;
  cursor: pointer;
}

.tabs button:hover {
  color: #00aaff;
}

.tabs button.active {
  color: #00aaff;
  border-bottom: 2px solid #00aaff3d;
}

.ele-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.ele-form label {
  font-size: 0.9rem;
  color: #c4ffff;
}

.ele-form input {
  margin-top: 4px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #00aaff88;
  background: rgba(0, 0, 0, 0.35);
  color: #eaffff;
  outline: none;
  transition: 0.25s;
}

.ele-form input::placeholder {
  color: #84b6c7;
}

.ele-form input:focus {
  border-color: #00ffd9;
  box-shadow: 0 0 12px #00ffd9;
  transform: scale(1.03);
}

.btn-finance {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #00aaff;
  background: linear-gradient(145deg, #000, #021d24);
  font-weight: bold;
  color: #00aaff;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 14px rgba(0, 170, 255, 0.35);
}

.btn-finance:hover {
  background: #00aaff;
  color: #000;
  box-shadow: 0 0 25px rgba(0, 170, 255, 0.8);
  transform: scale(1.05);
}

.line-form {
  display: flex;
  gap: 10px;
}

.conteiner-form {
  position: absolute;
  top: 30%;
  left: 60%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: fadeInButton 1.2s ease forwards;
  animation-delay: 2.8s;
}
</style>