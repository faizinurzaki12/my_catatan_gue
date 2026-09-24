<!-- src/components/BaseSpinner.vue
     Spinner kecil buat dipasang di dalam tombol (mis. saat submit form).
     Ganti dari <span class="spinner-border spinner-border-sm">...</span>
     punya Bootstrap di versi lama. -->
<template>
  <span class="base-spinner" :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true"></span>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 16 },
})
</script>

<style scoped>
.base-spinner {
  display: inline-block;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: base-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes base-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
