<template>
  <main id="fundo">
    <section class="cadastro">

      <form class="form-box" @submit.prevent="enviarFormulario">

        <h2 class="titulo">Crie sua conta</h2>

        <!-- =====================
        1. Informações Pessoais
        ======================== -->
        <div class="grupo">
          <h3 class="sub">Informações pessoais</h3>

          <div class="elementos">
            <label>Nome completo</label>
            <input type="text" v-model="form.nome" placeholder="Seu nome até 60 caracteres" maxlength="60" required />
          </div>

          <div class="elementos">
            <label>E-mail</label>
            <input type="email" v-model="form.email" placeholder="exemplo@email.com" required />
          </div>

          <div class="elementos">
            <label>Telefone</label>
            <input type="text" v-model="form.telefone" @input="mascaraTelefone" placeholder="(DDD) 99999-9999" maxlength="15" required />
          </div>

          <div class="elementos">
            <label>Data de nascimento</label>
            <input type="text" v-model="form.nascimento" @input="mascaraData" placeholder="DD/MM/AAAA" maxlength="10" required />
          </div>
        </div>

        <!-- =====================
        2. Dados de acesso
        ======================== -->
        <div class="grupo">
          <h3 class="sub">Acesso da conta</h3>

          <div class="elementos senha-container">
            <label>Senha</label>

            <div class="senha-wrapper">
              <input :type="mostrarSenha ? 'text' : 'password'" v-model="form.senha"
                placeholder="Crie uma senha forte" @input="avaliarForcaSenha" required />

              <i class="bi" :class="mostrarSenha ? 'bi-eye-slash' : 'bi-eye'" @click="mostrarSenha = !mostrarSenha">
              </i>
            </div>

            <!-- força da senha -->
            <div class="forca-senha" :style="{ background: corForcaSenha, width: forcaSenha + '%' }"></div>
          </div>

          <div class="elementos senha-container">
            <label>Confirmar senha</label>
            <input :type="mostrarSenha ? 'text' : 'password'" v-model="form.confirmarSenha" placeholder="Repita sua senha" required />
            <small v-if="erroSenha" class="erro">As senhas não coincidem.</small>
          </div>
        </div>

        <!-- =====================
        3. Segurança
        ======================== -->
        <div class="grupo">
          <h3 class="sub">Segurança</h3>

          <div class="elementos">
            <label>Pergunta de segurança</label>
            <input type="text" v-model="form.pergunta" placeholder="Ex: Nome do seu primeiro pet" />
          </div>

          <div class="elementos">
            <label>Autenticação em 2 fatores</label>
            <select v-model="form.otp">
              <option value="email">Código por E-mail</option>
              <option value="sms">Código por SMS</option>
            </select>
          </div>
        </div>

        <!-- =====================
        4. Informações Financeiras
        ======================== -->
        <div class="grupo">
          <h3 class="sub">Informações financeiras</h3>

          <div class="elementos">
            <label>Renda mensal (R$)</label>
            <input type="number" min="0" v-model="form.renda" placeholder="Ex: 3000" />
          </div>

          <div class="elementos">
            <label>Objetivo financeiro</label>
            <select v-model="form.objetivo">
              <option value="economizar">Economizar</option>
              <option value="investir">Investir</option>
              <option value="controlar">Controlar Gastos</option>
            </select>
          </div>

          <div class="elementos">
            <label>Notificações</label>
            <select v-model="form.notificacoes">
              <option value="email">Receber por E-mail</option>
              <option value="sms">Receber por SMS</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>
        </div>

        <!-- =====================
        5. Endereço
        ======================== -->
        <div class="grupo">
          <h3 class="sub">Endereço</h3>

          <div class="elementos">
            <label>CEP</label>
            <input type="text" v-model="form.cep" maxlength="9" @input="mascaraCep" placeholder="00000-000" />
          </div>

          <div class="elementos-row">
            <input type="text" v-model="form.rua" placeholder="Rua" />
            <input type="number" v-model="form.numero" placeholder="Número" />
          </div>

          <div class="elementos-row">
            <input type="text" v-model="form.bairro" placeholder="Bairro" />
            <input type="text" v-model="form.cidade" placeholder="Cidade" />
            <input type="text" v-model="form.estado" placeholder="UF" maxlength="2" />
          </div>
        </div>

        <!-- =====================
        6. Aceite Legal
        ======================== -->
        <div class="grupo">
          <label class="checkbox">
            <input type="checkbox" v-model="form.termos" required />
            Li e concordo com os Termos de Uso
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.privacidade" required />
            Li e concordo com a Política de Privacidade
          </label>
        </div>

        <!-- BOTÃO -->
        <button class="btn-cadastrar">Cadastrar</button>

      </form>

    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      mostrarSenha: false,
      forcaSenha: 0,
      corForcaSenha: "#ff0000",
      erroSenha: false,

      form: {
        nome: "",
        email: "",
        telefone: "",
        nascimento: "",
        senha: "",
        confirmarSenha: "",
        pergunta: "",
        otp: "email",
        renda: "",
        objetivo: "",
        notificacoes: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        termos: false,
        privacidade: false,
      }
    };
  },

  methods: {
    mask(value, pattern) {
      let i = 0;
      return pattern.replace(/#/g, () => value[i++] || "");
    },
    mascaraTelefone() {
      let v = this.form.telefone.replace(/\D/g, "");
      this.form.telefone = this.mask(v, "(##) #####-####");
    },
    mascaraData() {
      let v = this.form.nascimento.replace(/\D/g, "");
      this.form.nascimento = this.mask(v, "##/##/####");
    },
    mascaraCep() {
      let v = this.form.cep.replace(/\D/g, "");
      this.form.cep = this.mask(v, "#####-###");
    },
    avaliarForcaSenha() {
      const senha = this.form.senha;
      let score = 0;

      if (senha.length >= 8) score += 25;
      if (/[A-Z]/.test(senha)) score += 25;
      if (/[a-z]/.test(senha)) score += 25;
      if (/[0-9]/.test(senha) && /[\W]/.test(senha)) score += 25;

      this.forcaSenha = score;

      if (score <= 25) this.corForcaSenha = "#ff3b3b";
      else if (score <= 50) this.corForcaSenha = "#ff8c00";
      else if (score <= 75) this.corForcaSenha = "#00aaff";
      else this.corForcaSenha = "#00ff88";
    },
    enviarFormulario() {
      this.erroSenha = this.form.senha !== this.form.confirmarSenha;

      if (!this.erroSenha) {
        alert("Cadastro enviado!");
      }
    }
  }
};
</script>

