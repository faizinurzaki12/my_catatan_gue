// src/utils/format.js
// Kumpulan helper format angka & tanggal, dipakai di beberapa halaman.
// Sebelumnya fungsi fmt() ditulis ulang beda-beda di tiap file JS lama
// (dashboard.js, catatan.js, aktivitas.js, goals.js) — sekarang cukup 1 sumber.

/** Format angka jadi "Rp 150.000" */
export function formatRupiah(angka) {
  const n = Number(angka) || 0
  return 'Rp ' + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

/** Format tanggal singkat, contoh: "12 Sep 2026" */
export function formatTanggalSingkat(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Format tanggal panjang + jam, contoh: "12 September 2026 | 14:30" */
export function formatTanggalJam(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${tgl} | ${jam}`
}

/** Ambil rentang awal-akhir bulan berjalan (dipakai buat query Supabase) */
export function getRentangBulanIni() {
  const sekarang = new Date()
  const awal = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
  const akhir = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 1)
  return { awal: awal.toISOString(), akhir: akhir.toISOString(), sekarang }
}

/** Bersihkan input "1.000.000" jadi angka 1000000 */
export function parseAngkaFormat(str) {
  if (str == null) return 0
  const bersih = String(str).replace(/[^0-9]/g, '')
  return bersih === '' ? 0 : parseInt(bersih, 10)
}

/** Kebalikan dari parseAngkaFormat, buat live-format input nominal */
export function formatRibuan(angka) {
  if (!angka) return ''
  return new Intl.NumberFormat('id-ID').format(angka)
}

/** Terjemahkan pesan error Supabase Auth ke Bahasa Indonesia yang ramah */
export function terjemahkanErrorAuth(msg) {
  if (!msg) return 'Terjadi kesalahan. Coba lagi ya.'
  if (msg.includes('Invalid login credentials')) return 'Email atau password salah.'
  if (msg.includes('User already registered')) return 'Email ini sudah terdaftar. Silakan login.'
  if (msg.includes('Password should be at least')) return 'Password minimal 6 karakter.'
  if (msg.includes('Unable to validate email')) return 'Format email tidak valid.'
  return msg
}
