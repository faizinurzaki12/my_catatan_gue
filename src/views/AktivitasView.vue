<!-- src/views/AktivitasView.vue -->
<template>
  <AppLayout>
    <div class="page-title">Semua Aktivitas</div>

    <div class="card-aktivitas">
      <div class="card-head">
        <div class="card-head-title">Riwayat Seluruh Aktivitas Keuangan</div>
        <div class="action-buttons">
          <button class="btn btn-success btn-sm" @click="bukaModal('pemasukan')">+ Pemasukan</button>
          <button class="btn btn-danger btn-sm" @click="bukaModal('pengeluaran')">- Pengeluaran</button>
        </div>
      </div>

      <div class="list-wrapper">
        <PageLoader v-if="isLoading" text="Memuat data transaksi..." />

        <div v-else-if="listAktivitas.length === 0" class="empty-note">
          Belum ada transaksi di bulan ini.
        </div>

        <div v-else class="aktivitas-item" v-for="item in listAktivitas" :key="item.id">
          <div class="item-left">
            <div class="item-title">{{ item.deskripsi }}</div>
            <div class="item-time">{{ formatTanggalJam(item.created_at) }}</div>
          </div>
          <div class="item-price" :class="item.tipe === 'pemasukan' ? 'masuk' : 'keluar'">
            {{ item.tipe === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.jumlah) }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Modal Tambah Transaksi ===== -->
    <AppModal v-model="showModal" :title="modalTipe === 'pemasukan' ? 'Uang Masuk' : 'Uang Keluar'">
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label :class="modalTipe === 'pemasukan' ? 'text-success' : 'text-danger'">Deskripsi</label>
          <input v-model="formDeskripsi" type="text" required :placeholder="modalTipe === 'pemasukan' ? 'Contoh: Gajihan...' : 'Contoh: Beli Mie...'" />
        </div>
        <div class="field">
          <label :class="modalTipe === 'pemasukan' ? 'text-success' : 'text-danger'">Jumlah</label>
          <div class="input-prefix">
            <span>Rp</span>
            <input :value="formJumlahTampil" @input="onJumlahInput" type="text" inputmode="numeric" autocomplete="off" placeholder="0" required />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-block"
          :class="modalTipe === 'pemasukan' ? 'btn-success' : 'btn-danger'"
          :disabled="isSubmitting"
        >
          <BaseSpinner v-if="isSubmitting" />
          {{ isSubmitting ? 'Memproses...' : 'Simpan' }}
        </button>
      </form>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { formatRupiah, formatTanggalJam, getRentangBulanIni, parseAngkaFormat, formatRibuan } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import AppModal from '../components/AppModal.vue'
import PageLoader from '../components/PageLoader.vue'
import BaseSpinner from '../components/BaseSpinner.vue'

const { user } = useAuth()
const { showToast } = useToast()

const isLoading = ref(true)
const listAktivitas = ref([])

const showModal = ref(false)
const modalTipe = ref('pemasukan') // 'pemasukan' | 'pengeluaran'
const formDeskripsi = ref('')
const formJumlahTampil = ref('') // versi terformat "1.000.000" buat ditampilkan
const formJumlahAngka = ref(0) // versi angka murni buat dikirim ke Supabase
const isSubmitting = ref(false)

/** Sama seperti muatData() di aktivitas.js lama */
async function muatData() {
  isLoading.value = true

  const { awal, akhir } = getRentangBulanIni()
  const { data, error } = await supabase
    .from('transaksi')
    .select('*')
    .eq('user_id', user.value.id)
    .gte('created_at', awal)
    .lt('created_at', akhir)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal memuat data transaksi:', error.message)
    showToast({ type: 'error', title: 'Gagal memuat data', text: error.message })
    isLoading.value = false
    return
  }

  listAktivitas.value = data || []
  isLoading.value = false
}

