// src/composables/useToast.js
//
// Pengganti SweetAlert2 (dulu dipakai di aktivitas.js buat alertOtomatis()).
// Dibikin custom & ringan sendiri di Vue supaya nggak perlu tarik library
// eksternal cuma buat notifikasi kecil, dan tampilannya senada sama sisa
// aplikasi (bukan style pop-up bawaan SweetAlert yang kelihatan "template").
//
// Dipakai: const { toasts, showToast } = useToast()
// showToast({ type: 'success' | 'error' | 'warning', title, text, duration })

import { ref } from 'vue'

const toasts = ref([])
let counter = 0

function showToast({ type = 'success', title = '', text = '', duration = 3500 } = {}) {
  const id = ++counter
  toasts.value.push({ id, type, title, text })
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration)
  }
  return id
}

function dismissToast(id) {
  const idx = toasts.value.findIndex((t) => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

export function useToast() {
  return { toasts, showToast, dismissToast }
}
