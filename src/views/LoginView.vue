<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-side">
        <div>
          <h2>Catatan Keuangan</h2>
          <p>Kelola pemasukan, pengeluaran, dan target tabunganmu dalam satu tempat yang simpel dan rapi.</p>
        </div>
        <div class="auth-footer-info">
          <strong>{{ config.appName }} {{ config.version }}</strong><br />
          Dikembangkan oleh {{ config.developer }}<br />
          &copy; {{ config.year }} All Rights Reserved
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-brand">Selamat Datang 👋</div>
        <div class="auth-sub">Masuk ke akun kamu untuk lanjut mencatat</div>

        <div v-if="errorMsg" class="alert-box error">{{ errorMsg }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" required autocomplete="email" />
          </div>
          <div class="field">
            <label>Password</label>
            <input v-model="password" type="password" required minlength="6" autocomplete="current-password" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <BaseSpinner v-if="isLoading" />
            {{ isLoading ? 'Tunggu bentar...' : 'Masuk' }}
          </button>
        </form>

        <div class="switch-text">
          Belum punya akun?
          <RouterLink to="/daftar">Daftar di sini</RouterLink>
        </div>

        <div class="mobile-footer-info">
          {{ config.appName }} <strong>{{ config.version }}</strong> &bull; &copy; {{ config.year }} {{ config.developer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { terjemahkanErrorAuth } from '../utils/format'
import { APP_CONFIG as config } from '../config'
import BaseSpinner from '../components/BaseSpinner.vue'

const router = useRouter()
const { login, getRole } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  isLoading.value = true

  const { data, error } = await login(email.value.trim(), password.value)

  if (error) {
    isLoading.value = false
    errorMsg.value = terjemahkanErrorAuth(error.message)
    password.value = ''
    return
  }

  // Cek role user buat nentuin halaman tujuan, sama seperti auth.js lama.
  const role = await getRole(data.user.id)
  isLoading.value = false

  if (role === 'admin' || role === 'superadmin') {
    // Catatan: halaman admin belum ada di versi Vue ini (belum di-migrasi,
    // memang tidak termasuk file yang dikirim). Arahkan ke dashboard biasa
    // dulu supaya tidak 404.
    router.push('/dashboard')
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-auth) 0%, var(--color-auth-dark) 100%);
}

.auth-wrapper {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  min-height: 520px;
}

.auth-side {
  flex: 1;
  background: linear-gradient(160deg, var(--color-auth-dark), var(--color-auth));
  color: #fff;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.auth-side h2 {
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.auth-side p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.6;
}

.auth-footer-info {
  position: relative;
  z-index: 1;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.auth-form-panel {
  flex: 1;
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-brand {
  font-weight: 700;
  font-size: 1.4rem;
  color: #2d2d2d;
  margin-bottom: 6px;
}

.auth-sub {
  color: #8a8a8a;
  font-size: 0.9rem;
  margin-bottom: 28px;
}

.btn-block {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
}

.switch-text {
  text-align: center;
  margin-top: 20px;
  font-size: 0.88rem;
  color: #6c757d;
}

.switch-text :deep(a) {
  text-decoration: none;
  font-weight: 600;
  color: var(--color-auth);
}
.switch-text :deep(a:hover) {
  text-decoration: underline;
}

.mobile-footer-info {
  display: none;
  text-align: center;
  font-size: 0.75rem;
  color: #a0a0a0;
  margin-top: 25px;
  line-height: 1.4;
}

@media (max-width: 767px) {
  .auth-side {
    display: none;
  }
  .auth-wrapper {
    min-height: auto;
  }
  .auth-form-panel {
    padding: 40px 28px;
  }
  .mobile-footer-info {
    display: block;
  }
}
</style>
