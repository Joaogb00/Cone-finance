<template>
    <main id="fundo">
        <section class="fade-section">
            <Header />
            <div class="slogan fade-item">
                <h1 class="typing">Controle inteligente das suas finanças.</h1>
                <div class="sub-slogan">
                    <h2 class="sub">
                        Organize suas entradas e saídas, visualize gráficos em tempo real <br />
                        e descubra novas formas de planejar seus objetivos financeiros com segurança e praticidade.
                    </h2>
                </div>
                
                <router-link class="btn-plataforma" to="/cadastro">Entrar na plataforma</router-link>

            </div>
        </section>
    </main>

    <div class="help-container fade-item">
        <button ref="button" class="help-btn" @click.stop="toggleTooltip" aria-label="Ajuda">
            <i class="bi bi-question-circle"></i>
        </button>

        <transition name="fade">
            <div
                v-if="showTooltip"
                ref="tooltip"
                class="tooltip fade-item"
                @click.stop
            >
                <h3>Bem-vindo ao <span class="highlight">Cone Finance</span></h3>
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
                    <strong>Dica:</strong> cadastre-se para desbloquear todos os recursos!<br />
                    <router-link to="/cadastro">Cadastre-se aqui</router-link>
                </p>
            </div>
        </transition>
    </div>
    <Footer/>
</template>

<script>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";

export default {
    name: "Index",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            showTooltip: false,
        };
    },
    methods: {
        // 🏆 CORREÇÃO: Função simplificada para apenas alternar o estado.
        toggleTooltip() {
            this.showTooltip = !this.showTooltip;
        },
        // A função handleClickOutside FOI REMOVIDA, pois não é mais necessária.
    },
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
    // O beforeUnmount também foi limpo, pois não há listeners para remover
    beforeUnmount() {
        // Nada para remover, pois o listener de click externo foi excluído.
    }
};
</script>

<style scoped>
/* O estilo CSS permanece exatamente o mesmo, pois a alteração é puramente JavaScript/Vue */

/* ===== LAYOUT GERAL ===== */
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
    url("../assets/img/Fundo.jpg");
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
    animation-delay: 5.0s; /* só aparece depois do sub-slogan */
}

.btn-plataforma:hover {
    background: #00aaff;
    color: #000;
    box-shadow: 0 0 25px rgba(0, 170, 255, 0.8);
    transform: scale(1.05);
}

/* ===== ANIMAÇÕES ===== */
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

/* ===== OUTRAS ANIMAÇÕES ===== */
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
        width: 36ch;
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

/* ===== BOTÃO DE AJUDA ===== */
.help-container {
    position: fixed;
    bottom: 25px;
    right: 80px;
    z-index: 1000;
}

.help-btn {
    background: linear-gradient(145deg, #000 40%, #0a0a0a 100%);
    border: 2px solid rgba(0, 255, 255, 0.4);
    border-radius: 50%;
    color: white;
    font-size: 1.6rem;
    width: 60px;
    height: 60px;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
    transition: all 0.4s ease;
    animation: pulse 3s infinite;
}

.help-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 0 35px rgba(0, 255, 255, 0.8);
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }
    50% {
        box-shadow: 0 0 35px rgba(0, 255, 255, 0.9);
    }
    100% {
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }
}

/* ===== TOOLTIP ===== */
.tooltip {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 320px;
    background: #0a0a0a;
    color: #fff;
    border-radius: 12px;
    padding: 18px 22px;
    box-shadow: 0 4px 25px #00aaff;
    font-family: "Poppins", sans-serif;
    border: 1px solid #00aaff;
    animation: fadeIn 0.5s ease;
    backdrop-filter: blur(6px);
}

.tooltip h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #00e6d2;
    font-weight: 600;
}

.tooltip .highlight {
    color: #00e6d2;
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
    font-weight: 600;
}
.tooltip a:hover {
    text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>