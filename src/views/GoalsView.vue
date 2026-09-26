<!-- src/views/GoalsView.vue -->
<template>
  <AppLayout>
    <div class="page-title">Target Tabungan</div>

    <div class="card-aktivitas">
      <div class="card-head">
        <RouterLink to="/dashboard" class="btn btn-primary btn-sm">Kembali</RouterLink>
        <div class="card-head-title">List Target Kamu</div>
        <button class="btn btn-primary btn-sm" @click="bukaModalTambah">+ Tambah Target</button>
      </div>

      <div class="list-wrapper">
        <PageLoader v-if="isLoading" text="Memuat data goals..." />

        <div v-else-if="goals.length === 0" class="empty-note">
          Belum ada target tabungan dibuat.
        </div>

        <div v-else class="goal-card" v-for="g in goals" :key="g.id">
          <div class="goal-header">
            <strong>{{ g.nama_goal }}</strong>
            <span class="badge">{{ persenGoal(g) }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: persenGoal(g) + '%' }"></div>
          </div>
          <div class="goal-meta">
            <small>{{ formatRupiah(g.terkumpul || 0) }} / {{ formatRupiah(g.target_jumlah || g.target_nominal || 0) }}</small>
            <small v-if="g.deadline" class="text-danger">Tenggat: {{ g.deadline }}</small>
          </div>
          <div class="goal-actions">
            <button class="btn btn-success btn-sm" @click="bukaModalIsi(g.id)">Isi Tabungan</button>
            <button class="btn btn-warning btn-sm" @click="bukaModalTarik(g.id)">Tarik Dana</button>
            <!-- Tombol Edit Target -->
            <button class="btn btn-info btn-sm text-white" @click="bukaModalEdit(g)">Edit</button>
            <!-- Tombol Hapus (Bisa dihapus kapan saja, dengan konfirmasi) -->
            <button
              class="btn btn-danger btn-sm"
              title="Hapus Target"
              @click="bukaModalKonfirmasiHapus(g)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Modal Konfirmasi Hapus Target ===== -->
    <AppModal v-model="showModalHapus" title="Konfirmasi Hapus Target">
      <div class="modal-body-confirm">
        <p><strong>Apakah kamu yakin ingin menghapus target ini?</strong></p>
        <p v-if="selectedGoalHapus">
          Target <strong>{{ selectedGoalHapus.nama_goal }}</strong> dengan dana terkumpul 
          <span class="text-success font-bold">{{ formatRupiah(selectedGoalHapus.terkumpul) }}</span> 
          akan dihapus permanen dari daftar.
        </p>
      </div>
      <div class="modal-actions" style="margin-top: 20px;">
        <button type="button" class="btn btn-secondary" @click="showModalHapus = false">Batal</button>
        <button type="button" class="btn btn-danger" :disabled="isSubmittingHapus" @click="prosesHapusGoal">
          <BaseSpinner v-if="isSubmittingHapus" />
          Ya, Hapus Target
        </button>
      </div>
    </AppModal>

    <!-- ===== Modal Tambah Target ===== -->
    <AppModal v-model="showModalTambah" title="Tambah Target Baru">
      <form @submit.prevent="handleTambahGoal">
        <div class="field">
          <label>Nama Goal</label>
          <input v-model="formNamaGoal" type="text" required placeholder="Contoh: Beli Laptop" />
        </div>
        <div class="field">
          <label>Target Jumlah (Rp)</label>
          <input 
            v-model="formTargetJumlah" 
            type="text" 
            required 
            placeholder="1.000.000" 
            @input="onInputFormat('formTargetJumlah', $event)" 
          />
        </div>
        <div class="field">
          <label>Deadline</label>
          <input v-model="formDeadline" type="date" required />
        </div>
        <button type="submit" class="btn btn-success btn-block" :disabled="isSubmittingGoal">
          <BaseSpinner v-if="isSubmittingGoal" />
          {{ isSubmittingGoal ? 'Menyimpan...' : 'Simpan Target Baru' }}
        </button>
      </form>
    </AppModal>

    <!-- ===== Modal Edit Target ===== -->
    <AppModal v-model="showModalEdit" title="Edit Target Tabungan">
      <form @submit.prevent="handleEditGoal">
        <div class="field">
          <label>Nama Goal</label>
          <input v-model="formNamaGoal" type="text" required placeholder="Contoh: Beli Laptop" />
        </div>
        <div class="field">
          <label>Target Jumlah (Rp)</label>
          <input 
            v-model="formTargetJumlah" 
            type="text" 
            required 
            placeholder="1.000.000" 
            @input="onInputFormat('formTargetJumlah', $event)" 
          />
        </div>
        <div class="field">
          <label>Deadline</label>
          <input v-model="formDeadline" type="date" required />
        </div>
        <button type="submit" class="btn btn-success btn-block" :disabled="isSubmittingGoal">
          <BaseSpinner v-if="isSubmittingGoal" />
          {{ isSubmittingGoal ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>
    </AppModal>

    <!-- ===== Modal Isi Tabungan ===== -->
    <AppModal v-model="showModalIsi" title="Isi Tabungan Target">
      <form @submit.prevent="handleIsiTabungan">
        <div class="field">
          <label>Nominal Tabungan (Rp)</label>
          <input 
            v-model="formNominalIsi" 
            type="text" 
            required 
            placeholder="Contoh: 100.000" 
            @input="onInputFormat('formNominalIsi', $event)" 
          />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="showModalIsi = false">Batal</button>
          <button type="submit" class="btn btn-success" :disabled="isSubmittingIsi">
            <BaseSpinner v-if="isSubmittingIsi" />
            Simpan Tabungan
          </button>
        </div>
      </form>
    </AppModal>

    <!-- ===== Modal Tarik Dana ===== -->
    <AppModal v-model="showModalTarik" title="Tarik Dana Target">
      <form @submit.prevent="handleTarikTabungan">
        <div class="field">
          <label>Nominal Penarikan (Rp)</label>
          <input 
            v-model="formNominalTarik" 
            type="text" 
            required 
            placeholder="Contoh: 50.000" 
            @input="onInputFormat('formNominalTarik', $event)" 
          />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="showModalTarik = false">Batal</button>
          <button type="submit" class="btn btn-warning" :disabled="isSubmittingTarik">
            <BaseSpinner v-if="isSubmittingTarik" />
            Tarik Dana
          </button>
        </div>
      </form>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { formatRupiah } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import AppModal from '../components/AppModal.vue'
import PageLoader from '../components/PageLoader.vue'
import BaseSpinner from '../components/BaseSpinner.vue'

const { user } = useAuth()
const { showToast } = useToast()

const isLoading = ref(true)
const goals = ref([])
const isWarningActive = ref(false)

// --- State Tambah Target ---
const showModalTambah = ref(false)
const formNamaGoal = ref('')
const formTargetJumlah = ref('')
const formDeadline = ref('')
const isSubmittingGoal = ref(false)

// --- State Edit Target ---
const showModalEdit = ref(false)
const editGoalId = ref(null)

// --- State Isi Tabungan ---
const showModalIsi = ref(false)
const isiGoalId = ref(null)
const formNominalIsi = ref('')
const isSubmittingIsi = ref(false)

// --- State Tarik Dana ---
const showModalTarik = ref(false)
const tarikGoalId = ref(null)
const formNominalTarik = ref('')
const isSubmittingTarik = ref(false)

// --- State Hapus Target ---
const showModalHapus = ref(false)
const selectedGoalHapus = ref(null)
const isSubmittingHapus = ref(false)

function formatRibuan(val) {
  if (!val) return ''
  const angka = val.toString().replace(/\D/g, '')
  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function parseAngka(val) {
  if (!val) return 0
  return parseInt(val.toString().replace(/\D/g, ''), 10) || 0
}

function onInputFormat(field, event) {
  const formatted = formatRibuan(event.target.value)
  if (field === 'formTargetJumlah') formTargetJumlah.value = formatted
  if (field === 'formNominalIsi') formNominalIsi.value = formatted
  if (field === 'formNominalTarik') formNominalTarik.value = formatted
}

function persenGoal(g) {
  const terkumpul = Math.max(g.terkumpul || 0, 0)
  const target = g.target_jumlah || g.target_nominal || 1
  return Math.min(Math.round((terkumpul / target) * 100), 100)
}

async function muatGoals() {
  if (!user.value) return
  isLoading.value = true
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })

  if (error) {
    showToast({ type: 'error', title: 'Gagal memuat data', text: error.message })
    isLoading.value = false
    return
  }

  goals.value = data || []
  isLoading.value = false
}

function bukaModalTambah() {
  formNamaGoal.value = ''
  formTargetJumlah.value = ''
  formDeadline.value = ''
  showModalTambah.value = true
}

async function handleTambahGoal() {
  const targetVal = parseAngka(formTargetJumlah.value)
  if (targetVal <= 0) {
    showToast({ type: 'warning', title: 'Nominal tidak valid', text: 'Target nominal harus lebih dari 0' })
    return
  }

  isSubmittingGoal.value = true

  let payload = {
    user_id: user.value.id,
    nama_goal: formNamaGoal.value,
    target_jumlah: targetVal,
    terkumpul: 0,
    deadline: formDeadline.value,
  }

  let { error } = await supabase.from('goals').insert([payload])

  if (error && error.message && error.message.includes('target_jumlah')) {
    delete payload.target_jumlah
    payload.target_nominal = targetVal
    const retry = await supabase.from('goals').insert([payload])
    error = retry.error
  }

  isSubmittingGoal.value = false

  if (error) {
    showToast({ type: 'error', title: 'Gagal membuat target', text: error.message })
    return
  }

  showModalTambah.value = false
  showToast({ type: 'success', title: 'Berhasil', text: 'Target berhasil dibuat!' })
  await muatGoals()
}

// --- Fungsi Edit Target ---
function bukaModalEdit(goal) {
  editGoalId.value = goal.id
  formNamaGoal.value = goal.nama_goal
  formTargetJumlah.value = formatRibuan(goal.target_jumlah || goal.target_nominal || 0)
  formDeadline.value = goal.deadline || ''
  showModalEdit.value = true
}

async function handleEditGoal() {
  const targetVal = parseAngka(formTargetJumlah.value)
  if (targetVal <= 0) {
    showToast({ type: 'warning', title: 'Nominal tidak valid', text: 'Target nominal harus lebih dari 0' })
    return
  }

  isSubmittingGoal.value = true

  let payload = {
    nama_goal: formNamaGoal.value,
    target_jumlah: targetVal,
    deadline: formDeadline.value,
  }

  let { error } = await supabase
    .from('goals')
    .update(payload)
    .eq('id', editGoalId.value)

  if (error && error.message && error.message.includes('target_jumlah')) {
    delete payload.target_jumlah
    payload.target_nominal = targetVal
    const retry = await supabase
      .from('goals')
      .update(payload)
      .eq('id', editGoalId.value)
    error = retry.error
  }

  isSubmittingGoal.value = false

  if (error) {
    showToast({ type: 'error', title: 'Gagal memperbarui target', text: error.message })
    return
  }

  showModalEdit.value = false
  showToast({ type: 'success', title: 'Berhasil', text: 'Target berhasil diperbarui!' })
  await muatGoals()
}

function bukaModalIsi(id) {
  isiGoalId.value = id
  formNominalIsi.value = ''
  showModalIsi.value = true
}

async function handleIsiTabungan() {
  const nominal = parseAngka(formNominalIsi.value)
  if (nominal <= 0) {
    showToast({ type: 'warning', title: 'Nominal tidak valid', text: 'Nominal tabungan harus lebih dari 0' })
    return
  }

  isSubmittingIsi.value = true

  const { data, error } = await supabase.rpc('proses_tabungan', {
    p_user_id: user.value.id,
    p_goal_id: isiGoalId.value,
    p_nominal: Number(nominal),
  })

  isSubmittingIsi.value = false

  if (error) {
    showToast({ type: 'error', title: 'Gagal menabung', text: error.message })
    return
  }
  if (data && data.success === false) {
    showToast({ type: 'warning', title: 'Gagal', text: data.message })
    return
  }

  showModalIsi.value = false
  showToast({ type: 'success', title: 'Berhasil!', text: `${formatRupiah(nominal)} telah ditabung.` })
  await muatGoals()
}

function bukaModalTarik(id) {
  tarikGoalId.value = id
  formNominalTarik.value = ''
  showModalTarik.value = true
}

async function handleTarikTabungan() {
  const nominal = parseAngka(formNominalTarik.value)
  if (nominal <= 0) {
    showToast({ type: 'warning', title: 'Nominal tidak valid', text: 'Nominal penarikan harus lebih dari 0' })
    return
  }

  isSubmittingTarik.value = true

  const { data, error } = await supabase.rpc('tarik_tabungan', {
    p_user_id: user.value.id,
    p_goal_id: tarikGoalId.value,
    p_nominal: Number(nominal),
  })

  isSubmittingTarik.value = false

  if (error) {
    showToast({ type: 'error', title: 'Gagal menarik dana', text: error.message })
    return
  }
  if (data && data.success === false) {
    showToast({ type: 'warning', title: 'Gagal', text: data.message })
    return
  }

  showModalTarik.value = false
  showToast({ type: 'success', title: 'Berhasil!', text: `${formatRupiah(nominal)} telah ditarik dari target.` })
  await muatGoals()
}

function bukaModalKonfirmasiHapus(goal) {
  // Cek apakah ada saldo/dana terkumpul di dalam target tersebut
  const terkumpul = goal.terkumpul || 0
  if (terkumpul > 0) {
    // Cegah spam notifikasi jika sedang aktif
    if (isWarningActive.value) return

    isWarningActive.value = true
    showToast({ 
      type: 'warning', 
      title: 'Tidak bisa dihapus', 
      text: 'Tidak bisa dihapus karena ada uang di tabungan tersebut' 
    })

    // Reset status aktif toast setelah 2 detik agar bisa diperingatkan lagi jika diklik di waktu berbeda
    setTimeout(() => {
      isWarningActive.value = false
    }, 5000)

    return
  }

  selectedGoalHapus.value = goal
  showModalHapus.value = true
}

async function prosesHapusGoal() {
  if (!selectedGoalHapus.value) return

  isSubmittingHapus.value = true

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', selectedGoalHapus.value.id)

  isSubmittingHapus.value = false

  if (error) {
    showToast({ type: 'error', title: 'Gagal menghapus target', text: error.message })
    return
  }

  showToast({ 
    type: 'success', 
    title: 'Berhasil', 
    text: `Target ${selectedGoalHapus.value.nama_goal} berhasil dihapus dari daftar.` 
  })

  showModalHapus.value = false
  selectedGoalHapus.value = null
  await muatGoals()
}

onMounted(muatGoals)
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
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #eef1f5;
  padding-bottom: 14px;
  margin-bottom: 14px;
}

.card-head-title {
  color: var(--color-primary-dark);
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  flex: 1;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-card {
  background: #fff;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.98rem;
}

.badge {
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
}

.progress-track {
  width: 100%;
  height: 12px;
  background: #e8ecf4;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: var(--color-success-btn);
  transition: width 0.5s ease;
}

.goal-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #666;
  margin-bottom: 12px;
}

.text-danger {
  color: var(--color-danger);
}

.text-success {
  color: #2e7d32;
}

.font-bold {
  font-weight: bold;
}

.goal-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-note {
  text-align: center;
  color: #888;
  padding: 40px 0;
  border: 1px dashed #ddd;
  border-radius: 12px;
}

.btn-block {
  width: 100%;
  padding: 13px;
  margin-top: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-body-confirm p {
  margin-bottom: 8px;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .card-head {
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .card-head .btn-sm {
    padding: 6px 10px;
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .card-head-title {
    font-size: 0.9rem;
  }
}
</style>