<style>
/* ====== FUNDO ====== */
#fundo {
  background: black;
  height: 100vh;
  width: 100%;
}

/* ====== SEÇÃO ====== */
.cadastro {
  background-image: linear-gradient(to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.6)),
    url("../assets/img/Fundo cadastro.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ====== FORM ====== */
.form-box {
  width: 380px;
  max-height: 85vh;
  overflow-y: auto;

  padding: 25px;
  border-radius: 20px;

  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);

  border: 1px solid #003544;
  box-shadow: 0 0 30px #00161e;

  animation: slideFade 0.9s ease forwards;
}

@keyframes slideFade {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

/* ===== TITULOS ===== */
.titulo {
  text-align: center;
  color: #00aaff;
  font-size: 1.6rem;
  margin-bottom: 20px;
}

.sub {
  color: #00aaff;
  margin: 15px 0 5px;
  font-size: 1.2rem;
  border-left: 4px solid #00aaff;
  padding-left: 6px;
}

/* ===== INPUTS ===== */
.elementos,
.elementos-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.elementos-row {
  flex-direction: row;
  gap: 10px;
}

label {
  color: #fff;
  margin-bottom: 5px;
  font-size: 0.95rem;
}

input,
select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #003544;
  outline: none;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  transition: .3s;
}

input:focus,
select:focus {
  border-color: #00aaff;
  background: rgba(0, 170, 255, 0.15);
}

::placeholder {
  color: #d4d4d4;
}

/* SENHA */
.senha-container {
  position: relative;
}

.senha-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.senha-wrapper i {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #00aaff;
}

/* FORÇA DA SENHA */
.forca-senha {
  height: 5px;
  border-radius: 5px;
  margin-top: 5px;
  transition: .3s;
}

/* ERROS */
.erro {
  color: #ff3b3b;
  font-size: 0.8rem;
}

/* BOTÃO */
.btn-cadastrar {
  width: 100%;
  padding: 12px;
  background: #00aaff;
  color: black;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: .3s;
  margin-top: 10px;
}

.btn-cadastrar:hover {
  background: white;
  box-shadow: 0 0 12px #00aaff;
}

/* CHECKBOX */
.checkbox {
  color: white;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
