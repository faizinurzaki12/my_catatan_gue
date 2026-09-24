<!-- src/components/AppLayout.vue -->
<template>
  <div class="wrapper">
    <!-- Navbar mobile -->
    <nav class="mobile-nav">
      <div class="mobile-nav-top">
        <span class="brand">Catatan Keuangan</span>
        <button class="burger" @click="menuOpen = !menuOpen" aria-label="Buka menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div v-show="menuOpen" class="mobile-nav-menu">
        <RouterLink to="/dashboard" @click="menuOpen = false">Beranda</RouterLink>
        <RouterLink to="/catatan" @click="menuOpen = false">Catatan Transaksi</RouterLink>
        <RouterLink to="/aktivitas" @click="menuOpen = false">Aktivitas</RouterLink>
        <a href="/logout" class="logout" @click.prevent="handleLogout">Logout</a>
        <div class="version-footer mobile">
          <div>{{ config.appName }} <strong>{{ config.version }}</strong> &bull; &copy; {{ config.year }} {{ config.developer }}</div>
        </div>
      </div>
    </nav>

    <!-- Sidebar desktop -->
    <aside class="sidebar">
      <div>
        <div class="brand">Catatan Keuangan</div>
        <nav>
          <RouterLink to="/dashboard">Beranda</RouterLink>
          <RouterLink to="/catatan">Catatan Transaksi</RouterLink>
          <RouterLink to="/aktivitas">Aktivitas</RouterLink>
          <a href="/logout" class="logout" @click.prevent="handleLogout">Logout</a>
        </nav>
      </div>
      <div class="version-footer desktop">
        <strong>{{ config.appName }} {{ config.version }}</strong><br />
        Dikembangkan oleh {{ config.developer }}<br />
        &copy; {{ config.year }} All Rights Reserved
      </div>
    </aside>

    <!-- Main content (Independent Scroll) -->
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { APP_CONFIG as config } from '../config'

const router = useRouter()
const { logout } = useAuth()
const menuOpen = ref(false)

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>

<style scoped>
/* Modifikasi Layar Utama: Batasi tinggi sesuai viewport */
.wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.brand {
  font-size: 19px;
  font-weight: bold;
  color: var(--color-primary);
}

/* --- Sidebar desktop Fixed --- */
.sidebar {
  width: 205px;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 0;
  flex-shrink: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar > div:first-child .brand {
  padding: 0 16px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10px;
}

.sidebar nav a {
  display: block;
  padding: 9px 6px;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
}

.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background: rgba(61, 169, 252, 0.15);
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar nav a.logout {
  color: #e02b4d;
  font-weight: 600;
  border-bottom: none;
}
.sidebar nav a.logout:hover {
  background: rgba(255, 0, 80, 0.08);
  color: #e02b4d;
}

.version-footer.desktop {
  padding: 14px 16px 0;
  font-size: 0.72rem;
  color: #8a8a8a;
  line-height: 1.4;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
}

/* --- Mobile nav --- */
.mobile-nav {
  display: none;
}

/* --- Main content (Menerapkan Independent Scroll) --- */
.main {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* Penyesuaian Tampilan Mobile */
@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .sidebar {
    display: none;
  }
  .mobile-nav {
    display: block;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  .mobile-nav-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }
  .burger {
    background: none;
    border: none;
    width: 28px;
    height: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }
  .burger span {
    display: block;
    height: 2.5px;
    width: 100%;
    background: #333;
    border-radius: 2px;
  }
  .mobile-nav-menu {
    display: flex;
    flex-direction: column;
    padding: 4px 16px 14px;
  }
  .mobile-nav-menu a {
    padding: 10px 4px;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .mobile-nav-menu a.router-link-active {
    color: var(--color-primary);
    font-weight: 600;
  }
  .mobile-nav-menu a.logout {
    color: #e02b4d;
    font-weight: 600;
    border-bottom: none;
  }
  .version-footer.mobile {
    font-size: 0.7rem;
    color: #8a8a8a;
    padding-top: 8px;
    margin-top: 6px;
    border-top: 1px solid #eee;
    text-align: center;
  }
  .main {
    height: auto;
    overflow-y: visible;
    padding: 14px;
  }
}
</style>