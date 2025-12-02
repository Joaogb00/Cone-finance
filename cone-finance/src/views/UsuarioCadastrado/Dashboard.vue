<template>

  <main id="fundo">
    <section>
      <Header-cadastrado />

      <div class="grafico">

        <div class="elementos">

          <select name="Operacao" id="">

            <option value="entrada">Entrada</option>
            <option value="saida">Saida</option>
          </select>
        <div class="input">
          <label for="">Digite o valor da operação</label>
          <input type="text">
          </div>
        </div>

      </div>
    </section>
  </main>
  <Footer />
</template>

<script>
import Footer from '@/components/Footer.vue';

import HeaderCadastrado from './Header-cadastrado.vue';

export default {
  name: 'Dashboard',
  components: {
    Footer,
    HeaderCadastrado
  }
}
</script>

<style>
#fundo {
  background-color: #000;
  height: 120vh;
  overflow: hidden;
  width: 100%;
}

section {
  background-image: linear-gradient(to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.5)),
    url("../../assets/img/dashboard-page.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 120vh;
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

.grafico {
  background-color: transparent;
  border-radius: 10px;
  margin: 20px;
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  height: 70vh;
  width: 90vh;
  transition: .5s;
  color: white;
}

.grafico:hover {
  background-color: rgba(0, 0, 0, 0.212);
  border: 1px solid rgba(12, 108, 146, 0.589);

}

.elementos{
  display: flex;
  flex-direction: column-reverse;
}
select{
  width: 15vh;
  padding: 5px;
  border-radius: 10px;
  outline: none;
}


</style>