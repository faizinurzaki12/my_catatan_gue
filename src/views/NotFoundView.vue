<!-- src/views/NotFoundView.vue -->
<template>
  <div class="notfound-page">
    <div class="notfound-box">
      <div class="icon">🧭</div>
      <h1>404</h1>
      <p>Halaman yang kamu cari tidak ditemukan.</p>
      <RouterLink to="/dashboard" class="btn btn-primary">Kembali ke Dashboard</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.notfound-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-auth) 0%, var(--color-auth-dark) 100%);
  padding: 20px;
}

.notfound-box {
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  max-width: 380px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.notfound-box h1 {
  font-size: 2.4rem;
  color: var(--color-auth);
  margin-bottom: 6px;
}

.notfound-box p {
  color: #666;
  margin-bottom: 22px;
}
</style>
