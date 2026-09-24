<!-- src/components/PageLoader.vue
     Loader dengan lingkaran + teks, dipasang di tengah kontainer yang
     lagi nunggu data (mirip .loader-container/.loader di CSS lama). -->
<template>
  <div class="loader-container">
    <div class="loader"></div>
    <div class="loader-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: 'Memuat data...' },
})
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  width: 100%;
  min-height: 140px;
  gap: 4px;
}

.loader {
  border: 5px solid #f0f0f0;
  border-top: 5px solid var(--color-success);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.85s linear infinite;
  margin-bottom: 10px;
}

.loader-text {
  font-size: 0.95rem;
  color: var(--color-success);
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
