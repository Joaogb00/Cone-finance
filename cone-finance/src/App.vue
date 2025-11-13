<template>
  <div id="app">

   

    <!-- CONTEÚDO QUE MUDA A CADA PÁGINA -->
    <main>
      <router-view />
    </main>

   

  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  padding: 0;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}
</style>
