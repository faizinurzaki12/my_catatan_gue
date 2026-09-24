<!-- src/views/DashboardView.vue -->
<template>
  <AppLayout>
    <!-- ===== Banner Notifikasi HP PWA ===== -->
    <div v-if="permission !== 'granted'" class="notif-banner">
      <div class="notif-content">
        <span class="notif-icon">🔔</span>
        <p class="notif-text">Aktifkan notifikasi HP agar kamu ingat untuk mencatat keuangan 4x sehari.</p>
      </div>
      <button @click="requestPermission" class="btn-notif">Aktifkan di HP</button>
    </div>

    <div class="page-header">
      <div class="page-title">Beranda</div>
      <div class="user-chip">{{ isLoading ? "Memuat nama..." : namaUser }}</div>
    </div>

    <!-- ===== Kartu ringkasan ===== -->
    <div class="stat-cards">
      <template v-if="isLoading">
        <div class="stat-card skeleton-card" v-for="i in 3" :key="i">
          <SkeletonBlock width="90px" height="14px" />
          <SkeletonBlock width="130px" height="22px" />
        </div>
      </template>
      <template v-else>
        <div class="stat-card card-saldo">
          <h2>Total Saldo</h2>
          <div class="nominal">{{ formatRupiah(totalSaldo) }}</div>
        </div>
        <div class="stat-card card-masuk">
          <h2>Pemasukan</h2>
          <div class="nominal">{{ formatRupiah(bulanMasuk) }}</div>
        </div>
        <div class="stat-card card-keluar">
          <h2>Pengeluaran</h2>
          <div class="nominal">{{ formatRupiah(bulanKeluar) }}</div>
        </div>
      </template>
    </div>

    <div class="bottom-row">
      <!-- ===== Transaksi terbaru (Auto Scroll) ===== -->
      <div class="transaksi-box">
        <h3>Transaksi Terbaru Bulan Ini</h3>

        <div v-if="isLoading" class="skeleton-list">
          <SkeletonBlock v-for="i in 4" :key="i" height="18px" />
        </div>
        <div v-else-if="transaksiTampil.length === 0" class="empty-note">Belum ada transaksi di bulan ini.</div>
        <div v-else class="transaksi-list">
          <div v-for="(t, idx) in transaksiTampil" :key="idx" class="transaksi-item">
            <span class="nama">{{ t.deskripsi }}</span>
            <span :class="t.tipe === 'pemasukan' ? 'nominal-masuk' : 'nominal-keluar'"> {{ t.tipe === "pemasukan" ? "+" : "-" }}{{ formatRupiah(t.jumlah) }} </span>
          </div>
        </div>
      </div>

      <div class="right-col">
        <!-- ===== Ringkasan bulan ini ===== -->
        <div class="bulan-box">
          <h3>Bulan Ini</h3>
          <div v-if="isLoading" class="skeleton-list">
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
          </div>
          <template v-else>
            <div class="periode">{{ periodeBulanIni }}</div>
            <div class="bulan-row">
              <span>Pemasukan</span><span class="masuk">{{ formatRupiah(bulanMasuk) }}</span>
            </div>
            <div class="bulan-row">
              <span>Pengeluaran</span><span class="keluar">{{ formatRupiah(bulanKeluar) }}</span>
            </div>
            <div class="bulan-row saldo">
              <span>Saldo</span><span>{{ formatRupiah(bulanSaldo) }}</span>
            </div>
          </template>
        </div>

        <!-- ===== Budget bulan ini ===== -->
        <div class="budget-box">
          <div class="budget-head">
            <h3>Budget Bulan Ini</h3>
            <button class="btn btn-outline btn-sm" @click="openBudgetModal">Atur</button>
          </div>

          <div v-if="isLoadingBudget" class="skeleton-list">
            <SkeletonBlock height="10px" />
            <SkeletonBlock width="60%" height="12px" />
          </div>
          <div v-else-if="!budgetLimit || budgetLimit <= 0" class="empty-note">Kamu belum atur budget bulan ini.</div>
          <div v-else>
            <div class="budget-progress">
              <div class="budget-progress-bar" :class="warnaBudget" :style="{ width: Math.min(persentaseBudget, 100) + '%' }"></div>
            </div>
            <div class="budget-angka">
              <span class="terpakai">{{ formatRupiah(totalPengeluaranBulanIni) }}</span>
              <span class="total">dari {{ formatRupiah(budgetLimit) }}</span>
            </div>
            <div v-if="persentaseBudget >= 80" class="budget-warning" :class="{ danger: persentaseBudget >= 100 }">
              <strong>{{ persentaseBudget >= 100 ? "⚠️ Budget bulan ini sudah terlampaui!" : "⚠️ Budget bulan ini hampir habis" }}</strong>
              <div class="small">{{ Math.round(persentaseBudget) }}% dari batas sudah terpakai</div>
            </div>
          </div>
        </div>

        <!-- ===== Target goals ===== -->
        <RouterLink to="/goals" class="goals-box">
          <h3>Target Goals</h3>
          <div v-if="isLoading" class="skeleton-list">
            <SkeletonBlock height="14px" />
            <SkeletonBlock height="14px" />
          </div>
          <div v-else-if="goalsList.length === 0" class="goal-item empty-note">Belum ada target.</div>
          <div v-else>
            <div v-for="g in goalsList" :key="g.id" class="goal-item">{{ g.nama_goal }}</div>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- ===== Modal atur budget ===== -->
    <AppModal v-model="showBudgetModal" title="Atur Budget Bulan Ini">
      <form @submit.prevent="handleSimpanBudget">
        <div class="field">
          <label>Batas Pengeluaran (Rp)</label>
          <input v-model="inputBudget" type="text" required placeholder="cth: 2.000.000" @input="onInputBudgetFormat" />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="showBudgetModal = false">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="isSavingBudget">
            <BaseSpinner v-if="isSavingBudget" />
            Simpan
          </button>
        </div>
      </form>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";
