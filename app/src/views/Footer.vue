<template>
  <b-container fluid class="footer text-white py-5">
    <div class="footer-top text-center mb-4">
      <h2 class="footer-title">EyesEverywhere</h2>
      <p>Monitorização Inteligente para um Transporte mais seguro e eficiente</p>
    </div>

    <b-row class="footer-content text-start ps-5 pe-4">
      <b-col md="4" class="mb-5 footer-column">
        <h5 class="footer-subtitle">Contacto</h5>
        <p><a href="mailto:contacto@eyeseverywhere.com">Email: contacto@eyeseverywhere.com</a></p>
        <p>Telefone: +351 123 456 789</p>
        <p>Localização: Guimarães, Portugal</p>
      </b-col>

      <b-col md="4" class="mb-5 footer-column ps-4">
        <h5 class="footer-subtitle">Links Úteis</h5>
        <p><a href="/#sobre-nos" class="footer-link">Sobre nós</a></p>
        <p><a href="/#indicadores" class="footer-link">Indicadores</a></p>
        <p><a href="/#ocorrencias" class="footer-link">Ocorrências</a></p>
        <p><a href="/#transito" class="footer-link">Trânsito</a></p>
      </b-col>

      <b-col md="4" class="mb-5 footer-column ps-4">
        <h5 class="footer-subtitle">Newsletter</h5>
        <p>Receba as últimas novidades no seu email</p>
        <b-form-input
          type="email"
          placeholder="Digite o seu email"
          class="mb-2 email-input"
          v-model="email"
        />
        <b-button variant="primary" class="btn-inscrever" @click="inscrever">
          Inscrever-se
        </b-button>
        <!-- Mensagem de confirmação / erro -->
        <p v-if="mensagemEnvio" :style="{ color: mensagemCor, marginTop: '10px' }">
          {{ mensagemEnvio }}
        </p>
      </b-col>
    </b-row>

    <hr class="border-secondary" />

    <div class="footer-bottom d-flex justify-content-between align-items-center mt-3">
      <p>© 2025 EyesEverywhere. Todos os direitos reservados.</p>
      
      <div class="social-icons">
        <a href="https://wa.me/1234567890" target="_blank">
          <img src="@/assets/whatsapp.png" alt="WhatsApp" class="social-icon" />
        </a>
        <a href="https://www.instagram.com" target="_blank">
          <img src="@/assets/instagram.png" alt="Instagram" class="social-icon" />
        </a>
        <a href="https://www.facebook.com" target="_blank">
          <img src="@/assets/facebook.png" alt="Facebook" class="social-icon" />
        </a>
        <a href="https://x.com" target="_blank">
          <img src="@/assets/twitter.png" alt="Twitter" class="social-icon" />
        </a>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      email: '',
      mensagemEnvio: '',
      mensagemCor: 'green'  // cor da mensagem (verde sucesso, vermelho erro)
    };
  },
  methods: {
    inscrever() {
      if (this.email.trim()) {
        this.mensagemEnvio = `Obrigado pela sua inscrição, ${this.email}!`;
        this.mensagemCor = 'green';
        this.email = '';
      } else {
        this.mensagemEnvio = 'Por favor, introduza um email válido.';
        this.mensagemCor = 'red';
      }
    }
  }
};
</script>

<style scoped>
.footer {
  background-color: #b38a61 ;
}

.footer-link {
  color: #2c3e50;
  font-weight: bold;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-top h2 {
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}

.footer-column h5 {
  margin-bottom: 10px;
  font-weight: bold;
}

.footer-subtitle {
  color: #2c3e50; 
}

.footer-title {
  color: #2c3e50; 
  font-size: 2rem;
}

/* Ícones redes sociais alinhados à direita */
.social-icons {
  display: flex;
  justify-content: flex-end;  /* Para alinhar à direita */
  gap: 10px;  /* Adiciona um espaço entre os ícones */
}

.social-icons a {
  margin: 0;
}

.social-icon {
  width: 30px;
  height: 30px;
}

/*  campo de email */
.email-input {
  background-color: #979797;
  color: white;
  border: 1px solid #C49C74;
}

/*  botão "Inscrever-se" */
.btn-inscrever {
  background-color: #2c3e50;
  color: white;
  border: none;
}

.btn-inscrever:hover {
  background-color: #5a4f39;
}

/* Flexbox para garantir que o texto e os ícones ficam onde devem */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

p {
  color: #2c3e50;
  font-weight: bold;
}

a {
  color: #2c3e50;
  font-weight: bold;
}
</style>
