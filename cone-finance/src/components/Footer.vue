<template>
  <footer>
    <div class="footer-content">
      <div class="footer-section about">
        <h2>Cone Finance</h2>
        <p>Controle inteligente das suas finanças com segurança e praticidade.</p>
      </div>

      <div class="footer-section links">
        <h3>Teste</h3>
        <ul>
          <li><a href="#">Item1</a></li>
          <li><a href="#">item2</a></li>
          <li><a href="#">Item3</a></li>
          <li><a href="#">Item4</a></li>
        </ul>
      </div>

      <div class="footer-section social">
        <h3>Conecte-se</h3>
        <div class="social-icons">
          <a target="_blank" href="https://www.facebook.com/joao.gabriel.715685"><i class="bi bi-facebook"></i></a>
          <a target="_blank" href="https://www.instagram.com/jaomtz_09/"><i class="bi bi-instagram"></i></a>
          <a target="_blank" href="https://www.linkedin.com/in/jo%C3%A3o-gabriel-506031260/"><i class="bi bi-linkedin"></i></a>
          <a target="_blank" href="https://x.com/home"><i class="bi bi-twitter-x"></i></a>  
          <a target="_blank" href="https://github.com/Joaogb00"><i class="bi bi-github"></i></a>
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
