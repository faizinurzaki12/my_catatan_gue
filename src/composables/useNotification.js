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

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      
      if (result === 'granted') {
        // Tampilkan notifikasi konfirmasi langsung ke HP
        sendNativeNotification('Pengingat Aktif! 🎉', {
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

    // Menggunakan Service Worker PWA jika tersedia
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      registration.showNotification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200], // Efek getar HP
        ...options
      })
    } else {
      new Notification(title, {
        icon: '/favicon.ico',
        ...options
      })
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
    setInterval(checkAndTriggerNotification, 30000)
  }

  return {
    isSupported,
    permission,
    requestPermission,
    initNotificationScheduler
  }
}