import { useNotification } from "../composables/useNotification";
import { formatRupiah, getRentangBulanIni } from "../utils/format";
import AppLayout from "../components/AppLayout.vue";
import AppModal from "../components/AppModal.vue";
import BaseSpinner from "../components/BaseSpinner.vue";
import SkeletonBlock from "../components/SkeletonBlock.vue";

const { user } = useAuth();
const { showToast } = useToast();
const { permission, requestPermission } = useNotification();

// ----- state utama dashboard -----
const isLoading = ref(true);
const namaUser = ref("");
const totalSaldo = ref(0);
const bulanMasuk = ref(0);
const bulanKeluar = ref(0);
const bulanSaldo = ref(0);
const periodeBulanIni = ref("");
const transaksiTampil = ref([]);
const goalsList = ref([]);

// ----- state budget -----
const isLoadingBudget = ref(true);
const isSavingBudget = ref(false);
const budgetLimit = ref(null);
const totalPengeluaranBulanIni = ref(0);
const showBudgetModal = ref(false);
const inputBudget = ref("");

const persentaseBudget = computed(() => {
  if (!budgetLimit.value || budgetLimit.value <= 0) return 0;
  return (totalPengeluaranBulanIni.value / budgetLimit.value) * 100;
});

const warnaBudget = computed(() => {
  if (persentaseBudget.value >= 100) return "bg-danger";
  if (persentaseBudget.value >= 80) return "bg-warning";
  return "bg-success";
});

