<!-- src/components/ToastStack.vue
     Render daftar toast dari useToast(). Ditaruh sekali di App.vue,
     jadi bisa dipanggil dari halaman mana pun lewat showToast(). -->
<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
          <span class="toast-icon">{{ iconFor(t.type) }}</span>
          <div class="toast-text">
            <strong v-if="t.title">{{ t.title }}</strong>
            <div v-if="t.text">{{ t.text }}</div>
          </div>
          <button class="toast-close" @click="dismissToast(t.id)" aria-label="Tutup">&times;</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismissToast } = useToast()

function iconFor(type) {
  if (type === 'success') return '✓'
  if (type === 'error') return '⚠'
  if (type === 'warning') return '!'
  return 'ℹ'
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2000;
  max-width: 340px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-left: 4px solid var(--color-primary);
  font-size: 0.86rem;
}

.toast.success {
  border-left-color: var(--color-success-btn);
}
.toast.error {
  border-left-color: var(--color-danger);
}
.toast.warning {
  border-left-color: var(--color-warning);
}

.toast-icon {
  font-weight: 700;
}
.toast.success .toast-icon {
  color: var(--color-success-btn);
}
.toast.error .toast-icon {
  color: var(--color-danger);
}
.toast.warning .toast-icon {
  color: var(--color-warning);
}

.toast-text {
  flex: 1;
  color: #333;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.1rem;
  line-height: 1;
}
.toast-close:hover {
  color: #666;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 480px) {
  .toast-stack {
    left: 12px;
    right: 12px;
    max-width: none;
  }
}
</style>