/** Sama seperti hitungSaldo() di aktivitas.js lama (dipakai buat validasi pengeluaran) */
async function hitungSaldo() {
  const { data, error } = await supabase.from('transaksi').select('tipe, jumlah').eq('user_id', user.value.id)
  if (error) throw error
  return (data || []).reduce((total, t) => (t.tipe === 'pemasukan' ? total + t.jumlah : total - t.jumlah), 0)
}

function bukaModal(tipe) {
  modalTipe.value = tipe
  formDeskripsi.value = ''
  formJumlahTampil.value = ''
  formJumlahAngka.value = 0
  showModal.value = true
}

/** Live-format input nominal jadi "1.000.000" sambil ketik, mirip pasangFormatRibuan() lama */
function onJumlahInput(e) {
  const angka = parseAngkaFormat(e.target.value)
  formJumlahAngka.value = angka
  formJumlahTampil.value = angka ? formatRibuan(angka) : ''
}

async function handleSubmit() {
  const jumlah = formJumlahAngka.value
  const deskripsi = formDeskripsi.value.trim()

  if (!jumlah || jumlah <= 0 || !deskripsi) {
    showToast({ type: 'warning', title: 'Input Belum Lengkap', text: 'Mohon isi deskripsi dan jumlah uang dengan benar ya!' })
    return
  }

  isSubmitting.value = true

  try {
    if (modalTipe.value === 'pengeluaran') {
      const saldoSaatIni = await hitungSaldo()
      if (jumlah > saldoSaatIni) {
        showToast({
          type: 'error',
          title: 'Saldo Tidak Cukup',
          text: `Saldo kamu saat ini ${formatRupiah(saldoSaatIni)}, tidak cukup untuk pengeluaran ${formatRupiah(jumlah)}.`,
        })
        return
      }
    }

    const { error } = await supabase.from('transaksi').insert([
      { user_id: user.value.id, tipe: modalTipe.value, jumlah, deskripsi },
    ])

    if (error) throw error

    showModal.value = false
    showToast({ type: 'success', title: 'Mantap!', text: `Transaksi "${deskripsi}" sebesar ${formatRupiah(jumlah)} berhasil disimpan!` })
    await muatData()
  } catch (err) {
    console.error('Gagal menambah transaksi:', err.message || err)
    showToast({ type: 'error', title: 'Waduh, Gagal!', text: 'Gagal menyimpan transaksi: ' + (err.message || err) })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(muatData)
</script>

<style scoped>
.page-title {
  background: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: bold;
  color: var(--color-primary);
  padding: 8px 14px;
  border-radius: 8px;
  width: fit-content;
}

.card-aktivitas {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.card-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eef1f5;
  padding-bottom: 14px;
  margin-bottom: 14px;
}

.card-head-title {
  color: var(--color-primary-dark);
  font-weight: bold;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.aktivitas-item {
  background: #fff;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  font-weight: 600;
  color: #333;
}

.item-time {
  font-size: 0.78rem;
  color: #888;
  margin-top: 2px;
}

.item-price {
  font-weight: bold;
  font-size: 0.95rem;
}

.masuk {
  color: var(--color-success) !important;
}
.keluar {
  color: var(--color-danger) !important;
}

.empty-note {
  text-align: center;
  color: #888;
  padding: 40px 0;
}

.input-prefix {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}
.input-prefix span {
  padding: 11px 14px;
  background: #f4f6fb;
  font-weight: 700;
  color: #8892a4;
  border-right: 1.5px solid var(--color-border);
}
.input-prefix input {
  flex: 1;
  padding: 11px 14px;
  border: none !important;
  outline: none;
  font-size: 0.92rem;
}

.text-success {
  color: var(--color-success) !important;
}
.text-danger {
  color: var(--color-danger) !important;
}

.btn-block {
  width: 100%;
  padding: 13px;
  margin-top: 6px;
}

@media (max-width: 768px) {
  .action-buttons {
    width: 100%;
  }
  .action-buttons button {
    flex: 1;
  }
  .card-head-title {
    width: 100%;
    text-align: center;
  }
}
</style>
