// src/composables/useAuth.js
//
// Pengganti assets/js/auth.js + assets/js/guard.js versi lama.
// Dulu logout/login pakai addEventListener manual per halaman, sekarang
// state user disimpan reaktif di sini dan dipakai bareng-bareng oleh
// semua komponen (router guard, sidebar, dsb).

import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// State reaktif dibuat di luar fungsi supaya semua yang import
// useAuth() nunjuk ke instance yang SAMA (mirip singleton store).
const user = ref(null)
const isReady = ref(false) // sudah selesai cek sesi awal atau belum

async function initAuth() {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
  isReady.value = true

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
}

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) user.value = data.user
  return { data, error }
}

async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

async function logout() {
  await supabase.auth.signOut()
  user.value = null
}

/** Ambil role user dari tabel profiles (dipakai buat redirect setelah login) */
async function getRole(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('[useAuth] gagal ambil role profile:', error.message)
    return null
  }
  return data?.role ?? null
}

export function useAuth() {
  return { user, isReady, initAuth, login, register, logout, getRole }
}
