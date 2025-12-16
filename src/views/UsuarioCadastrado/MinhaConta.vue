<template>
  <main id="fundo">
    <section>
      <HeaderCadastrado/>
      <div class="account-container">
        <h1 class="title">Minha Conta</h1> 

        <div class="card animate-card"> 
          <p class="subtitle">Gerencie seus dados e mantenha tudo atualizado.</p>

          <form @submit.prevent="updateUser">
            <div class="line-form"> 
              <div class="ele-form">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" v-model="user.nome" required />
              </div>
              <div class="ele-form">
                <label for="sobrenome">Sobrenome:</label>
                <input type="text" id="sobrenome" v-model="user.sobrenome" required />
              </div>
            </div>

            <div class="ele-form">
              <label for="email">E-mail:</label>
              <input type="email" id="email" v-model="user.email" required />
            </div>

            <div class="ele-form">
              <label for="renda">Renda Mensal (R$):</label>
              <input type="number" id="renda" v-model="user.renda" step="0.01" />
            </div>
            
            <div class="ele-form">
              <label for="senha">Nova Senha (deixe em branco para manter a atual):</label>
              <input type="password" id="senha" v-model="newPassword" placeholder="********" />
            </div>

            <button type="submit" class="btn-finance animate-btn">Salvar Alterações</button>
            
            <a @click.prevent="showLogoutModal = true" class="btn-finance animate-btn logout-btn">Sair</a>
          </form>
        </div>
      </div>
    </section>

    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        </div>
    </div>
    
    <div v-if="showLogoutModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Confirmação de Saída</h2>
            <p>Tem certeza de que deseja sair da sua conta?</p>
            <div class="modal-actions">
                <button @click="confirmLogout" class="btn-confirm">Sim, Sair</button>
                <button @click="showLogoutModal = false" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    </div>
  </main>
  <Footer/>
</template>

<script>
import Footer from '../../components/Footer.vue';
import HeaderCadastrado from '../UsuarioCadastrado/Header-cadastrado.vue';

// Definição da URL base
const API_BASE_URL = 'http://localhost:3000/api'; 

export default {
  name: 'MinhaConta',
  components:{
    HeaderCadastrado,
    Footer
  },
  data() {
    return {
      user: {
        nome: '',
        sobrenome: '',
        email: '',
        renda: 0,
        _id: null, 
      },
      newPassword: '',
      showConfirmModal: false,
      showLogoutModal: false, 
      // Não precisamos mais do userEmail, mas mantemos o token
      token: localStorage.getItem('userToken') || '',
      originalUser: {}, 
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    // 🔑 OTIMIZAÇÃO DE SEGURANÇA: Busca os dados pelo token
    async fetchUserData() {
      if (!this.token) {
        alert("Sessão não encontrada. Faça o login novamente.");
        this.$router.push('/cadastrar');
        return;
      }
      
      const apiUrl = `${API_BASE_URL}/me`; // Nova rota protegida
      
      try {
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Falha ao carregar dados do usuário.');
        }

        // Preenche o objeto user com os dados retornados (que não incluem a senha)
        this.user = {
          nome: data.nome,
          sobrenome: data.sobrenome,
          email: data.email,
          renda: data.renda || 0, // Garante que renda é um número
          _id: data._id, 
        };
        // Salva os dados originais para comparação (opcional, mas bom)
        this.originalUser = { ...this.user };
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert(`Não foi possível carregar suas informações: ${error.message}. Tente logar novamente.`);
        // Se o erro for 401 (token inválido), o ideal é forçar o logout
      }
    },
    
    // 2. Executa a chamada PUT para o backend (também via token)
    async updateUser() {
      if (!this.token || !this.user._id) {
          alert("Erro de autenticação. Faça o login novamente.");
          this.$router.push('/cadastrar');
          return;
      }

      const payload = {
        nome: this.user.nome.trim(),
        sobrenome: this.user.sobrenome.trim(),
        email: this.user.email.trim(),
        renda: parseFloat(this.user.renda),
        // Envia a nova senha apenas se o campo estiver preenchido
        newPassword: this.newPassword.length > 0 ? this.newPassword : undefined,
      };

      try {
        // Nova rota PUT: /api/usuario (sem o email na URL)
        const res = await fetch(`${API_BASE_URL}/usuario`, { 
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Falha ao atualizar o usuário.');
        }

        alert("Seus dados foram atualizados com sucesso!");
        this.newPassword = ''; // Limpa o campo de senha
        // Atualiza o nome de exibição no localStorage, se necessário
        localStorage.setItem('userName', data.usuario.nome);
        
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        alert(`Erro ao salvar suas alterações: ${error.message}`);
      }
    },

    // 4. Ação de Logout
    async confirmLogout() {
        this.showLogoutModal = false; 
        
        localStorage.removeItem('userToken'); // Remova o token!
        localStorage.removeItem('userName');
        // Você pode ter que limpar outros itens do localStorage
        
        alert("Você saiu da sua conta. Até mais!");
        
        this.$router.push('/'); 
    }
  }
};
</script>

<style scoped>
/* Estilos de Fundo */
#fundo {
 background-color: #000;
 min-height: 100vh;
 width: 100%;
}

