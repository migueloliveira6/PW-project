<template>
  <!-- Container principal do componente de monitorização de tráfego -->
  <div class="traffic-monitoring">
    <!-- Título da seção -->
    <h2 class="map-title">Monitorização de Trânsito</h2>
    
    <!-- Barra de controles do mapa -->
    <div class="map-controls">
      <!-- Grupo de botões de controle (zoom e localização) -->
      <div class="control-group">
        <!-- Botão de zoom (+) -->
        <button class="control-btn zoom-btn" @click="zoomIn" title="Aproximar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ícone de "+" (linha vertical + linha horizontal) -->
            <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <!-- Botão de zoom (-) -->
        <button class="control-btn zoom-btn" @click="zoomOut" title="Afastar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ícone de "-" (apenas linha horizontal) -->
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <!-- Botão de localização atual -->
        <button class="control-btn location-btn" @click="centerMap" title="Minha localização">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ícone de localização (ponto + círculo) -->
            <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <!-- Seletor de camadas do mapa -->
      <div class="layer-selector">
        <!-- Botão para camada de tráfego -->
        <button 
          class="layer-btn" 
          :class="{ active: selectedLayer === 'traffic' }"
          @click="selectedLayer = 'traffic'"
        >
          Tráfego
        </button>
        
        <!-- Botão para camada de transportes -->
        <button 
          class="layer-btn" 
          :class="{ active: selectedLayer === 'transit' }"
          @click="selectedLayer = 'transit'"
        >
          Transportes
        </button>
      </div>
    </div>
    
    <!-- Container onde o mapa Google será renderizado -->
    <div id="map" class="map-container" ref="mapContainer"></div>
  </div>
</template>

