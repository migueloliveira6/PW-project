<template>
  <div>
    <Header />
    <div class="container mt-5 mb-5">
      <h2 class="mb-4">Submissões de Ocorrências</h2>
      <div class="row">
        <!-- Coluna do Formulário -->
        <div class="col-md-6">
          <b-form @submit.prevent="submitOccurrence" class="form-card">
            <!-- Título -->
            <b-form-group label="Título*" label-for="title" class="mb-4 text-start">
              <b-form-input
                id="title"
                v-model="form.title"
                required
                placeholder="Ex: Veículo mal estacionado"
                class="form-control"
              />
            </b-form-group>

            <!-- Tipo de Ocorrência -->
            <b-form-group label="Tipo de Ocorrência*" class="mb-4 text-start">
              <b-form-select
                v-model="form.type"
                :options="occurrenceTypes"
                required
                class="form-select"
              />
            </b-form-group>

            <!-- Descrição -->
            <b-form-group label="Descrição*" class="mb-4 text-start">
              <b-form-textarea
                v-model="form.description"
                rows="4"
                required
                placeholder="Escreva a sua descrição aqui..."
                class="form-control"
              />
            </b-form-group>

            <!-- Fotografias -->
            <div class="mb-4 text-start">
              <label class="form-label">Fotografias</label>
              <div class="photo-container d-flex justify-content-start gap-3">
                <div
                  v-for="(photo, index) in form.photos"
                  :key="index"
                  class="photo-placeholder text-center"
                  @click="triggerPhotoInput(index)"
                >
                  <span v-if="!photo" class="text-muted">+</span>
                  <img
                    v-else
                    :src="photo"
                    alt="Foto"
                    class="photo-preview"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="d-none"
                  ref="photoInput"
                  @change="handlePhotoUpload"
                  multiple
                />
              </div>
            </div>

            <!-- Ficheiros -->
            <div class="mb-4 text-start">
              <label for="ficheiros" class="form-label">Ficheiros (máx: 5)</label>
              <div class="d-flex align-items-center">
                <button type="button" class="btn btn-custom-file me-2" @click="$refs.fileInput.click()">
                  Escolher Ficheiros
                </button>
                <input
                  type="file"
                  class="form-control d-none"
                  id="ficheiros"
                  multiple
                  @change="updateFileName"
                  ref="fileInput"
                />
                <span class="text-muted">{{ fileLabel }}</span>
              </div>
              <!-- Lista de ficheiros salvos -->
              <ul v-if="form.files.length" class="file-list mt-2">
                <li v-for="(file, index) in form.files" :key="index">
                  {{ file.name }}
                </li>
              </ul>
            </div>

            <!-- Dados Pessoais -->
            <div class="mb-4 text-start">
              <label class="form-label">Dados Pessoais*</label>
              <div class="row">
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control mb-2"
                    placeholder="Nome Completo"
                    v-model="form.fullName"
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control mb-2"
                    placeholder="NIF"
                    v-model="form.nif"
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="telphone"
                    class="form-control mb-2"
                    placeholder="Contacto"
                    v-model="form.contact"
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="email"
                    class="form-control mb-2"
                    placeholder="E-mail"
                    v-model="form.email"
                  />
                </div>
              </div>
            </div>

            <!-- Termos e Condições -->
            <div class="mb-4 form-check custom-form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="termosCondicoes"
                v-model="form.termsAccepted"
                required
              />
              <label class="form-check-label" for="termosCondicoes">
                Li e aceito os termos e condições da Política de Privacidade*
              </label>
            </div>

            <!-- Botão Enviar -->
            <b-button type="submit" class="btn btn-custom">
              <b-icon icon="check-circle" class="mr-2"></b-icon>
              Enviar
            </b-button>
          </b-form>
        </div>

        <!-- Coluna do Mapa -->
        <div class="col-md-6 d-flex flex-column">
          <div class="map-placeholder">
            <div class="map-overview" ref="mapOverview"></div>
          </div>
          <b-form-group label="Localização no Mapa" class="location-field">
            <b-form-input
              v-model="form.address"
              class="form-control"
              readonly
              placeholder="Clique no mapa para selecionar"
            />
          </b-form-group>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from './Footer.vue';
import Header from './Header.vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

