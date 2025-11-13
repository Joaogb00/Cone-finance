<template>
  <footer>
    <div class="footer-content">
      <div class="footer-section about">
        <h2>Cone Finance</h2>
        <p>Controle inteligente das suas finanças com segurança e praticidade.</p>
      </div>

      <div class="footer-section links">
        <h3>Links úteis</h3>
        <ul>
          <li><a href="#">Início</a></li>
          <li><a href="#">Serviços</a></li>
          <li><a href="#">Contato</a></li>
          <li><a href="#">Ajuda</a></li>
        </ul>
      </div>

      <div class="footer-section social">
        <h3>Conecte-se</h3>
        <div class="social-icons">
          <a href="#"><i class="bi bi-facebook"></i></a>
          <a href="#"><i class="bi bi-instagram"></i></a>
          <a href="#"><i class="bi bi-linkedin"></i></a>
          <a href="#"><i class="bi bi-twitter-x"></i></a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 Cone Finance — Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
footer {
  background: linear-gradient(180deg, rgb(0, 20, 25), black);
  color: white;
  padding: 40px 60px 20px;
  box-shadow: inset 2px 0px 2px 0px rgb(0, 20, 25);
  border-top: 10px solid rgb(0, 20, 25);
  font-family: 'Poppins', sans-serif;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-section h2,
.footer-section h3 {
  color: #00b3d6;
  margin-bottom: 10px;
}

.footer-section p {
  max-width: 300px;
  line-height: 1.5;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li a {
  color: #d4d4d4;
  text-decoration: none;
  transition: 0.3s;
}

.footer-section ul li a:hover {
  color: #00b3d6;
}

.social-icons a {
  color: white;
  margin-right: 10px;
  font-size: 1.3rem;
  transition: 0.3s;
}

.social-icons a:hover {
  color: #00b3d6;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  border-top: 1px solid #0a3a44;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #aaa;
}
</style>