/** Sama seperti hitungDataDashboard() di dashboard.js lama */
async function muatDashboard() {
  isLoading.value = true;
  const uid = user.value.id;
  if (user.value.email) namaUser.value = user.value.email.split("@")[0];

  const { awal, akhir, sekarang } = getRentangBulanIni();

  const [semuaRes, bulanRes, goalsRes] = await Promise.all([
    supabase.from("transaksi").select("tipe, jumlah, deskripsi").eq("user_id", uid),
    supabase.from("transaksi").select("*").eq("user_id", uid).gte("created_at", awal).lt("created_at", akhir).order("created_at", { ascending: false }),
    supabase.from("goals").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(3),
  ]);

  if (semuaRes.error) console.error("Gagal ambil semua transaksi:", semuaRes.error.message);
  if (bulanRes.error) console.error("Gagal ambil transaksi bulan ini:", bulanRes.error.message);
  if (goalsRes.error) console.error("Gagal ambil goals:", goalsRes.error.message);

  // --- Saldo utama (all-time) ---
  let totalMasukSelamanya = 0;
  let totalKeluarSelamanya = 0;
  (semuaRes.data || []).forEach((i) => {
    const jumlah = parseInt(i.jumlah) || 0;
    if (i.tipe === "pemasukan") totalMasukSelamanya += jumlah;
    else totalKeluarSelamanya += jumlah;
  });
  totalSaldo.value = Math.max(totalMasukSelamanya - totalKeluarSelamanya, 0);

  // --- Arus kas riil bulan ini (exclude transaksi internal goals) ---
  let masuk = 0;
  let keluar = 0;
  const tampil = [];
  (bulanRes.data || []).forEach((i) => {
    const jumlah = parseInt(i.jumlah) || 0;
    const deskripsiLc = (i.deskripsi || "").toLowerCase();
    const isTransaksiGoals = deskripsiLc.includes("goals") || deskripsiLc.includes("tabungan") || deskripsiLc.includes("tarik dana");

    if (!isTransaksiGoals) {
      if (i.tipe === "pemasukan") masuk += jumlah;
      else keluar += jumlah;
      tampil.push(i); // Memasukkan semua data tanpa batasan angka
    }
  });

  bulanMasuk.value = masuk;
  bulanKeluar.value = keluar;
  bulanSaldo.value = Math.max(masuk - keluar, 0);
  periodeBulanIni.value = sekarang.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  transaksiTampil.value = tampil;
  goalsList.value = goalsRes.data || [];

  isLoading.value = false;
}

/** Sama seperti ambilBudgetBulanIni() + hitungPengeluaranBulanIni() di budget.js */
async function muatBudget() {
  isLoadingBudget.value = true;
  const uid = user.value.id;
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();
  const { awal, akhir } = getRentangBulanIni();

  const [budgetRes, pengeluaranRes] = await Promise.all([
    supabase.from("budgets").select("budget_limit").eq("user_id", uid).eq("bulan", bulan).eq("tahun", tahun).maybeSingle(),
    supabase.from("transaksi").select("jumlah").eq("user_id", uid).eq("tipe", "pengeluaran").gte("created_at", awal).lt("created_at", akhir),
  ]);

  if (budgetRes.error) console.error("[budget] gagal ambil budget:", budgetRes.error.message);
  if (pengeluaranRes.error) console.error("[budget] gagal ambil transaksi:", pengeluaranRes.error.message);

  budgetLimit.value = budgetRes.data?.budget_limit ?? null;
  totalPengeluaranBulanIni.value = (pengeluaranRes.data || []).reduce((total, t) => total + (parseInt(t.jumlah) || 0), 0);
  isLoadingBudget.value = false;
}

function openBudgetModal() {
  inputBudget.value = budgetLimit.value ? formatRibuan(budgetLimit.value) : "";
  showBudgetModal.value = true;
}

/** Sama seperti simpanBudget() di budget.js (upsert) */
async function handleSimpanBudget() {
  const nominal = parseAngka(inputBudget.value);
  if (!nominal || nominal <= 0) {
    showToast({ type: "warning", title: "Nominal tidak valid", text: "Masukkan nominal budget yang valid." });
    return;
  }

  isSavingBudget.value = true;
  const uid = user.value.id;
  const now = new Date();

  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: uid,
      bulan: now.getMonth() + 1,
      tahun: now.getFullYear(),
      budget_limit: nominal,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,bulan,tahun" },
  );

  isSavingBudget.value = false;

  if (error) {
    showToast({ type: "error", title: "Gagal menyimpan budget", text: error.message });
    return;
  }

  showBudgetModal.value = false;
  showToast({ type: "success", title: "Tersimpan", text: "Budget bulan ini berhasil diperbarui." });
  await muatBudget();
}