<script>
export default {
  name: "TrafficMonitoring",
  data() {
    return {
      map: null,          // Instância do mapa Google Maps
      selectedLayer: 'traffic',  // Camada atualmente selecionada
      trafficLayer: null, // Camada de informações de tráfego
      transitLayer: null, // Camada de transportes públicos
      userMarker: null    // Marcador da posição do usuário
    }
  },
  mounted() {
    // Quando o componente é montado, carrega a API do Google Maps
    this.loadGoogleMaps();
  },
  methods: {
    /**
     * Carrega a API do Google Maps de forma assíncrona
     */
    loadGoogleMaps() {
      // Verifica se a API já foi carregada
      if (!window.google) {
        // Cria um elemento script para carregar a API
        const script = document.createElement("script");
        // URL da API com a chave de desenvolvedor
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`;
        script.async = true;  // Carrega de forma assíncrona
        script.defer = true;  // Adia o carregamento
        document.head.appendChild(script);
        // Define a função de callback quando o script carregar
        script.onload = this.initMap;
      } else {
        // Se a API já estiver carregada, inicializa o mapa diretamente
        this.initMap();
      }
    },

    /**
     * Inicializa o mapa Google Maps com configurações padrão
     */
    initMap() {
      // Cria uma nova instância do mapa no elemento referenciado
      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center: { lat: 41.5518, lng: -8.4229 }, // Coordenadas iniciais (Braga)
        zoom: 13, // Nível de zoom inicial
        disableDefaultUI: true, // Desativa controles padrão do Google Maps
        styles: [
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }] // Oculta pontos de interesse
          }
        ]
      });
      
      // Inicializa a camada de tráfego e a ativa
      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map);
      
      // Inicializa a camada de transportes (mas não a ativa ainda)
      this.transitLayer = new google.maps.TransitLayer();
      
      // Adiciona o marcador da localização do usuário
      this.addUserLocationMarker();
    },

    /**
     * Adiciona um marcador na localização atual do usuário
     */
    addUserLocationMarker() {
      // Verifica se o navegador suporta geolocalização
      if (navigator.geolocation) {
        // Obtém a posição atual do usuário
        navigator.geolocation.getCurrentPosition(
          position => {
            // Remove o marcador anterior se existir
            if (this.userMarker) {
              this.userMarker.setMap(null);
            }
            
            // Cria um novo marcador circular personalizado
            this.userMarker = new google.maps.Marker({
              position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
              map: this.map, // Associa ao mapa
              icon: {
                path: google.maps.SymbolPath.CIRCLE, // Forma circular
                fillColor: '#4285F4', // Cor azul (estilo Google)
                fillOpacity: 1,       // Opacidade total
                strokeColor: '#FFFFFF', // Borda branca
                strokeWeight: 2,      // Espessura da borda
                scale: 8              // Tamanho do marcador
              },
              title: "Sua localização", // Tooltip
              zIndex: 999              // Garante que fique acima de outros elementos
            });
          },
          (error) => {
            // Tratamento de erro se a geolocalização falhar
            console.log("Erro de geolocalização:", error.message);
          },
          { enableHighAccuracy: true } // Tenta obter a posição mais precisa possível
        );
      }
    },

    /**
     * Aumenta o zoom do mapa
     */
    zoomIn() {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + 1);
      }
    },

    /**
     * Diminui o zoom do mapa
     */
    zoomOut() {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() - 1);
      }
    },

    /**
     * Centraliza o mapa na localização do usuário
     */
    centerMap() {
      // Se já existe um marcador de usuário, centraliza nele
      if (this.map && this.userMarker) {
        this.map.setCenter(this.userMarker.getPosition());
        this.map.setZoom(15); // Aplica zoom mais próximo
      } else if (navigator.geolocation) {
        // Se não houver marcador mas o navegador suportar geolocalização
        navigator.geolocation.getCurrentPosition(
          position => {
            // Centraliza no novo local e aplica zoom
            this.map.setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            this.map.setZoom(15);
            // Adiciona o marcador
            this.addUserLocationMarker();
          },
          () => {
            // Fallback para coordenadas padrão se a geolocalização falhar
            this.map.setCenter({ lat: 38.7223, lng: -9.1393 }); // Lisboa
          }
        );
      }
    }
  },
  watch: {
    /**
     * Observa mudanças na camada selecionada e ativa/desativa as camadas
     */
    selectedLayer(newVal) {
      if (!this.map) return;
      
      // Ativa/desativa camadas conforme a seleção
      this.trafficLayer.setMap(newVal === 'traffic' ? this.map : null);
      this.transitLayer.setMap(newVal === 'transit' ? this.map : null);
    }
  }
};
</script>

<style scoped>
/* Estilo do container principal */
.traffic-monitoring {
  background-color: #212122; /* Fundo escuro */
  padding: 20px;
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto; /* Centraliza na página */
}

/* Estilo do título */
.map-title {
  color: #fff; /* Texto branco */
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

/* Container do mapa */
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Sombra suave */
}

/* Barra de controles */
.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
  flex-wrap: wrap; /* Quebra linha em telas pequenas */
}

/* Grupo de botões de controle */
.control-group {
  display: flex;
  gap: 8px; /* Espaço entre botões */
}

/* Estilo base dos botões */
.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease; /* Transição suave ao interagir */
}

/* Botões de zoom */
.zoom-btn {
  background-color: #e6e9ec; /* Fundo claro */
  color: #0e0d0d; /* Texto escuro */
}

.zoom-btn:hover {
  background-color: #40a8ee; /* Azul no hover */
}

/* Botão de localização */
.location-btn {
  background-color: #e6e9ec; /* Fundo claro */
  color: #0e0d0d; /* Texto escuro */
}

.location-btn:hover {
  background-color: #40a8ee; /* Azul no hover */
}

/* Container dos botões de camada */
.layer-selector {
  display: flex;
  gap: 8px;
}

/* Botões de seleção de camada */
.layer-btn {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #e8ebee; /* Fundo claro */
  color: #1a1818; /* Texto escuro */
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.layer-btn:hover {
  background-color: #a5aab1; /* Cinza no hover */
}

/* Estilo do botão ativo */
.layer-btn.active {
  background-color: #40a8ee; /* Azul quando ativo */
  font-weight: bold;
}

/* Estilos responsivos para dispositivos móveis */
@media (max-width: 768px) {
  .map-container {
    height: 400px; /* Altura menor em telas pequenas */
  }
  
  .map-controls {
    flex-direction: column; /* Empilha os controles verticalmente */
    align-items: stretch;
  }
  
  .layer-selector {
    width: 100%; /* Ocupa toda a largura */
  }
  
  .layer-btn {
    flex: 1; /* Distribui o espaço igualmente */
    text-align: center;
  }
}
</style>