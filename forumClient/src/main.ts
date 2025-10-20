import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import '@/assets/main.css'
import '@/assets/base.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()

authStore.initializeAuth().then(async () => {
  app.use(router)
  app.mount('#app')

  // On attend le rendu complet
  await nextTick()

  // Gestion du preloader
  const preloader = document.getElementById('preloader')
  if (preloader) {
    preloader.classList.add('fade-out')
    setTimeout(() => preloader.remove(), 500)
  }
})