function formatRibuan(val) {
  if (!val) return "";
  const angka = val.toString().replace(/\D/g, "");
  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseAngka(val) {
  if (!val) return 0;
  return parseInt(val.toString().replace(/\D/g, ""), 10) || 0;
}

function onInputBudgetFormat(event) {
  inputBudget.value = formatRibuan(event.target.value);
}
onMounted(async () => {
  await muatDashboard();
  await muatBudget();
});
</script>

<style scoped>
/* Style Banner Notifikasi HP */
.notif-banner {
  background-color: #eef2ff;
  border-left: 4px solid #4f46e5;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 0 12px 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notif-icon {
  font-size: 20px;
}

.notif-text {
  font-size: 0.88rem;
  color: #1e1b4b;
  font-weight: 500;
  margin: 0;
}

.btn-notif {
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.btn-notif:hover {
  background-color: #4338ca;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.page-title {
  background: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  font-weight: bold;
  color: var(--color-primary-dark);
  padding: 8px 14px;
  border-radius: 8px;
}

.user-chip {
  color: #444;
  font-size: 0.9rem;
}

.stat-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: var(--shadow-card);
}

.stat-card.skeleton-card {
  background: #fff;
  gap: 10px;
}

.stat-card h2 {
  font-size: 16px;
  margin-bottom: 8px;
  opacity: 0.9;
  font-weight: 600;
}

.stat-card .nominal {
  font-size: 22px;
  font-weight: bold;
}

.card-saldo {
  background: rgba(61, 169, 252, 0.85);
}
.card-masuk {
  background: rgba(8, 155, 89, 0.85);
}
.card-keluar {
  background: rgba(220, 80, 80, 0.85);
}

.bottom-row {
  display: flex;
  gap: 16px;
  align-items: stretch;
  flex-wrap: wrap;
}

.transaksi-box {
  flex: 1.4;
  min-width: 260px;
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: var(--shadow-soft);
}

.transaksi-box h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--color-primary-dark);
}

/* Penyesuaian Scrollbar & Auto Scroll Transaksi */
.transaksi-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
}

.transaksi-list::-webkit-scrollbar {
  width: 6px;
}

.transaksi-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.transaksi-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.transaksi-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.transaksi-item:last-child {
  border-bottom: none;
}
.transaksi-item .nama {
  flex: 1;
  padding-right: 10px;
}
.nominal-masuk {
  color: var(--color-success);
  font-weight: bold;
}
.nominal-keluar {
  color: var(--color-danger);
  font-weight: bold;
}

.right-col {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bulan-box,
.budget-box,
.goals-box {
  background: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: var(--shadow-soft);
}

.goals-box {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s ease;
}
.goals-box:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.bulan-box h3,
.budget-box h3,
.goals-box h3 {
  font-size: 17px;
  font-weight: bold;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.periode {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 10px;
}

.bulan-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.92rem;
  padding: 4px 0;
}
.bulan-row.saldo {
  font-weight: bold;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 6px;
  padding-top: 8px;
}
.bulan-row .masuk {
  color: var(--color-success);
}
.bulan-row .keluar {
  color: var(--color-danger);
}

.budget-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.budget-head h3 {
  margin-bottom: 0;
}

.budget-progress {
  height: 10px;
  border-radius: 6px;
  background: #e5e7eb;
  overflow: hidden;
}
.budget-progress-bar {
  height: 100%;
  transition:
    width 0.4s ease,
    background-color 0.4s ease;
}
.budget-progress-bar.bg-success {
  background: var(--color-success-btn);
}
.budget-progress-bar.bg-warning {
  background: var(--color-warning);
}
.budget-progress-bar.bg-danger {
  background: var(--color-danger);
}

.budget-angka {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-top: 8px;
}
.budget-angka .terpakai {
  font-weight: 700;
  color: #1e293b;
}
.budget-angka .total {
  color: #94a3b8;
}

.budget-warning {
  margin-top: 10px;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.82rem;
  background: #fff7e6;
  color: #92650e;
}
.budget-warning.danger {
  background: #fdecea;
  color: #b42318;
}
.budget-warning .small {
  font-size: 0.76rem;
  margin-top: 2px;
}

.goal-item {
  font-size: 0.92rem;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.goal-item:last-child {
  border-bottom: none;
}

.empty-note {
  color: #888;
  font-size: 0.88rem;
  padding: 10px 0;
  text-align: center;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .notif-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-notif {
    width: 100%;
    text-align: center;
  }
  .stat-cards {
    flex-direction: column;
  }
}
</style>
