// src/config.js
// Pengganti APP_CONFIG di assets/js/config.js versi lama.
// Versi dinaikkan ke v2.0.0 karena ini migrasi total ke Vue 3 + Vite
// (bukan sekadar patch kecil), jadi pantas nya major version bump.

export const APP_CONFIG = {
  appName: 'Catatan Keuangan',
  version: 'v2.1',
  releaseDate: '26 Sep 2026',
  developer: 'Zaki Nur Faizi',
  year: '2026',
  
  // Riwayat Pembaruan / Changelog Aplikasi
  changelog: [
    {
      version: "v2.1",
      date: "26 September 2026",
      features: [
        "Menambahkan fitur notifikasi untuk pengingat nyatat keuangan",
        "Menambahkan fitur cegah user hapus tabungan sendiri",
        "Meng update fitur tabungan dengan fitur edit dan hapus juga",
      ],
      bugs: [
        "perbaikan fitur tabungan yang tadinya tidak bisa dihapus sekarang bisa dan ada tombol untuk mengedit",
        "di fitur notifikasi sebelumnya, tidak bisa di klik tombolnya",
        "Memperbaiki fitur sebelumnya",
        "Memperbaiki app nya, karna bug"
      ]
    },
    {
      version: "v2.0",
      date: "24 September 2026",
      features: [
        "Migrasi total dari HTML/Vanilla JS ke Vue 3 (Composition API + <script setup>) + Vite",
        "Menambahkan fitur Web Push Notification pengingat keuangan otomatis 4x sehari",
        "Mengganti Bootstrap JS & SweetAlert2 dengan komponen Vue mandiri (AppModal, ToastStack)",
        "Mengoptimalkan performa manajemen state reaktif untuk data transaksi, budget, dan goals"
      ],
      bugs: [
        "Memperbaiki kendala izin browser dan Service Worker pada fitur notifikasi native",
        "Membersihkan dependensi ganda yang tidak terpakai dari versi sebelumnya"
      ]
    },
    {
      version: "v1.1.5",
      date: "24 September 2026",
      features: [
        "Penyempurnaan logika Supabase RPC untuk proses tabungan dan tarik dana goals",
        "Menjaga aturan desain riwayat transaksi agar tidak bisa dihapus dari UI demi keamanan data"
      ],
      bugs: [
        "Memperbaiki perhitungan saldo total all-time yang sempat selisih dengan transaksi bulan berjalan"
      ]
    },
    {
      version: "v1.0",
      date: "Awal Pengembangan",
      features: [
        "Merilis platform awal Catatan Keuangan berbasis Web",
        "Menambahkan menu Beranda, Catatan Transaksi, Target Goals, dan pengaturan Budget bulanan"
      ],
      bugs: [
        "Inisialisasi struktur database awal di Supabase"
      ]
    }
  ]
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