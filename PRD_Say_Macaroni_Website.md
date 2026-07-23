# Product Requirements Document (PRD)
# Website Profiling & Katalog Produk — Say Macaroni

**Versi:** 1.0
**Tanggal:** 19 Juli 2026
**Dokumen untuk:** Tim Development / Freelancer / Agency

---

## 1. Latar Belakang

Say Macaroni adalah brand makanan ringan berupa makaroni goreng dengan berbagai varian rasa (contoh: Garlic) dan level kepedasan. Saat ini penjualan belum memiliki kanal digital resmi berupa website. Dibutuhkan website profiling yang berfungsi sebagai etalase produk (katalog) sekaligus media pemesanan, dengan alur checkout tahap awal yang diarahkan secara manual ke WhatsApp (belum terintegrasi payment gateway).

## 2. Tujuan Produk

1. Menyediakan katalog produk Say Macaroni yang bisa diakses publik secara online.
2. Memudahkan calon pembeli melihat varian rasa, level pedas, harga, dan berat kemasan.
3. Memungkinkan pembeli memilih produk + jumlah, lalu mengirim pesanan otomatis ke WhatsApp Admin tanpa perlu mengetik manual.
4. Membangun kredibilitas brand (branding, cerita brand, kontak resmi).
5. Menjadi fondasi yang siap dikembangkan ke arah e-commerce penuh (payment gateway, ongkir otomatis) di fase berikutnya.

## 3. Target Pengguna

- **Pembeli akhir (konsumen):** individu yang ingin membeli camilan makaroni untuk konsumsi pribadi/keluarga, termasuk momen spesial seperti Ramadhan/Lebaran.
- **Reseller/agen:** pihak yang ingin order dalam jumlah besar.
- **Admin toko (pemilik/owner Say Macaroni):** mengelola data produk dan menerima pesanan masuk via WhatsApp.

## 4. Ruang Lingkup (Scope)

### 4.1 In Scope (Tahap 1)
- Landing page / halaman utama (hero, highlight promo, brand story singkat)
- Halaman katalog produk (list semua varian)
- Halaman detail produk
- Fitur "Keranjang" (cart) sederhana, disimpan di sisi client (local storage), tanpa akun/login
- Checkout: generate pesan otomatis berisi daftar produk + jumlah + total estimasi, lalu redirect ke WhatsApp (via `wa.me` link)
- Halaman "Tentang Kami"
- Halaman "Hubungi Kami" (kontak, media sosial, lokasi jika ada)
- Responsive design (mobile-first, karena mayoritas trafik dari WhatsApp/Instagram ke mobile browser)
- Admin sederhana untuk update data produk (lihat opsi di bagian 7.7)

### 4.2 Out of Scope (Tahap 1 — untuk fase berikutnya)
- Pembayaran online (payment gateway: transfer otomatis, e-wallet, QRIS terintegrasi)
- Sistem akun/login pembeli
- Perhitungan ongkos kirim otomatis (integrasi kurir/logistik)
- Riwayat transaksi pembeli
- Sistem stok otomatis real-time yang terhubung ke pesanan
- Multi-bahasa

## 5. Alur Pengguna (User Flow)

1. Pengunjung membuka website (dari link di bio Instagram/WhatsApp/Google).
2. Melihat halaman utama → klik "Lihat Katalog" atau langsung scroll produk unggulan.
3. Masuk ke halaman katalog, bisa filter/sortir berdasarkan varian rasa atau level pedas.
4. Klik salah satu produk → masuk ke halaman detail (foto, deskripsi, harga dinamis per level pedas, berat, pemilih level pedas, tombol jumlah/qty). Memilih level pedas akan memperbarui harga produk secara real-time.
5. Klik "Tambah ke Keranjang" → produk beserta level pedas dan harga spesifik level tersebut masuk cart (badge jumlah item di ikon cart bertambah).
6. Bisa lanjut belanja produk lain, atau langsung klik ikon cart untuk melihat ringkasan.
7. Di halaman cart: bisa ubah jumlah, hapus item, lihat estimasi total harga.
8. Klik "Pesan via WhatsApp" → sistem generate teks pesanan otomatis → membuka WhatsApp (app/web) dengan nomor Admin Say Macaroni dan pesan sudah terisi otomatis.
9. Pembeli tinggal klik "Kirim" di WhatsApp → Admin menerima pesanan dan melanjutkan proses (konfirmasi harga final, ongkir, pembayaran) secara manual via chat.

