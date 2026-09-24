// src/router/index.js
//
// Pengganti assets/js/guard.js. Dulu tiap halaman yang butuh login
// nge-include <script src="guard.js"> yang cek sesi lalu redirect manual.
// Sekarang cukup tandai route dengan meta: { requiresAuth: true } dan
// beforeEach di bawah yang urus semuanya, sekali jalan buat semua halaman.

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/daftar', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/catatan', name: 'catatan', component: () => import('../views/CatatanView.vue'), meta: { requiresAuth: true } },
  { path: '/aktivitas', name: 'aktivitas', component: () => import('../views/AktivitasView.vue'), meta: { requiresAuth: true } },
  { path: '/goals', name: 'goals', component: () => import('../views/GoalsView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const { user, isReady, initAuth } = useAuth()

  // Pastikan sesi sudah dicek minimal sekali sebelum route pertama dievaluasi
  // (penting buat direct load / refresh langsung ke /dashboard, dsb).
  if (!isReady.value) {
    await initAuth()
  }

  if (to.meta.requiresAuth && !user.value) {
    return { path: '/' }
  }

  if (to.meta.guestOnly && user.value) {
    return { path: '/dashboard' }
  }

  return true
})
