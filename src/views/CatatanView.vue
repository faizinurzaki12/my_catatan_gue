<!-- src/views/CatatanView.vue -->
<template>
  <AppLayout>
    <div class="print-row">
      <a class="page-title" href="#" @click.prevent="cetak">Print</a>
    </div>

    <div class="table-container">
      <h3>Catatan Transaksi</h3>

      <div class="table-responsive">
        <table class="tabel-catatan">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Pemasukan</th>
              <th>Pengeluaran</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="i">
                <td colspan="5"><SkeletonBlock height="16px" /></td>
              </tr>
            </template>
            <tr v-else-if="dataBulanIni.length === 0">
              <td colspan="5" class="text-center">Belum ada catatan transaksi di bulan ini.</td>
            </tr>
            <tr v-else v-for="(item, index) in dataBulanIni" :key="item.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ formatTanggalSingkat(item.created_at) }}</td>
              <td class="text-success fw-bold">{{ item.tipe === 'pemasukan' ? formatRupiah(item.jumlah) : '-' }}</td>
              <td class="text-danger fw-bold">{{ item.tipe !== 'pemasukan' ? formatRupiah(item.jumlah) : '-' }}</td>
              <td>{{ item.deskripsi }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from '../composables/useAuth'
import { formatRupiah, formatTanggalSingkat } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import SkeletonBlock from '../components/SkeletonBlock.vue'

const { user } = useAuth()

const isLoading = ref(true)
const dataBulanIni = ref([])

/** Sama seperti muatTabel() di catatan.js lama: hanya tampilkan bulan berjalan */
async function muatTabel() {
  isLoading.value = true

  const { data, error } = await supabase
    .from('transaksi')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal memuat data:', error.message)
    isLoading.value = false
    return
  }

  const sekarang = new Date()
  const bulanIni = sekarang.getMonth()
  const tahunIni = sekarang.getFullYear()

  dataBulanIni.value = (data || []).filter((item) => {
    const tgl = new Date(item.created_at)
    return tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni
  })

  isLoading.value = false
}

function cetak() {
  window.print()
}

onMounted(muatTabel)
</script>

<style scoped>
.print-row {
  display: flex;
  justify-content: flex-end;
}

.page-title {
  background: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: bold;
  color: var(--color-primary);
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  width: fit-content;
}

.table-container {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: var(--shadow-soft);
}

.table-container h3 {
  margin-bottom: 14px;
  color: var(--color-primary-dark);
}

.table-responsive {
  overflow-x: auto;
}

.tabel-catatan {
  width: 100%;
  border-collapse: collapse;
}

.tabel-catatan th,
.tabel-catatan td {
  padding: 10px 12px;
  border: 1px solid #eef1f5;
  font-size: 0.95rem;
  text-align: left;
}

.tabel-catatan thead th {
  background: var(--color-primary);
  color: #fff;
  font-size: 0.9rem;
}

.tabel-catatan tbody tr:nth-child(odd) {
  background: #fafbfd;
}

.text-success {
  color: var(--color-success);
}
.text-danger {
  color: var(--color-danger);
}
.fw-bold {
  font-weight: 700;
}
.text-center {
  text-align: center;
  color: #888;
  padding: 24px 0;
}

@media (max-width: 768px) {
  .tabel-catatan th,
  .tabel-catatan td {
    font-size: 0.82rem;
    padding: 8px;
  }
}
</style>