export default {
  name: "Ocorrencias",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      form: {
        id: null,
        title: '',
        lat: null,
        lng: null,
        address: '',
        type: null,
        description: '',
        status: 'open',
        createdAt: null,
        fullName: '',
        nif: '',
        contact: '',
        email: '',
        files: [],
        photos: Array(6).fill(null), // Inicializa com 6 slots para fotos
        termsAccepted: false,
      },
      occurrenceTypes: [
        { value: 'bad_parking', text: 'Veículo mal-estacionado' },
        { value: 'reserved_spots', text: 'Ocupação indevida de lugares reservados' },
        { value: 'congestion', text: 'Congestionamento' },
        { value: 'other', text: 'Outros' }
      ],
      overviewMap: null,
      overviewMarker: null,
      fileLabel: 'Nenhum ficheiro selecionado',
      currentPhotoIndex: null,
      latitude:'',
      longitude: '',
    };
  },
  mounted() {
    this.initMaps();
    this.loadSavedData();
  },
  methods: {
    initMaps() {
      this.overviewMap = new google.maps.Map(this.$refs.mapOverview, {
        center: { lat: 39.3999, lng: -8.2245 },
        zoom: 6.6,
        disableDefaultUI: true,
      });

      this.overviewMap.addListener('click', (e) => {
        this.setLocation(e.latLng);
        this.geocodeLocation(e.latLng);
      });
    },

    setLocation(latLng) {
      this.form.lat = latLng.lat();
      this.form.lng = latLng.lng();

      if (!this.overviewMarker) {
        this.overviewMarker = new google.maps.Marker({
          map: this.overviewMap,
          position: latLng,
          draggable: true,
        });
        this.overviewMarker.addListener('dragend', (e) => {
          this.latitude = latLng.lat();
          this.longitude = latLng.lat();
          this.geocodeLocation(e.latLng);
        });
      } else {
        this.overviewMarker.setPosition(latLng);
          this.latitude = latLng.lat();
          this.longitude = latLng.lat();
          console.log(this.latitude, this.longitude)
      }
      this.latitude = latLng.lat();
      this.longitude = latLng.lng();
      // console.log(this.longitude,this.latitude)
      this.overviewMap.setCenter(latLng);
      this.overviewMap.setZoom(12);
    },

    geocodeLocation(latLng) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.form.address = results[0].formatted_address;
        }
      });
    },

    triggerPhotoInput(index) {
      this.currentPhotoIndex = index;
      this.$refs.photoInput.click();
    },

    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$set(this.form.photos, this.currentPhotoIndex, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    updateFileName(event) {
      const input = event.target;
      if (input.files.length > 0) {
        this.form.files = Array.from(input.files);
        this.fileLabel = `${input.files.length} ficheiro(s) selecionado(s)`;
      } else {
        this.form.files = [];
        this.fileLabel = "Nenhum ficheiro selecionado";
      }
    },

    loadSavedData() {
      const savedPhotos = localStorage.getItem('savedPhotos');
      if (savedPhotos) {
        this.form.photos = JSON.parse(savedPhotos);
      }

      const savedFiles = localStorage.getItem('savedFiles');
      if (savedFiles) {
        const fileNames = JSON.parse(savedFiles);
        this.form.files = fileNames.map(file => new File([], file.name));
        this.fileLabel = `${fileNames.length} ficheiro(s) selecionado(s)`;
      }
    },

    updateFileName(event) {
      const input = event.target;
      if (input.files.length > 0) {
        this.form.files = Array.from(input.files);  // Armazena os arquivos na variável 'files'
        this.fileLabel = `${input.files.length} ficheiro(s) selecionado(s)`;  // Atualiza o rótulo com a quantidade de arquivos
      } else {
        this.form.files = [];
        this.fileLabel = "Nenhum ficheiro selecionado";
      }
    },

    async submitOccurrence() {
      if (!this.form.lat || !this.form.lng) {
        alert('Por favor, clique no mapa para selecionar uma localização.');
        return;
      }

      const formData = new FormData();

      formData.append('json_data', JSON.stringify({
        nome: this.form.title,
        tipo: this.form.type,
        descricao: this.form.description,
        dnome: this.form.fullName,
        dnif: this.form.nif,
        dcontacto: this.form.contact,
        demail: this.form.email,
        location: this.form.address,
        lat: this.latitude,
        lng: this.longitude
      }));

      // Adiciona as fotos convertidas em Blob ao FormData
      this.form.photos.forEach((photo, index) => {
        if (photo && photo.startsWith('data:')) {
          const blob = this.dataURLtoBlob(photo); // Função para converter dataURL para Blob
          formData.append(`photo_${index}`, blob, `photo_${index}.jpg`);
        }
      });

      // Adiciona os arquivos ao FormData
      this.form.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      try {
        const response = await axios.post('/auditoria/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Ocorrência registrada com sucesso!');
        console.log(response.data);
        this.resetForm();
      } catch (error) {
        console.error('Erro ao registrar ocorrência:', error);
        alert('Erro ao registrar ocorrência');
      }
    },

    resetForm() {
    this.form = {
    title: '',
    type: null,
    description: '',
    photos: Array(6).fill(null),
    files: [],
    fullName: '',
    nif: '',
    contact: '',
    email: '',
    address: '',
    lat: null,
    lng: null,
    termsAccepted: false,
    };
  // Limpa os inputs file
  if (this.$refs.fileInput) this.$refs.fileInput.value = null;
  if (this.$refs.photoInput) this.$refs.photoInput.value = null;
   // Limpa o mapa
   // Limpa o marcador do mapa
    if (this.overviewMarker) {
      this.overviewMarker.setMap(null);
      this.overviewMarker = null;
    }
    // Limpa o mapa
    if (this.overviewMap) {
      this.overviewMap.setCenter({ lat: 39.3999, lng: -8.2245 });
      this.overviewMap.setZoom(6.6);
    }
  },
  
    // Função para converter Data URL para Blob
    dataURLtoBlob(dataURL) {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([uint8Array], { type: mimeString });
    },
  },
};
</script>