## 6. Format Pesan Otomatis ke WhatsApp

Contoh template yang digenerate sistem (URL-encoded ke `wa.me`):

```
Halo Say Macaroni, saya ingin memesan:

1. Say Macaroni - Garlic (Level Pedas 2) x2 = Rp 52.000
2. Say Macaroni - Original (Level Pedas 0) x1 = Rp 22.000

Total: Rp 74.000

Nama: -
Alamat: -
Catatan: -

Mohon info ongkir & total pembayaran. Terima kasih!
```

Catatan: Nama/Alamat/Catatan bisa dikosongkan agar pembeli mengisi manual di chat, atau (opsional) dibuatkan form singkat sebelum redirect ke WA agar data ini otomatis terisi juga.

## 7. Kebutuhan Fungsional (Functional Requirements)

### 7.1 Halaman Utama (Home)
- Hero section dengan logo, tagline, dan foto produk
- Section "Produk Unggulan" (highlight beberapa varian, menampilkan harga dasar/mulai)
- Section promo/tema musiman (contoh: banner Ramadhan seperti pada referensi gambar yang dikirim)
- CTA ke halaman katalog dan ke WhatsApp langsung (untuk pertanyaan umum)

### 7.2 Halaman Katalog Produk
- Grid produk menampilkan: foto, nama produk, varian rasa, level pedas (ikon cabai), harga dasar / kisaran harga ("Mulai Rp XX.XXX"), berat kemasan
- Filter/kategori: berdasarkan rasa, level pedas, atau jenis kemasan
- Search bar (opsional, jika jumlah produk sudah banyak)

### 7.3 Halaman Detail Produk
- Galeri foto produk
- Nama produk, deskripsi, komposisi/bahan (opsional), berat, harga yang menyesuaikan secara real-time dengan level pedas yang dipilih
- Indikator & pemilih level pedas (visual ikon cabai + informasi harga per level)
- Input jumlah (qty stepper)
- Tombol "Tambah ke Keranjang" (menyimpan item dengan harga level pedas terkait)
- Produk terkait (related products)

### 7.4 Keranjang (Cart)
- Daftar item yang dipilih (foto, nama, varian, level pedas, harga spesifik level, qty, subtotal)
- Bisa edit qty atau hapus item
- Menampilkan total estimasi harga berdasarkan level pedas item
- Tombol "Pesan via WhatsApp" (aksi utama)
- Cart disimpan di local storage browser (bertahan meski browser ditutup, tapi tidak lintas device)

### 7.5 Halaman Tentang Kami
- Cerita brand, keunggulan produk, sertifikasi (jika ada, misal Halal/PIRT)

### 7.6 Halaman Kontak
- Nomor WhatsApp, Instagram, email (jika ada)
- Jam operasional respon chat
- Peta lokasi (jika ada toko fisik/gudang, opsional)

### 7.7 Manajemen Produk (Admin)
Untuk tahap awal, ada dua opsi realistis:
- **Opsi A (paling sederhana & murah):** Data produk dikelola langsung oleh developer/pemilik lewat file data (misal spreadsheet/CMS ringan seperti Google Sheets yang di-sync, atau headless CMS gratis seperti Sanity/Notion-as-CMS).
- **Opsi B (lebih fleksibel):** Dashboard admin sederhana (login khusus admin) untuk tambah/edit/hapus produk, upload foto, atur harga & stok tampil/tidak tampil.

*Rekomendasi: mulai dari Opsi A untuk menghemat waktu & biaya development, upgrade ke Opsi B saat jumlah produk sudah banyak atau update harga sering berubah.*

