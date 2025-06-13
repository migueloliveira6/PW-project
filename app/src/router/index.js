import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),  // Carregamento lazy
    meta: { title: 'Página Inicial' }
  },
  {
    path: '/ocorrencias',
    name: 'ocorrencias',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Ocorrencias.vue'),
    meta: { title: 'Ocorrências' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Atualiza o título da página com base na rota
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Sistema de Gestão de Ocorrências'
  next()
})

export default router
