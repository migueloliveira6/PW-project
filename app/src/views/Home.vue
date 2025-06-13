<template>
  <div id="home">
    <Header />
    <!-- Sobre Nós -->
    <section id="sobre-nos" class="about-section">
      <h1 class="text-center mb-5">Sobre Nós</h1>
      
      <b-row class="justify-content-center">
        <!-- Coluna 1 -->
        <b-col cols="12" md="4" class="mb-4">
          <div class="feature-card">
            <h3>Monitorização em Tempo Real</h3>
            <p>Monitorize trânsito, transportes públicos e estacionamento indevido</p>
          </div>
        </b-col>
        
        <!-- Coluna 2 -->
        <b-col cols="12" md="4" class="mb-4">
          <div class="feature-card">
            <h3>Dados e Auditorias</h3>
            <p>Consulte e compare ocorrências e auditorias sobre mobilidade urbana. Desde transportes atrasados a veículos mal estacionados, etc.</p>
          </div>
        </b-col>
        
        <!-- Coluna 3 -->
        <b-col cols="12" md="4" class="mb-4">
          <div class="feature-card">
            <h3>Registe e Resolva</h3>
            <p>Registe problemas e acompanhe soluções para uma mobilidade mais eficiente</p>
          </div>
        </b-col>
      </b-row>
    </section>
    
    <!-- Principais Indicadores da EyesEverywhere -->
    <section id="indicadores" class="metrics-section">
      <h2 class="text-center mb-5">Principais Indicadores da EyesEverywhere</h2>
      
      <b-row class="justify-content-center">
        <!-- Coluna 1 -->
        <b-col cols="6" md="3" class="mb-4">
          <div class="metric-card">
            <h4>Número de auditorias realizadas</h4>
            <p class="metric-value">{{ totalOccurrences }}</p>
          </div>
        </b-col>
        
        <!-- Coluna 2 -->
        <b-col cols="6" md="3" class="mb-4">
          <div class="metric-card">
            <h4>Ocorrências registadas e resolvidas</h4>
            <p class="metric-value">{{ totalOccurrences }}</p>
          </div>
        </b-col>
        
        <!-- Coluna 3 -->
        <b-col cols="6" md="3" class="mb-4">
          <div class="metric-card">
            <h4>Tempo médio de resposta</h4>
            <p class="metric-value">30min</p>
          </div>
        </b-col>
        
        <!-- Coluna 4 -->
        <b-col cols="6" md="3" class="mb-4">
          <div class="metric-card">
            <h4>Satisfação dos cidadãos</h4>
            <p class="metric-value">Excelente</p>
          </div>
        </b-col>
      </b-row>
    </section>
    
    <!-- Seção de Ocorrências com Mapa Interativo -->
    <section id="ocorrencias" class="occurrences-section py-5">
      <b-container>
        <b-row class="align-items-center"> <!-- Alinha verticalmente no centro -->
          <!-- Coluna da Esquerda - Estatísticas -->
          <b-col md="5" class="mb-4 mb-md-0 mt-5"> <!-- Adiciona uma margem superior -->
            <h2 class="mb-4 font-weight-bold">Ocorrências</h2>

            <div class="d-flex align-items-center mb-4">
              <img src="@/assets/perigo.png" alt="Alerta" class="alert-icon mr-3" />
              <span class="display-1 font-weight-bold" style="font-size: 7rem;">{{ totalOccurrences }}</span>
            </div>

            <div class="d-flex flex-column gap-4 status-cards mt-5">
              <div class="status-card open d-flex justify-content-between px-4 py-2">
                <span>Abertas</span>
                <span>{{ openOccurrences }}</span>
              </div>
              <div class="status-card analysis d-flex justify-content-between px-4 py-2">
                <span>Em Análise</span>
                <span>{{ analysisOccurrences }}</span>
              </div>
              <div class="status-card closed d-flex justify-content-between px-4 py-2">
                <span>Concluídas</span>
                <span>{{ closedOccurrences }}</span>
              </div>
            </div>
          </b-col>

          <!-- Coluna do Mapa Interativo -->
          <b-col md="6" class="ml-md-4">
            <div class="map-container">
              <!-- Mapa Google Maps interativo -->
              <div ref="map" class="interactive-map"></div>

              <!-- Controles do Mapa -->
              <div class="map-controls">
                <button class="control-btn zoom-btn" @click="zoomIn" title="Aproximar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="control-btn zoom-btn" @click="zoomOut" title="Afastar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
    <!-- Mapa de Trânsito -->
    <section id="transito" class="traffic-monitoring py-5">
      <maptraffic />
    </section>
    
    <!-- Footer -->
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script>
import Header from './Header.vue';
import maptraffic from './maptraffic.vue';
import Footer from './Footer.vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

