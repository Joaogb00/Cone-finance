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

        <router-link class="btn-plataforma" to="/formcad">Ir para Login</router-link>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Cadastrar",
  components: { Header, Footer },

  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".fade-item, .fade-section").forEach((el) => {
      observer.observe(el);
    });
  },
};
</script>

<style scoped>
/* ===== LAYOUT GERAL ===== */
#fundo {
  background-color: #000;
  height: 100vh;
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
  height: 100vh;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
  animation: fadeIn 2s ease-in-out forwards;
}

/* ===== TEXTO PRINCIPAL ===== */
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
  animation: typing 4s steps(35, end) 0.8s forwards, blink 0.75s step-end infinite;
  text-shadow: 2px 2px 2px black;
}

/* ===== SUB-SLOGAN ===== */
.sub-slogan {
  margin-top: 20px;
}

.sub {
  font-weight: 300;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInSub 2s ease forwards;
  animation-delay: 3.0s;
  line-height: 1.6rem;
  max-width: 700px;
}

/* ===== BOTÃO PRINCIPAL ===== */
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
  animation-delay: 5s;
}

.btn-plataforma:hover {
  background: #00aaff;
  color: #000;
  box-shadow: 0 0 25px rgba(0, 170, 255, 0.8);
  transform: scale(1.05);
}

/* ===== ANIMAÇÕES ===== */
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

/* ===== SCROLL FADE ===== */
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
</style>