## 8. Kebutuhan Non-Fungsional

- **Responsive:** tampil optimal di mobile, tablet, desktop (prioritas mobile)
- **Performa:** waktu load halaman < 3 detik pada koneksi 4G
- **SEO dasar:** meta title/description per halaman, sitemap, gambar dengan alt text, agar mudah ditemukan di Google
- **Keamanan:** HTTPS, tidak menyimpan data sensitif pembeli di server (karena checkout manual via WA)
- **Ketersediaan:** hosting dengan uptime baik (disarankan platform seperti Vercel/Netlify untuk frontend statis + database ringan)
- **Analytics:** integrasi Google Analytics / Meta Pixel untuk memantau trafik dan sumber pengunjung

## 9. Struktur Data Produk (Data Model)

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/number | ID unik produk |
| nama | string | Nama produk, misal "Say Macaroni - Garlic" |
| varian_rasa | string | Garlic, Original, Balado, dll |
| level_pedas | array of numbers | Pilihan level pedas yang tersedia (0–5) |
| harga | number | Harga dasar / harga mulai jual |
| harga_level | array of objects `{ level, harga }` | Pengaturan harga khusus per level pedas (opsional) |
| berat | string | Contoh: 150g, 250g |
| stok_tampil | boolean | Untuk sembunyikan produk yang sedang habis |
| deskripsi | text | Deskripsi produk |
| komposisi | text | Bahan utama produk |
| foto | array of image URL / Sanity Image | Foto produk (bisa lebih dari 1) |
| kategori | string | Kategori produk (Best Seller, Classic, Spicy Fusion, dll) |
| unggulan | boolean | Penanda produk unggulan untuk banner Home |

## 10. Rekomendasi Teknologi (Tech Stack)

Karena kebutuhan tahap ini masih catalog + cart lokal + redirect WA (tanpa transaksi online), stack yang ringan dan murah cukup memadai:

- **Frontend:** Next.js / React (mudah dikembangkan lebih lanjut ke arah e-commerce nanti) atau alternatif lebih ringan seperti Astro jika ingin sangat cepat & SEO-friendly
- **Styling:** Tailwind CSS
- **Data produk:** mulai dari JSON/Google Sheets API atau headless CMS ringan (Sanity, Notion API, atau Supabase sebagai database sederhana)
- **Hosting:** Vercel/Netlify (gratis untuk skala kecil-menengah)
- **Cart state:** React Context / Zustand + local storage
- **Integrasi WhatsApp:** `https://wa.me/62xxxxxxxxxx?text=<pesan_ter-encode>`

## 11. Metrik Keberhasilan (Success Metrics)

- Jumlah pengunjung unik per bulan
- Jumlah klik tombol "Pesan via WhatsApp" (conversion dari cart ke WA)
- Rasio pengunjung katalog → detail produk → cart → checkout WA
- Waktu rata-rata pengunjung di halaman katalog/detail

## 12. Rencana Pengembangan (Roadmap Singkat)

| Fase | Fitur | Estimasi |
|---|---|---|
| Fase 1 (MVP) | Home, Katalog, Detail Produk, Cart, Checkout WA, Tentang, Kontak | 2–4 minggu |
| Fase 2 | Dashboard admin untuk kelola produk sendiri | +1–2 minggu |
| Fase 3 | Integrasi payment gateway & ongkir otomatis (opsional, jika volume order sudah besar) | Menyusul |

## 13. Lampiran

- Logo brand: bowl biru dengan tulisan "Say! Macaroni", elemen makaroni kuning
- Referensi visual kemasan: label produk mencantumkan varian rasa (contoh: Garlic) dan indikator level pedas berbentuk ikon cabai
- Tone visual: warna biru tua & kuning/emas sebagai identitas brand, dengan nuansa tema musiman (misal Ramadhan) untuk campaign tertentu

---

*Dokumen ini adalah acuan awal (living document) dan dapat disesuaikan bersama tim development seiring diskusi teknis lebih lanjut.*
