// src/config.js
// Pengganti APP_CONFIG di assets/js/config.js versi lama.
// Versi dinaikkan ke v2.0.0 karena ini migrasi total ke Vue 3 + Vite
// (bukan sekadar patch kecil), jadi pantas nya major version bump.

export const APP_CONFIG = {
  appName: 'Catatan Keuangan',
  version: 'v2.0',
  releaseDate: '24 Sep 2026',
  developer: 'Zaki Nur Faizi',
  year: '2026',
}

// CATATAN DEV (private, nggak ditampilkan ke user):
// - v1.1.1 -> v2.0.0: full rewrite dari HTML+jQuery-ish vanilla JS ke Vue 3
//   (Composition API + <script setup>) + Vue Router + Vite.
// - Bootstrap JS & SweetAlert2 dilepas, diganti komponen Vue sendiri
//   (AppModal, ToastStack) biar nggak dobel dependency cuma buat modal/alert.
// - Logika bisnis (goals, budget, transaksi) TIDAK diubah — hanya dipindah
//   dari DOM manipulation manual ke reactive state Vue. RPC Supabase
//   (proses_tabungan, tarik_tabungan) tetap dipakai apa adanya.
// - Transaksi tetap TIDAK BISA dihapus dari UI (sengaja, sesuai desain awal
//   biar riwayat keuangan user nggak bisa diutak-atik/dihapus diam-diam).
