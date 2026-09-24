<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-side">
        <div>
          <div class="auth-side-icon">🚀</div>
          <h2>Mulai Sekarang</h2>
          <p>Buat akun gratis dan mulai kelola keuanganmu dengan lebih terarah, mulai hari ini.</p>
        </div>
        <div class="auth-footer-info">
          <strong>{{ config.appName }} {{ config.version }}</strong><br />
          Dikembangkan oleh {{ config.developer }}<br />
          &copy; {{ config.year }} All Rights Reserved
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-brand">Buat Akun Baru ✨</div>
        <div class="auth-sub">Isi data di bawah untuk mendaftar</div>

        <div v-if="errorMsg" class="alert-box error">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert-box success">{{ successMsg }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" required autocomplete="email" />
          </div>
          <div class="field">
            <label>Password</label>
            <input v-model="password" type="password" required minlength="6" autocomplete="new-password" />
          </div>
          <div class="field">
            <label>Konfirmasi Password</label>
            <input v-model="passwordConfirm" type="password" required minlength="6" autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <BaseSpinner v-if="isLoading" />
            {{ isLoading ? 'Tunggu Bentar Yaaa....' : 'Daftar' }}
          </button>
        </form>

        <div class="switch-text">
          Sudah punya akun?
          <RouterLink to="/">Masuk di sini</RouterLink>
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
import { useAuth } from '../composables/useAuth'
import { terjemahkanErrorAuth } from '../utils/format'
import { APP_CONFIG as config } from '../config'
import BaseSpinner from '../components/BaseSpinner.vue'

const { register } = useAuth()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = 'Password minimal 6 karakter.'
    return
  }

  isLoading.value = true
  const { data, error } = await register(email.value.trim(), password.value)
  isLoading.value = false

  if (error) {
    errorMsg.value = terjemahkanErrorAuth(error.message)
    return
  }

  if (data.user && !data.session) {
    successMsg.value = 'Pendaftaran berhasil! Silakan cek email kamu untuk konfirmasi sebelum login.'
    email.value = ''
    password.value = ''
    passwordConfirm.value = ''
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
  min-height: 560px;
}

.auth-side {
  flex: 1;
  background: linear-gradient(160deg, var(--color-auth-dark), var(--color-auth));
  color: #fff;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-side-icon {
  font-size: 2.6rem;
  margin-bottom: 18px;
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
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.auth-form-panel {
  flex: 1;
  padding: 44px;
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
  margin-bottom: 24px;
}

.btn-block {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
}

.switch-text {
  text-align: center;
  margin-top: 18px;
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
  margin-top: 20px;
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