section {
background-image: linear-gradient(
 to right,
 rgba(0, 0, 0, 0.9),
 rgba(0, 20, 25, 0.5)
),
url("../../assets/img/dinheiro-enrolado.jpg");
background-position: center;
background-repeat: no-repeat;
background-size: cover;
min-height: 100vh;
width: 100%;
}

.account-container {
 max-width: 600px;
 width: 100%;
 margin: 0 auto; 
 padding: 20px;
}

.title {
color: #00aaff;
font-size: 2.5rem;
text-align: center;
margin-bottom: 20px;
text-shadow: 0 0 10px rgba(0, 170, 255, 0.5);

}
/* Card do formulário */
.card {
 background: rgba(0, 20, 30, 0.6);
 border: 1px solid #00aaff;
 backdrop-filter: blur(16px);
 border-radius: 16px;
 padding: 40px; 
 width: 100%; 
 color: #eaffff;
 box-shadow: 0 0 18px #00aaff3d;
}

.subtitle {
 color: #c4ffff;
 margin-bottom: 30px;
 text-align: center;
 font-size: 1.1rem;
}

/* Linha com duas colunas */
.line-form {
 display: flex;
 gap: 10px;
 margin-bottom: 12px;
}

/* Grupo de input */
.ele-form {
display: flex;
flex-direction: column;
margin-bottom: 15px; 
flex: 1; 
}

.ele-form label {
font-size: 0.9rem;
color: #c4ffff;
margin-bottom: 5px;

}
.ele-form input {
 margin-top: 4px;
 padding: 12px; 
 border-radius: 8px;
 border: 1px solid #00aaff88;
 background: rgba(0, 0, 0, 0.35);
 color: #eaffff;
 outline: none;
 transition: all 0.25s;
 font-size: 1rem;
}

.ele-form input:focus {
 border-color: #00ffd9;
 box-shadow: 0 0 12px rgba(0, 255, 217, 0.5);
 transform: scale(1.01); 
}

/* Botão de ação (Base para Salvar e Sair) */
.btn-finance {
 width: 100%;
 margin-top: 20px;
 padding: 15px;
 border-radius: 8px;
 border: 1px solid #00aaff;
 background: linear-gradient(145deg, #000, #021d24);
 font-weight: bold;
 color: #00aaff;
 cursor: pointer;
 transition: all 0.3s;
 box-shadow: 0 0 14px rgba(0, 170, 255, 0.35);
 font-size: 1.1rem;
 
 /* Para que o <a> (Sair) se comporte como o <button> */
 display: block; 
 text-align: center;
 text-decoration: none; 
}

.btn-finance:hover {
 background: #00aaff;
 color: #000;
 box-shadow: 0 0 25px rgba(0, 170, 255, 0.8);
 transform: scale(1.05);
}

/* 🚪 ESTILO ESPECÍFICO PARA O BOTÃO SAIR */
.logout-btn {
/* Cor de alerta/saída */
background: linear-gradient(145deg, #4d0000, #290000); 
border: 1px solid #ff4d4d;
color: #ff4d4d;
margin-top: 10px; 
}

.logout-btn:hover {
 /* Hover vermelho forte */
 background: #ff0000;
 color: #000;
 box-shadow: 0 0 25px rgba(255, 0, 0, 0.8); 
 transform: scale(1.05);
}


/* ===== ESTILOS DO MODAL (Usado por ambos os modais) ===== */
.modal-overlay {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.8); 
 display: flex;
 justify-content: center;
 align-items: center;
 z-index: 1000;
}

.modal-content {
 background: #001f29; 
 border: 2px solid #ff4d4d; 
 border-radius: 12px;
 padding: 30px;
 width: 90%;
 max-width: 400px;
 text-align: center;
 box-shadow: 0 0 25px rgba(255, 77, 77, 0.6);
}

.modal-content h2 {
 color: #ff4d4d;
 margin-bottom: 15px;
}

.modal-content p {
 color: #eaffff; 
 margin-bottom: 20px;
}

/* Container para os botões do modal */
.modal-actions {
 display: flex;
 justify-content: center;
 gap: 15px;
 margin-top: 20px;
}

.modal-actions button {
 padding: 10px 20px;
 border-radius: 6px;
 font-weight: 600;
 cursor: pointer;
 transition: background-color 0.3s, transform 0.3s;
 flex: 1; /* Permite que os botões ocupem o espaço de forma igual */
}

/* Estilo do botão Cancelar (btn-secondary) */
.btn-secondary {
 background-color: #00334d; 
 color: white;
 border: 1px solid #00aaff;
}

.btn-secondary:hover {
 background-color: #004d66;
 transform: translateY(-2px);
}

/* Estilo do botão Confirmar (btn-confirm) */
.btn-confirm {
 background-color: #ff4d4d;
 color: white;
 border: none;
}

.btn-confirm:hover {
background-color: #e60000;
transform: translateY(-2px);
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
</style>