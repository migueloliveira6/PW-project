<template>
    <b-container fluid class="footer text-white py-5">
      <div class="footer-top text-center mb-4">
        <h2 class="footer-title">EyesEverywhere</h2>
        <p>Monitorização Inteligente para um Transporte mais seguro e eficiente</p>
      </div>
  
      <b-row class="footer-content text-start">
        <b-col md="4" class="mb-4 footer-column">
          <h5 class="footer-subtitle">Contacto</h5>
          <p>Email: contacto@eyeseverywhere.com</p>
          <p>Telefone: +351 123 456 789</p>
          <p>Localização: Guimarães, Portugal</p>
        </b-col>
  
        <b-col md="4" class="mb-4 footer-column">
          <h5 class="footer-subtitle">Links Úteis</h5>
          <p>Sobre nós</p>
          <p>Serviços</p>
          <p>FAQ</p>
          <p>Política de Privacidade</p>
        </b-col>
  
        <b-col md="4" class="mb-4 footer-column">
          <h5 class="footer-subtitle">Newsletter</h5>
          <p>Receba as últimas novidades no seu email</p>
          <b-form-input
            type="email"
            placeholder="Digite o seu email"
            class="mb-2 email-input"
          />
          <b-button variant="primary" class="btn-inscrever">Inscrever-se</b-button>
        </b-col>
      </b-row>
  
      <hr class="border-secondary" />
  
      <!-- Seção de rodapé -->
      <div class="footer-bottom d-flex justify-content-between align-items-center mt-3">
        <!-- Copyright à esquerda -->
        <p>© 2025 EyesEverywhere. Todos os direitos reservados.</p>
        
        <!-- Ícones sociais no canto inferior direito -->
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
          <a href="https://twitter.com" target="_blank">
            <img src="@/assets/twitter.png" alt="Twitter" class="social-icon" />
          </a>
        </div>
      </div>
    </b-container>
  </template>
  
  <style scoped>
  .footer {
    background-color: #262525;
  }
  
  .footer-top h2 {
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
  }
  
  .footer-column h5 {
    margin-bottom: 10px;
  }
  
  .footer-subtitle {
    color: #C49C74; /* Cor que já ajustaste */
  }
  
  .footer-title {
    color: #C49C74; /* Cor do Figma */
    font-size: 2rem;
  }
  
  /* Ícones sociais alinhados à direita */
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
  
  /* Estilizando o campo de email */
  .email-input {
    background-color: #979797;
    color: white;
    border: 1px solid #C49C74;
  }
  
  /* Estilizando o botão "Inscrever-se" */
  .btn-inscrever {
    background-color: #C49C74;
    color: white;
    border: none;
  }
  
  .btn-inscrever:hover {
    background-color: #a58c5e;
  }
  
  /* Flexbox para garantir que o texto e os ícones ficam onde devem */
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }
  </style>
  