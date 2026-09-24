<!-- src/components/SkeletonBlock.vue
     Placeholder abu-abu shimmer buat state loading pertama kali (dipakai di
     kartu ringkasan dashboard, baris tabel, dsb). Dipakai bareng v-if/v-else
     dengan isLoading, bukan sekadar teks "Memuat...". -->
<template>
  <div
    class="skeleton-block"
    :style="{ width, height, borderRadius: radius }"
  ></div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  radius: { type: String, default: '6px' },
})
</script>

<style scoped>
.skeleton-block {
  background: linear-gradient(90deg, #eceff3 25%, #f6f7f9 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
