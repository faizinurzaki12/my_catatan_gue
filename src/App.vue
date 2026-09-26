<template>
  <RouterView />
  <ToastStack />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastStack from './components/ToastStack.vue'
import { useNotification } from './composables/useNotification'

const { initNotificationScheduler } = useNotification()

onMounted(() => {
  initNotificationScheduler()
})
</script>