<style scoped>
/* Ajustando o fundo do contêiner principal */
.container {
  background-color: #252525;
  color: #fff;
  padding: 3rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

/* Título */
h2 {
  font-size: 2rem;
  color: #C49C74;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

/* Estilizando os campos do formulário */
.form-control,
.form-select {
  background-color: #979797;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
}

.form-control::placeholder,
.form-select::placeholder {
  color: #adb5bd;
}

/* Estilizando o textarea */
textarea.form-control {
  background-color: #495057;
  border-radius: 8px;
}

/* Estilizando o mapa de visão geral (à direita) */
.map-placeholder {
  width: 100%;
  height: 400px;
  margin-top: 24px; /* Espaço acima do mapa */
}

.map-overview {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  border: 2px solid #6c757d;
  background-color: #495057;
}

/* Ajuste para o campo de localização ficar colado ao mapa */
.location-field {
  margin-top: 10px !important;
}

.location-field .form-control {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

/* Estilizando os placeholders de fotografia */
.photo-placeholder {
  border: 2px dashed #6c757d;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #495057;
  border-radius: 8px;
  cursor: pointer;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Contêiner para os quadrados */
.photo-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
}

/* Ajustando o espaçamento entre os quadrados */
.gap-3 {
  gap: 1rem;
}

/* Estilizando o botão "Escolher Ficheiros" */
.btn-custom-file {
  background-color: #979797;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Anaheim', sans-serif;
  font-size: 1rem;
}

.btn-custom-file:hover {
  background-color: #858585;
}

/* Estilizando o botão "Enviar" */
.btn-custom {
  background-color: #979797;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Anaheim', sans-serif;
  font-size: 1rem;
}

.btn-custom:hover {
  background-color: #858585;
}

/* Ajustando o texto dos labels */
.form-label,
.form-check-label {
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
}

/* Ajustando o texto "Nenhum ficheiro selecionado" */
.text-muted {
  color: #adb5bd !important;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
}

/* Estilizando a lista de ficheiros */
.file-list {
  list-style: none;
  padding: 0;
  color: #adb5bd;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
}

/* Ajuste para aproximar o texto do checkbox */
.custom-form-check .form-check-input {
  margin-right: 5px; /* Reduz o espaço entre o checkbox e o texto */
}

.custom-form-check .form-check-label {
  margin-left: 0; /* Remove qualquer margem à esquerda que o Bootstrap possa adicionar */
  padding-left: 0; /* Remove qualquer padding à esquerda */
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .photo-placeholder {
    width: 60px;
    height: 60px;
  }

  .photo-container {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .map-placeholder {
    height: 300px;
    margin-top: 15px;
  }
}
</style>