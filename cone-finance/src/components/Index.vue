<template>
  <main id="fundo">
    <section class="fade-section">
      <div class="slogan fade-item">
        <h1 class="typing">Controle inteligente das suas finanças.</h1>
      </div>
    </section>
  </main>

  <!-- BOTÃO DE AJUDA -->
  <div class="help-container fade-item">
    <button class="help-btn" @click="toggleTooltip">
      <i class="bi bi-question-circle"></i>
    </button>

    <div class="tooltip fade-item" v-if="showTooltip">
      <h3>Bem-vindo ao Cone Finance</h3>
      <p>
        Aqui você pode acompanhar suas <strong>entradas e saídas</strong>,
        visualizar <strong>gráficos financeiros</strong> e controlar seus gastos
        com praticidade.
      </p>
      <ul>
        <li>Crie uma conta gratuita para começar a usar.</li>
        <li>Salve suas transações e monitore seu saldo diário.</li>
        <li>Tenha acesso a relatórios e metas financeiras personalizadas.</li>
      </ul>
      <p class="final-info">
        <strong>Dica:</strong> cadastre-se para desbloquear todos os recursos!
        <a href="#">Cadastre-se aqui!</a>
      </p>
    </div>
  </div>

  <!-- LOGOS DE PARCEIROS -->
  <div id="parceiros" class="fade-section">
    <div class="logos fade-item">
      <a href="https://www.xpi.com.br/" target="_blank">
        <img src="../assets/img/logo-xp-investimentos.png" alt="XP Investimentos" />
      </a>
      <a href="https://www.itau.com.br/" target="_blank">
        <img src="../assets/img/iti-itau-256.png" alt="Iti Itaú" />
      </a>
      <a href="https://edu.b3.com.br/" target="_blank">
        <img src="../assets/img/logo-b3-brasil-bolsa-balcao-512.png" alt="B3 Brasil Bolsa Balcão" />
      </a>
      <a href="https://loterias.caixa.gov.br/Paginas/Federal.aspx" target="_blank">
        <img src="../assets/img/logo-loteria-federal-256.png" alt="Loteria Federal" />
      </a>
      <a href="https://www.nuinvest.com.br/" target="_blank">
        <img src="../assets/img/logo-nu-invest-256.png" alt="Nu Invest" />
      </a>
      <a href="https://www.mastercard.com.br/" target="_blank">
        <img src="../assets/img/logo-mastercard-256.png" alt="Mastercard" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      showTooltip: false,
    };
  },
  methods: {
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    },
  },
  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    const fadeItems = document.querySelectorAll(".fade-item, .fade-section");
    fadeItems.forEach((el) => observer.observe(el));
  },
};
</script>

<style scoped>
/* ===== LAYOUT ===== */
#fundo {
  background-color: #000;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
}

section {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.3)),
    url("../assets/img/Fundo.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 2s ease-in-out forwards;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.5);
}

/* ===== TEXTO PRINCIPAL ===== */
.slogan {
  text-align: center;
  animation: floatUp 2.5s ease-out;
}

.typing {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1.5px;
  white-space: nowrap;
  overflow: hidden;
  
  width: 0;
  animation: typing 5.2s steps(35, end) 0.8s forwards, blink 0.75s step-end infinite;
  text-shadow: 0 0 8px #062027;
}

/* ===== ANIMAÇÕES ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
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
    width: 38ch;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

@keyframes floatUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ===== FADE SCROLL ===== */
.fade-item,
.fade-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.fade-item.show,
.fade-section.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== BOTÃO DE AJUDA ===== */
.help-container {
  position: fixed;
  bottom: 25px;
  right: 80px;
  z-index: 1000;
}

.help-btn {
  background: linear-gradient(135deg, #00ffd9, #0088ff);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.6rem;
  width: 60px;
  height: 60px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  transition: all 0.4s ease;
  animation: pulse 2.5s infinite;
}

.help-btn:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.9);
}

/* efeito pulsante */
@keyframes pulse {
  0% {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.9);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  }
}

/* ===== TOOLTIP ===== */
.tooltip {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 300px;
  background-color: #111;
  color: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 6px 20px rgba(0, 255, 255, 0.3);
  font-family: "Inter", sans-serif;
  animation: fadeIn 0.5s ease;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.tooltip h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #00ffd9;
  font-weight: 600;
}

.tooltip p,
.tooltip li {
  font-size: 0.9rem;
  line-height: 1.5rem;
}

.tooltip ul {
  padding-left: 18px;
  margin: 5px 0;
}

.tooltip .final-info {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #aaa;
}

.tooltip a {
  color: #00ffd9;
  text-decoration: none;
  transition: 0.3s;
}

.tooltip a:hover {
  text-decoration: underline;
}

/* ===== PARCEIROS ===== */
#parceiros {
  height: 60vh;
  background: linear-gradient(to top, #0a0a0a, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
}

.logos img {
  height: 120px;
  width: auto;
  object-fit: contain;
  filter: grayscale(100%) brightness(0.8);
  opacity: 0.8;
  transition: all 0.4s ease;
}

.logos img:hover {
  transform: scale(1.15);
  filter: grayscale(0%) brightness(1.2);
  opacity: 1;
}
</style>
