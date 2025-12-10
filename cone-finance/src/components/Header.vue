<template>
    <header :class="{ active: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        
        <router-link to="/">
            <img src="../assets/img/Log_cone_finance-removebg-preview.png" alt="">
        </router-link>
        
        <div class="links">
            
            <div class="link-container">
                <a class="link" href="#" @click.prevent="toggleDropdown('acao')">
                    O que você quer fazer hoje?
                    <i :class="icons.acao"></i>
                </a>
                
                <div class="dropdown-menu" v-if="isDropdownOpen">
                    <router-link to="/cadastro" class="dropdown-item">Investimentos</router-link>
                    <router-link to="/cadastro" class="dropdown-item"> Controle de Orçamento</router-link>
                    <router-link to="/cadastro" class="dropdown-item"> Calculadoras Financeiras</router-link>
                    
                    <a target="_blank" href="https://www.b3.com.br/pt_br/para-voce" class="dropdown-item">Noticias do Mercado</a>
                </div>
            </div>

            <div class="link-container">
                <a class="link" href="#" @click.prevent="toggleContactDropdown('contato')">
                    Contato
                    <i :class="icons.contato"></i>
                </a>
                
                <div class="dropdown-menu contact-dropdown" v-if="isContactDropdownOpen">
                    <a href="https://wa.me/31991890942" target="_blank" class="dropdown-item">
                        <i class="bi bi-whatsapp"></i> WhatsApp
                    </a>
                    <a target="_blank" href="tel:36714337" class="dropdown-item">
                        <i class="bi bi-telephone"></i> Ligar
                    </a>
                    <a target="_blank" href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=GTvVlcSHxwJnCZpDkxPpwTvNfvxqVxgBqvbKsxPWfWJBbLScwQHqgNzkCqlKXQGlTWDXFjtDHVPTl"  class="dropdown-item">
                        <i class="bi bi-envelope"></i> E-mail
                    </a>
                </div>
            </div>

          

            <router-link to="/cadastro"><i class="bi bi-person-circle"></i></router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Header-cadastrado",
    data() {
        return {
            isHovered: false,
            // Variáveis de estado dos Dropdowns
            isDropdownOpen: false, 
            isContactDropdownOpen: false,
            icons: {
                acao: "bi bi-chevron-compact-down",
                contato: "bi bi-chevron-compact-down",
                // Removida a chave 'visao' ou 'dashboard' se não tiver ícone de alternância
            },
            // API e estados de carregamento/erro foram removidos
        };
    },
    methods: {
        // Dropdown Principal (Ações)
        toggleDropdown(key) {
            this.isContactDropdownOpen = false; // Fecha Contato
            this.isDropdownOpen = !this.isDropdownOpen; // Alterna Ação

            // Ajusta os ícones
            this.icons.acao = this.isDropdownOpen ? "bi bi-chevron-compact-up" : "bi bi-chevron-compact-down";
            this.icons.contato = "bi bi-chevron-compact-down"; 
        },

        // Dropdown de Contato
        toggleContactDropdown(key) {
            this.isDropdownOpen = false; // Fecha Ação
            this.isContactDropdownOpen = !this.isContactDropdownOpen; // Alterna Contato

            // Ajusta os ícones
            this.icons.contato = this.isContactDropdownOpen ? "bi bi-chevron-compact-up" : "bi bi-chevron-compact-down";
            this.icons.acao = "bi bi-chevron-compact-down"; 
        },

        // Fecha todos os dropdowns ao clicar em links simples
        closeAllDropdowns() {
            this.isDropdownOpen = false;
            this.isContactDropdownOpen = false;
            this.icons.acao = "bi bi-chevron-compact-down";
            this.icons.contato = "bi bi-chevron-compact-down";
        },
        
        // O método toggleIcon original não é mais necessário, pois usamos toggleDropdown e toggleContactDropdown
    },
    // O hook mounted() e a lógica da API foram removidos
};
</script>

<style scoped>
/* ESTILOS EXISTENTES (HEADER ESCURA) */
header {
    background-color: transparent;
    height: 17vh;
    transition: background-color 0.5s, height 0.5s, box-shadow 0.5s;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-family: "Poppins", sans-serif;
    z-index: 10;
    position: relative; 
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

/* NOVO: Contêiner de Posição para Dropdowns */
.link-container {
    position: relative; 
    display: inline-block;
}

/* NOVO: Estilo do Dropdown Menu (Adaptado ao tema escuro/transparente) */
.dropdown-menu {
    position: absolute; 
    top: 100%; 
    left: 0; 
    
    background: rgba(0, 0, 0, 0.9); /* Fundo escuro semi-transparente */
    border-radius: 8px;
    padding: 10px 0;
    min-width: 250px;
    box-shadow: 0 4px 15px rgba(0, 170, 255, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 15;
    animation: slideInDown 0.3s ease-out forwards;
}

.dropdown-item {
    text-decoration: none;
    color: #ffffff;
    padding: 10px 20px;
    font-weight: 400;
    transition: background-color 0.3s, color 0.3s;
    display: flex;
    align-items: center;
}

.dropdown-item:hover {
    background-color: rgba(0, 170, 255, 0.2); 
    color: #00aaff;
}

/* Ícones dentro do Dropdown de Contato */
.dropdown-menu .dropdown-item i {
    margin-right: 8px; 
    color: #00aaff; /* Cor de destaque azul */
    font-size: 1.1em;
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

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
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
    margin-right: 68vh;
    
}
</style>