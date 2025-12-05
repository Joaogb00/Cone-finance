<template>
    <header :class="{ active: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <router-link to="/"><img src="../assets/img/Log_cone_finance-removebg-preview.png" alt=""></router-link>
        <div class="links">
            <a class="link" href="#" @click.prevent="toggleIcon('acao')">
                O que você quer fazer hoje?
                <i :class="icons.acao"></i>
            </a>

            <a class="link" href="#" @click.prevent="toggleIcon('contato')">
                Contato
                <i :class="icons.contato"></i>
            </a>

            <a class="link" href="#" @click.prevent="toggleIcon('visao')">
                Nossa Visão
                <i :class="icons.visao"></i>
            </a>
            
            <router-link to="/cadastro"><i class="bi bi-person-circle"></i></router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            isHovered: false,
            icons: {
                acao: "bi bi-chevron-compact-down",
                contato: "bi bi-chevron-compact-down",
                visao: "bi bi-chevron-compact-down",
            },
        };
    },
    methods: {
        toggleIcon(key) {
            // Alterna o ícone entre "down" e "up"
            this.icons[key] =
                this.icons[key] === "bi bi-chevron-compact-down"
                    ? "bi bi-chevron-compact-up"
                    : "bi bi-chevron-compact-down";
        },
    },
};
</script>

<style scoped>
header {
    background-color: transparent;
    height: 17vh;
    transition: background-color 0.5s, height 0.5s, box-shadow 0.5s;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-family: "Poppins", sans-serif;
    z-index: 10;
}

header.active {
    background: rgba(0, 0, 0, 0.45);
    height: 20vh;
    box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);
    backdrop-filter: blur(8px);
}

.links {
    display: flex;
    flex-direction: row;
    gap: 10vh;
    margin-right: 10vh;
}

.link {
    text-decoration: none;
    color: #ffffff;
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.link:hover {
    color: #00aaff;
}

.link i {
    font-size: 1.3em;
    transition: transform 0.3s ease;
}

.link i.bi-chevron-compact-up {
    transform: rotate(180deg);
}

/* Animação sutil de entrada */
header {
    animation: fadeIn 1.2s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bi-person-circle{
    font-size: 30px;
    color: white;
    transition: color 0.3s ease;
}
.bi-person-circle:hover{
    color: #00aaff;
}
img{
    height: 20vh;
    margin-right: 40vh;
}
</style>