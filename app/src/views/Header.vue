<template>
  <div class="hero">
    <!-- Camada preta sobre a imagem -->
    <div class="overlay"></div>

    <!-- Navbar -->
    <nav class="navigation" role="navigation">
      <div class="nav-left">
        <router-link to="/" custom v-slot="{ navigate, isActive }" exact>
          <b-button 
            class="nav-button" 
            @click="navigate"
            :class="{ 'active-nav-button': isActive }"
          >
            Início
          </b-button>
        </router-link>
        
        <router-link 
          to="/ocorrencias" 
          custom 
          v-slot="{ navigate, isActive }"
        >
          <b-button 
            class="nav-button" 
            @click="navigate"
            :class="{ 'active-nav-button': isActive }"
          >
            Ocorrências
          </b-button>
        </router-link>
      </div>
    </nav>

    <!-- Texto Principal -->
    <div class="hero-text">
      <h1 class="title">EyesEverywhere</h1>
    </div>

    <!-- Texto Secundário (Inferior Direito) -->
    <div class="sub-text">
      <p>Da Mobilidade à Eficiência:<br />Cidades mais acessíveis com<br />Tecnologia.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('@/assets/fundo.png') no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Camada preta sobre a imagem */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Gradiente escuro sobre a imagem */
  background: linear-gradient(0deg, rgba(95, 94, 94, 0.3), rgba(0, 0, 0, 0.30));
  /* Borda preta fina */
  border: 1px solid #333333;
  /* Sombra para efeito mais suave */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 1;
}


/* Navbar */
.navigation {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  padding-left: 41%;
  z-index: 2; /* Garante que fique acima do overlay */
}

/* Alinhando os botões do lado esquerdo */
.nav-left {
  display: flex;
  gap: 10px;
}

/* Botões do Navbar */
.nav-button {
  border-radius: 25px;
  border: 2px solid #F6F6F6;
  background: rgba(217, 217, 217, 0.30);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: white !important;
  padding: 12px 25px !important;
  font-size: 16px !important;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  min-width: 150px; /* Adicione esta linha para definir uma largura mínima */
  text-align: center; /* Para centralizar o texto */
  font-family: Anaheim;
}

/* Estilo para botão ativo */
.active-nav-button {
  background: rgba(255, 255, 255, 0.637) !important;
  border-color: rgb(255, 255, 255) !important;
  font-weight: bold;
}

/* Remove efeito de hover quando já está ativo */
.router-link-active .nav-button:hover {
  background: rgb(255, 255, 255) !important;
}

.nav-button:hover {
  background: rgba(217, 217, 217, 0.5);
  transform: scale(1.05);
}

/* Botão Get the App */
.app-button {
  margin-left: auto;
  font-family: Anaheim;
}

/* Texto Central */
.hero-text {
  color: white;
  text-align: center;
  z-index: 2; /* Garante que o texto fique acima do overlay */
}

.title {
  font-size: 6rem;
  font-weight: 400;
  padding-bottom: 20%;
  font-family: Inter;
  font-style: normal;
  color: rgba(255, 255, 255, 0.466);
  line-height: 14px; /* 119.296px */
}

/* Texto Inferior Direito */
.sub-text {
  position: absolute;
  bottom: 20px;
  right: 40px;
  color: rgba(255, 255, 255, 0.40);
  font-size: 1.5rem;
  text-align: left;
  font-family: Inter;
  z-index: 2;
  line-height: 1.4; /* Melhora o espaçamento entre linhas */
}

.sub-text p {
  margin: 0; /* Remove margens padrão */
  white-space: pre-line; /* Garante que as quebras de linha sejam respeitadas */
}
</style>
