import { ref } from 'vue'

export function useNotification() {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window
  const permission = ref(isSupported ? Notification.permission : 'denied')

  // Minta izin ke OS HP / Browser
  const requestPermission = async () => {
    if (!isSupported) {
      alert('Perangkat/Browser Anda tidak mendukung Web Push Notification.')
      return false
    }

    // Cek jika pengguna sebelumnya sudah memblokir izin secara permanen
    if (Notification.permission === 'denied') {
      alert('Izin notifikasi diblokir oleh browser. Silakan ubah pengaturannya melalui ikon gembok di sebelah alamat website (URL).')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      
      if (result === 'granted') {
        // Tampilkan notifikasi konfirmasi langsung ke HP
        await sendNativeNotification('Pengingat Aktif! 🎉', {
          body: 'Notifikasi pengingat catatan keuangan 4x sehari berhasil diaktifkan di HP kamu.'
        })
      }
      return result === 'granted'
    } catch (error) {
      console.error('Gagal meminta izin notifikasi:', error)
      return false
    }
  }

  // Fungsi pengiriman notifikasi ke Notification Bar HP
  const sendNativeNotification = async (title, options = {}) => {
    if (permission.value !== 'granted') return

    try {
      // Menggunakan Service Worker PWA jika tersedia dan aktif
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200], // Efek getar HP
          ...options
        })
      } else {
        // Fallback langsung menggunakan objek Notification standar browser
        new Notification(title, {
          icon: '/favicon.ico',
          ...options
        })
      }
    } catch (error) {
      console.error('Gagal mengirimkan native notification:', error)
    }
  }

  // Jadwal pengingat 4x Sehari
  const SCHEDULE_TIMES = [
    { name: 'Pagi', hour: 7, minute: 0, message: 'Selamat pagi! Yuk catat pengeluaran & pemasukan pagimu.' },
    { name: 'Siang', hour: 12, minute: 0, message: 'Sudah makan siang? Jangan lupa catat pengeluaran siang ini ya!' },
    { name: 'Sore', hour: 17, minute: 0, message: 'Sebelum santai sore, periksa dan catat pengeluaranmu dulu!' },
    { name: 'Malam', hour: 21, minute: 0, message: 'Sudah waktunya rekap harian! Yuk lengkapi catatan keuanganmu.' }
  ]

  const checkAndTriggerNotification = () => {
    if (permission.value !== 'granted') return

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    SCHEDULE_TIMES.forEach(schedule => {
      // Pengecohan toleransi menit (bisa disesuaikan jika interval berjalan tiap 1 menit)
      if (currentHour === schedule.hour && currentMinute === schedule.minute) {
        const lastSentKey = `notif_last_sent_${schedule.name}`
        const todayStr = now.toISOString().split('T')[0]

        if (localStorage.getItem(lastSentKey) !== todayStr) {
          sendNativeNotification(`Pengingat Keuangan (${schedule.name})`, {
            body: schedule.message,
            tag: `catatan-keuangan-${schedule.name}`
          })
          localStorage.setItem(lastSentKey, todayStr)
        }
      }
    })
  }

  const initNotificationScheduler = () => {
    checkAndTriggerNotification()
    // Interval pengecekan setiap 30 detik
    setInterval(checkAndTriggerNotification, 30000)
  }

  return {
    isSupported,
    permission,
    requestPermission,
    initNotificationScheduler
  }
}