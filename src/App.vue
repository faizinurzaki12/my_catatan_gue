<template>
  <RouterView />
  <ToastStack />

  <!-- Pop-Up Modal Notifikasi Pengingat -->
  <Teleport to="body">
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all text-center">
        <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          🔔
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          {{ activeNotification.title }}
        </h3>
        
        <p class="text-gray-600 text-sm mb-6">
          {{ activeNotification.message }}
        </p>

        <div class="flex gap-3">
          <button 
            @click="closeModal" 
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition"
          >
            Selesai / Catat Sekarang
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastStack from './components/ToastStack.vue'
import { useNotification } from './composables/useNotification'

const { showModal, activeNotification, closeModal, initNotificationScheduler } = useNotification()

onMounted(() => {
  initNotificationScheduler()
})
</script>