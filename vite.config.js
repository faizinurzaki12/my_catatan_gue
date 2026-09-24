import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true // Mengaktifkan PWA saat dites di localhost
      },
      manifest: {
        name: 'Catatan Keuangan',
        short_name: 'Keuangan',
        description: 'Aplikasi Catatan Keuangan Harian',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone', // Supaya tampil seperti aplikasi HP native (tanpa address bar)
        icons: [
          {
            src: '/favicon.ico',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})