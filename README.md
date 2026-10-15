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

### 🛠️ Opsi 2: Deploy dari Branch Menggunakan Folder `/docs` (Sangat Mudah)
Proyek ini sekarang secara otomatis menyertakan folder `/docs` berisi file siap pakai hasil build:
1. Pastikan seluruh folder (termasuk folder `docs/`) sudah di-push ke GitHub.
2. Di GitHub, buka menu **Settings** > **Pages**.
3. Di bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
4. Di bagian **Branch**, pilih branch `main` (atau `master`), dan pilih folder **/docs** (bukan /root), lalu klik **Save**.
5. Website akan langsung aktif dalam hitungan detik!

---

### 💻 Opsi 3: Deploy Manual Menggunakan Script `npm run deploy`
Jika Anda ingin deploy via terminal:
1. Jalankan perintah:
   ```bash
   npm run deploy
   ```
2. Buka GitHub -> **Settings** -> **Pages**, pada bagian **Branch**, pilih `gh-pages` lalu simpan (Save).

---

## 🔒 Catatan Izin Kamera & HTTPS
- Browser modern (Google Chrome, Edge, Safari, Firefox, Android, iOS) **mewajibkan protokol HTTPS** agar kamera web dapat diakses oleh AI MediaPipe.
- **GitHub Pages secara otomatis menyediakan sertifikat HTTPS gratis**, sehingga kamera pelacak tangan akan langsung berfungsi normal saat dibuka online oleh pengguna.

---

## ❓ Solusi Masalah: Tampilan Masih Blank Putih (Troubleshooting)

Jika tampilan website di GitHub Pages masih blank/putih, ada 2 kemungkinan penyebab:

### 1. Paling Sering: Pengaturan Source di GitHub Pages Masih Mengarah ke Root (`/root`)
- **Mengapa Blank Putih?**
  Folder root repositori berisi file kode sumber mentah (`index.html` dan `src/main.tsx`). Browser internet tidak bisa langsung membaca file TypeScript (`.tsx`) tanpa proses compile/build, sehingga halaman menjadi blank putih.
- **Cara Mengatasinya (Pilih salah satu dari 2 cara termudah ini):**
  - **Cara A (Rekomendasi Utama - Otomatis):**
    1. Buka Repositori GitHub Anda > klik tab **Settings** di atas > klik menu **Pages** di sebelah kiri.
    2. Pada bagian **Build and deployment** > **Source**, ubah dari *Deploy from a branch* menjadi **GitHub Actions**.
    3. Buka tab **Actions** di atas repositori Anda. Anda akan melihat workflow *Deploy to GitHub Pages* berjalan (tunggu hingga centang hijau ✓).
    4. Buka kembali tautan website Anda. Game akan langsung muncul!
  - **Cara B (Jika Ingin Tetap Menggunakan Deploy from a branch):**
    1. Buka Repositori GitHub Anda > **Settings** > **Pages**.
    2. Pada bagian **Branch**, pastikan memilih branch `main` dan ganti foldernya menjadi **/docs** (bukan /root).
    3. Klik **Save**. Tunggu 1 menit lalu refresh halaman website Anda.

### 2. Cache Browser Lama
- Kadang browser masih menyimpan halaman kosong sebelumnya di memori cache.
- Tekan tombol **Ctrl + F5** (di Windows/Linux) atau **Cmd + Shift + R** (di Mac), atau coba buka tautan website di mode Penyamaran / *Incognito Window*.

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