export default {
  name: "Home",
  components: {
    Header,
    maptraffic,
    Footer,
  },
  data() {
    return {
      map: null,
      markers: [],
      occurrences: [],
      totalOccurrences: 0,
      openOccurrences: 0,
      analysisOccurrences: 0,
      closedOccurrences: 0
    };
  },
  mounted() {
    this.loadGoogleMaps();
    this.loadOccurrences();  // Carregar as ocorrências da API
    window.addEventListener('occurrence-updated', this.loadOccurrences);  // Atualiza as ocorrências quando um evento for disparado
  },
  beforeDestroy() {
    window.removeEventListener('occurrence-updated', this.loadOccurrences);  // Remove o ouvinte de evento quando o componente for destruído
  },
  methods: {
    loadGoogleMaps() {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=visualization,geocoding`;  // Incluindo o Geocoding
        script.defer = true;
        script.async = true;
        script.onload = this.initMap;
        document.head.appendChild(script);
      } else {
        this.initMap();
      }
    },

    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 39.3999, lng: -8.2245 },
        zoom: 7,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
        ]
      });
      this.addOccurrenceMarkers();
    },

    // Função modificada para buscar as ocorrências da API
    async loadOccurrences() {
      try {
        const response = await axios.get('/auditoria/get'); // Faz a requisição para a API para pegar as ocorrências
        this.occurrences = response.data; // Assume que a resposta da API seja um array de ocorrências
        this.totalOccurrences = this.occurrences.length;

        // Filtra as ocorrências de acordo com o status
        this.openOccurrences = this.occurrences.filter(o => o.status === 1).length;  // Status 'Aberta' (1)
        this.analysisOccurrences = this.occurrences.filter(o => o.status === 0).length;  // Status 'Em Análise' (0)
        this.closedOccurrences = this.occurrences.filter(o => o.status === 2).length;  // Status 'Concluída' (2)

        // Atualiza os marcadores no mapa
        this.addOccurrenceMarkers();
      } catch (error) {
        console.error('Erro ao carregar as ocorrências:', error);
      }
    },

    addOccurrenceMarkers() {
      if (!this.map) return;
      this.clearMarkers(); // Limpa os marcadores antigos

      const geocoder = new google.maps.Geocoder(); // Instancia o geocodificador

      this.occurrences.forEach(occurrence => {
        if (occurrence.location) {
          geocoder.geocode({ address: occurrence.location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              const latLng = results[0].geometry.location;

              // Adiciona o marcador para a ocorrência
              const marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: `${occurrence.nome} (${this.getStatusText(occurrence.status)})`,
                icon: this.getMarkerIcon(occurrence.status)
              });
              this.markers.push(marker); // Adiciona o marcador à lista de marcadores
            } else {
              console.error('Erro ao geocodificar o endereço: ', occurrence.location);
            }
          });
        }
      });
    },

    getMarkerIcon(status) {
      const baseIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1,
        strokeWeight: 2,
        scale: 8
      };
      switch(status) {
        case 1: return { ...baseIcon, fillColor: '#E74C3C', strokeColor: '#FFFFFF' };  // 'Aberta' (1)
        case 0: return { ...baseIcon, fillColor: '#E67E22', strokeColor: '#FFFFFF' };  // 'Em Análise' (0)
        case 2: return { ...baseIcon, fillColor: '#2ECC71', strokeColor: '#FFFFFF' };  // 'Concluída' (2)
        default: return { ...baseIcon, fillColor: '#3498DB', strokeColor: '#FFFFFF' };  // Outros
      }
    },

    getStatusText(status) {
      switch(status) {
        case 1: return 'Aberta';
        case 0: return 'Em Análise';
        case 2: return 'Concluída';
        default: return status;
      }
    },

    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null)); // Remove todos os marcadores do mapa
      this.markers = []; // Limpa a lista de marcadores
    },

    zoomIn() {
      if (this.map) this.map.setZoom(this.map.getZoom() + 1);
    },

    zoomOut() {
      if (this.map) this.map.setZoom(this.map.getZoom() - 1);
    }
  }
};
</script>

<style scoped>

.about-section {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.feature-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  height: 100%; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.feature-card p {
  color: #555; /* Cor mais suave */
  line-height: 1.5;
  font-family: 'Anaheim', sans-serif;
  font-size: 1.15rem;
  animation: fadeIn 1.2s ease forwards;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-family: Anaheim;
  font-weight: bold;
}

p {
  color: #666;
  line-height: 1.6;
  font-family: Anaheim;
  font-size: 1.2rem;
}

.metrics-section {
  padding: 4rem 2rem;
  background: #C49C74;
}

.metric-card {
  background: #C49C74;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
  border-top: 4px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  animation: fadeIn 1.2s ease forwards;
  margin: 0;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(10px);}
  to {opacity: 1; transform: translateY(0);}
}

h2 {
  color: #0a0a0a;
  font-size: 2rem;
}

h4 {
  color: #1b1b1b;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  min-height: 3rem;
  font-weight: 600;
}

.occurrences-section {
  background-color: #f8f9fa;
  padding: 4rem 0;
}

.occurrences-section h2 {
  margin-bottom: 1rem;
}

.alert-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.alert-icon {
  width: 110px;
  height: auto;
  margin-right: 25px;
}

.status-cards {
  margin-top: 10rem;
  width: 100%;
}

.status-card {
  border-radius: 10px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  padding: 12px 20px;
  font-size: 1.2rem;
}

.open {
  background-color: #E74C3C;
}

.analysis {
  background-color: #E67E22;
}

.closed {
  background-color: #2ECC71;
}

/* Novos estilos para o mapa interativo */
.map-container {
  position: relative;
  width: 70%;
  height: 590px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-left: auto;
}

.interactive-map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: #f1f1f1;
  transform: scale(1.1);
}

.traffic-monitoring {
  background-color: #212122;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .map-container {
    height: 500px;
    width: 100%;
  }
  
  .status-cards {
    margin-top: 2rem;
  }
  
  .alert-icon {
    width: 80px;
    margin-right: 15px;
  }
  
  .display-1 {
    font-size: 5rem !important;
  }
}
</style>