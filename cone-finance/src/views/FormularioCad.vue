<template>
    <div id="fundo">
<section>
<Header/>
<h1>cone</h1>
</section>
</div>
<Footer/>
</template>
<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default{
    name:'FormularioCad',
    components:{
        Header,
        Footer
    }
}
</script>
<style scoped>
#fundo{
    background-color: black;
}
section {
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.5)
    ),
    url("../assets/img/notadedinheiroempilhada.jpg");
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