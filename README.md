# 🐝 Game AR Tangkap Lebah

Game edukasi interaktif Augmented Reality (AR) menangkap lebah berbasis web dengan kecerdasan buatan pelacak tangan (*MediaPipe AI Hand Tracking*) dan mode alternatif sentuh/mouse.

> **Dibuat oleh**: M. Nur Ali Abidin, S.Pd.  
> 📷 Instagram: [@aliabidin988](https://instagram.com/aliabidin988)  
> 🎵 TikTok: [@aliabidin98](https://www.tiktok.com/@aliabidin98)  
> ✉️ Email: [ali.abidin8@gmail.com](mailto:ali.abidin8@gmail.com)  

---

## 🚀 Panduan Deploy Online ke GitHub Pages

Proyek ini telah dikonfigurasi penuh agar dapat di-deploy ke **GitHub Pages** secara online dan gratis.

### ✨ Opsi 1: Deploy Otomatis dengan GitHub Actions (Sangat Disarankan)

File workflow `.github/workflows/deploy.yml` sudah disiapkan. Anda hanya perlu melakukan push kode ke GitHub:

1. **Buat Repositori di GitHub**:
   - Buka [GitHub](https://github.com/) dan buat repositori baru (misalnya bernama `game-ar-tangkap-lebah`).

2. **Upload / Push Kode ke Repositori**:
   Jalankan perintah berikut di terminal komputer Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi Game AR Tangkap Lebah"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/game-ar-tangkap-lebah.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages di Pengaturan Repositori**:
   - Di GitHub, buka tab **Settings** repositori Anda.
   - Pilih menu **Pages** di bilah navigasi sebelah kiri.
   - Pada bagian **Build and deployment** -> **Source**, pilih **GitHub Actions**.
   - Selesai! GitHub Actions akan otomatis meng-compile dan mempublikasikan website Anda ke:
     `https://USERNAME_ANDA.github.io/game-ar-tangkap-lebah/`

---

### 🛠️ Opsi 2: Deploy Manual Menggunakan Script `npm run deploy`

Jika Anda ingin deploy langsung lewat terminal tanpa GitHub Actions:

1. Pastikan repositori lokal sudah terhubung dengan remote GitHub Anda.
2. Jalankan perintah:
   ```bash
   npm run deploy
   ```
3. Buka GitHub -> **Settings** -> **Pages**, pada bagian **Branch**, pilih `gh-pages` lalu simpan (Save).

---

## 🔒 Catatan Izin Kamera & HTTPS
- Browser modern (Google Chrome, Edge, Safari, Firefox, Android, iOS) **mewajibkan protokol HTTPS** agar kamera web dapat diakses oleh AI MediaPipe.
- **GitHub Pages secara otomatis menyediakan sertifikat HTTPS gratis**, sehingga kamera pelacak tangan akan langsung berfungsi normal saat dibuka online oleh pengguna.

---

## ❓ Solusi Masalah Umum Saat Deploy (Troubleshooting)

### 1. Pesan: `Error: Dependencies lock file is not found...`
- **Penyebab**: GitHub Actions mencari file `package-lock.json`.
- **Solusi yang sudah diterapkan**:
  - File `package-lock.json` sudah dibuat di repositori ini.
  - File `.github/workflows/deploy.yml` sudah diperbarui agar menjalankan `npm install --legacy-peer-deps` tanpa mewajibkan file lock statis.
  - Cukup lakukan `git add .`, `git commit -m "update deploy config"`, dan `git push` ke GitHub Anda.

### 2. Tampilan Website Online Blank / Kosong Putih
- **Penyebab Utama**:
  1. **Source GitHub Pages Salah Dipilih**: Jika di menu **Settings > Pages** Anda memilih *Deploy from a branch* -> branch `main` / root, GitHub Pages mencoba membuka file mentah `index.html` dengan `/src/main.tsx`. Browser tidak dapat membaca file `.tsx` secara langsung sehingga layar menjadi putih kosong.
  2. **Build GitHub Actions Gagal**: Karena error dependencies di atas, proses deploy belum selesai sehingga website belum terisi.
- **Solusi Cepat**:
  - Buka repositori Anda di GitHub -> **Settings** -> **Pages**.
  - Pada bagian **Build and deployment** -> **Source**, pilih **GitHub Actions** (jangan pilih *Deploy from a branch*).
  - Buka tab **Actions** di bagian atas repositori, lalu jalankan workflow atau push perubahan terbaru.
  - Setelah ada tanda centang hijau (✓), buka link GitHub Pages Anda. Website akan tampil sempurna!
  - *Alternatif:* Jika ingin menggunakan opsi branch, jalankan `npm run deploy` di komputer lokal, lalu di GitHub Pages pilih branch **`gh-pages`** (bukan `main`).

---

## 🎮 Fitur Game
- **Pelacakan Tangan AR Real-Time**: Deteksi kepalan tangan & posisi ujung jari telunjuk menggunakan MediaPipe Hands.
- **Mode 1 Pemain (Solo) & Mode 2 Pemain (Battle)**: Duel menangkap lebah bersama teman.
- **Mode Mouse / Sentuh**: Dapat dimainkan di laptop atau tablet layar sentuh tanpa kamera.
- **4 Pilihan Jawaban Lebah Interaktif**: Lebah beterbangan dengan animasi dinamis, sayap bergetar, dan mata ekspresif.
- **Pengaturan Game**: Pengaturan target skor, kecepatan terbang lebah, ukuran lebah, serta impor/ekspor bank soal Excel.
- **Efek Suara Audio**: Dilengkapi feedback suara saat jawaban benar atau salah.

---

## 💻 Menjalankan di Komputer Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk produksi
npm run build
```
