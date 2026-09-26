import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { useAuth } from './composables/useAuth'
import './style.css'

const { initAuth } = useAuth()

// Pastikan sesi Supabase & listener auth siap SEBELUM app dipasang,
// supaya router guard yang cek isReady/user dapat state yang benar
// dari awal render, bukan nunggu race condition.
initAuth().finally(() => {
  createApp(App).use(router).mount('#app')
})