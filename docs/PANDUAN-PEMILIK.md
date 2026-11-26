# Panduan Pemilik Kebun Ceria

Panduan langkah demi langkah untuk mengelola dan menjual Kebun Ceria.

## 1. Membuat suara narator

1. Buka `audio/naskah.csv` (bisa dibuka di Excel atau Google Sheets). Isinya 114 baris: `id`, `teks`, dan `catatan`.
2. Untuk setiap baris, buat atau rekam suara sesuai kolom `teks`. Gunakan **satu suara yang sama** untuk semua baris, dengan nada hangat dan ceria.
3. Simpan setiap file sebagai **`<id>.mp3`**. Contoh: baris `angka_3` disimpan sebagai `angka_3.mp3`.
4. Perhatikan kolom `catatan`, terutama untuk baris `huruf_bunyi_*`. Yang direkam adalah **bunyi** huruf, bukan nama hurufnya. Contoh: `huruf_bunyi_b` diucapkan "/b/" pendek, bukan "be". Suara AI sering kesulitan dengan bunyi ini; merekam suara sendiri biasanya lebih tepat.
5. Taruh semua file mp3 di folder `public/audio/`.
6. Baris yang belum punya file mp3 otomatis dibacakan oleh suara bawaan browser. Jadi suara bisa dilengkapi bertahap.

Tips: buat file sependek mungkin (potong jeda di awal dan akhir), format mp3 mono 64–96 kbps sudah cukup.

## 2. Mengganti kode akses

Kode untuk pengembangan adalah `CERIA-2026`. **Ganti sebelum mulai menjual.**

1. Pilih kode baru, misalnya `KEBUN-7K2P`. Huruf besar/kecil, spasi, dan tanda `-` diabaikan saat dicek, jadi pembeli tidak perlu mengetik persis.
2. Jalankan:
   ```bash
   npm run kode -- KEBUN-7K2P
   ```
3. Salin baris hash yang muncul ke daftar `ACCESS_HASHES` di `src/config.ts`.
4. Hapus hash `CERIA2026` (kode pengembangan) dari daftar itu.
5. Simpan, commit, dan push. Situs akan ter-update otomatis.

**Jika kode bocor:** buat kode baru dengan langkah yang sama. HP pembeli lama yang sudah aktif **tetap bisa bermain**. Hapus hash lama jika ingin kode lama tidak bisa dipakai lagi oleh orang baru, lalu kirim kode baru ke pembeli berikutnya.

Catatan: karena repositori ini publik, orang yang paham teknis bisa melewati kode akses. Ini risiko yang sudah diterima; untuk pembeli umum, kode ini cukup.

## 3. Deploy (menerbitkan situs)

Situs dibuat dan diterbitkan otomatis oleh GitHub Actions setiap ada push ke branch `main`.

Satu kali saja, aktifkan GitHub Pages:

1. Buka repositori di GitHub → **Settings** → **Pages**.
2. Di **Build and deployment → Source**, pilih **GitHub Actions**.

Alamat situs: `https://<username>.github.io/kebun-ceria/`

## 4. Pesan untuk pembeli

Contoh pesan yang dikirim setelah pembelian (Lynk.id / TikTok Shop):

> Terima kasih sudah membeli Kebun Ceria! 🌻
>
> 1. Buka link ini di HP: https://<username>.github.io/kebun-ceria/
> 2. Ketuk tombol oranye, lalu masukkan kode: **KODE-ANDA**
> 3. Pasang ke layar utama:
>    - **Android (Chrome):** ketuk ⋮ → "Tambahkan ke layar utama" / "Instal aplikasi"
>    - **iPhone (Safari):** ketuk tombol Bagikan → "Tambah ke Layar Utama"
> 4. Setelah terpasang, Kebun Ceria bisa dimainkan tanpa internet.
>
> Pengaturan usia anak ada di Pojok Orang Tua: tahan tombol gembok di pojok kanan atas selama 3 detik.

## 5. Sebelum mulai menjual (checklist)

- [ ] Kode akses sudah diganti (langkah 2).
- [ ] Suara narator sudah lengkap, terutama bunyi huruf (langkah 1).
- [ ] Dicoba di HP Android dan, jika bisa, iPhone.
- [ ] Dicoba oleh anak usia 2–5 tahun tanpa dibantu.
- [ ] (Disarankan) Ditinjau oleh guru PAUD.
- [ ] Nama "Kebun Ceria" sudah dicek di PDKI, TikTok, Shopee, dan Play Store.
