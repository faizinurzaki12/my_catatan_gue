// src/lib/supabase.js
//
// Pengganti assets/js/supabase-init.js dari versi lama.
// Sebelumnya URL & anon key ditulis langsung di file JS, sekarang
// dipindah ke variabel environment (.env) supaya lebih rapi saat
// dipakai di banyak environment (dev/staging/prod).
//
// CATATAN DEV: kalau nanti pindah project Supabase, cukup ubah isi
// file .env — tidak perlu sentuh kode sama sekali.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Sengaja pakai console.error, bukan throw, biar build tetap jalan
  // walau .env belum diisi (misal saat preview tanpa backend).
  console.error(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Cek file .env kamu.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
