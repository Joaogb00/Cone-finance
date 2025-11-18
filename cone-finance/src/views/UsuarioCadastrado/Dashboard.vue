<template>

<main id="fundo">
    <section>
<Header-cadastrado/>
    </section>
</main>
<Footer/>
</template>

<script>
import Footer from '@/components/Footer.vue';

import HeaderCadastrado from './Header-cadastrado.vue';

export default{
    name:'Dashboard',
    components:{
        Footer,
        HeaderCadastrado
    }
}
</script>

<style>
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
    url("../../assets/img/dashboard-page.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
  animation: fadeIn 2s ease-in-out forwards;
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