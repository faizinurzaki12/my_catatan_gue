# Catatan Keuangan — v2.0.0 (Vue 3 + Vite)

Migrasi dari versi HTML/CSS/JS polos ke Vue 3 (Composition API + `<script setup>`),
Vue Router, dan Vite. Backend tetap Supabase (Auth + Postgres + RPC), skema tabel
dan aturan bisnis **tidak diubah** — hanya cara render UI-nya yang dipindah dari
manipulasi DOM manual ke reactive state Vue.

## Menjalankan

```bash
npm install
cp .env.example .env   # lalu isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY kalau beda
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Struktur

```
src/
├── main.js              # entry point
├── App.vue               # root: <RouterView/> + toast global
├── config.js              # nama app & versi (dulu assets/js/config.js)
├── style.css               # reset + CSS variables (warna, radius, shadow)
├── lib/supabase.js          # client Supabase (dulu supabase-init.js)
├── router/index.js           # routing + auth guard (dulu guard.js)
├── composables/
│   ├── useAuth.js              # session state, login/register/logout
│   └── useToast.js              # notifikasi toast (pengganti SweetAlert2)
├── utils/format.js               # format Rupiah, tanggal, dsb
├── components/
│   ├── AppLayout.vue               # sidebar desktop + navbar mobile
│   ├── AppModal.vue                 # modal (pengganti Bootstrap JS modal)
│   ├── ToastStack.vue                # render toast aktif
│   ├── BaseSpinner.vue                # spinner kecil di tombol
│   ├── PageLoader.vue                  # loader lingkaran + teks (section)
│   └── SkeletonBlock.vue                # skeleton shimmer buat list/kartu
└── views/
    ├── LoginView.vue      →  /
    ├── RegisterView.vue   →  /daftar
    ├── DashboardView.vue  →  /dashboard   (ringkasan, budget, goals widget)
    ├── CatatanView.vue    →  /catatan     (tabel transaksi bulan berjalan)
    ├── AktivitasView.vue  →  /aktivitas   (riwayat + tambah transaksi)
    ├── GoalsView.vue      →  /goals       (target tabungan)
    └── NotFoundView.vue   →  404
```

## Yang berubah dari versi lama

- **Bootstrap CSS/JS & SweetAlert2 dilepas.** Modal dan notifikasi sekarang
  komponen Vue sendiri (`AppModal.vue`, `ToastStack.vue`) — lebih ringan,
  gak dobel dependency cuma buat popup kecil.
- **Loading state pakai `ref(isLoading)` bawaan Vue**, ditampilkan sebagai:
  - **Skeleton** (`SkeletonBlock.vue`) di kartu ringkasan dashboard & baris
    tabel — dipasang saat data *pertama kali* dimuat.
  - **Spinner** (`BaseSpinner.vue`) di dalam tombol saat submit form (simpan
    transaksi, atur budget, isi/tarik tabungan, dsb).
  - **PageLoader** (lingkaran + teks) buat list yang lebih besar (aktivitas,
    goals) — mirip `.loader-container` versi lama tapi jadi komponen.
- **Kredensial Supabase dipindah ke `.env`**, bukan ditulis langsung di file JS.
- Halaman **Goals** yang di versi lama disembunyikan di balik modal "Coming
  Soon" sekarang aktif penuh (linknya sudah lengkap di file lama, cuma
  belum disambungkan) — link "Target Goals" di dashboard sekarang langsung
  ke halaman goals yang sungguhan.
- Struktur DOM sidebar/navbar yang dulu di-copy-paste di 3 halaman HTML
  sekarang jadi satu komponen `AppLayout.vue`.

## Yang TIDAK berubah (sengaja)

- **Transaksi tetap tidak bisa dihapus dari UI.** Tidak ada tombol/aksi
  hapus untuk tabel `transaksi` di mana pun — sesuai desain awal aplikasi.
- Goal cuma bisa dihapus kalau `terkumpul` masih 0 (logika sama seperti
  `goals.js` lama, sekarang lewat `:disabled` di tombol).
- RPC `proses_tabungan` dan `tarik_tabungan` dipanggil apa adanya, tidak ada
  perubahan parameter atau nama fungsi.
- Nama kolom & tabel Supabase (`transaksi`, `goals`, `budgets`, `profiles`)
  tidak diubah sama sekali.

## Catatan developer (private)

- Login masih ngecek `role` dari tabel `profiles` buat bedain admin vs user
  biasa, tapi karena file HTML admin tidak ada di paket project lama yang
  dikirim, redirect admin untuk sementara diarahkan ke `/dashboard` juga
  (lihat komentar di `LoginView.vue`). Tinggal ganti kalau halaman admin-nya
  sudah dibuatkan terpisah.
- Anon key Supabase yang ada di `.env.example` itu publishable key (aman utk
  dipaparkan di client), bukan service role key — tetap jangan pernah taruh
  service role key di frontend.
