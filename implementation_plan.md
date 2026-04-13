# SIPosyandu Frontend Implementation Plan — Phase E

Melanjutkan instruksi "Selesaikan sisi frontend dulu", kita bergeser pada kelompok kedua terpenting setelah Data Balita, yaitu **Phase E — Fitur Data Ibu Hamil**.

## Propose Architecture: Halaman Data Ibu Hamil (Mocking State)

Struktur antarmuka UI akan mengikuti konsistensi gaya dari Data Balita, dan telah terintegrasi di dalam balutan `AppLayout`.

### Komponen yang akan dikembangkan:
1. **Halaman List Ibu Hamil (`/ibu-hamil`)**
   - **Fitur**: Search bar dengan debouncing (pencarian nama).
   - **Filter**: Dropdown berdasarkan (Semua Status, Normal, Risiko Rendah, Risiko Tinggi).
   - **UI**: Tabel shadcn interaktif dengan status Badge sesuai warna PRD *(Merah = Risiko Tinggi, Kuning = Rendah, Hijau = Normal)*.

2. **Form Tambah / Periksa Ibu Hamil (Zod Schema)**
   - Menggunakan komponen `Form`, `Input`, `Select`, `Label` dari shadcn/ui di dalam `Dialog`.
   - **Field Validation**: Nama Ibu*, Usia Kehamilan (Minggu)*, HPL*, Tekanan Darah (Sistolik/Diastolik)*, Berat Badan*, Riwayat Penyakit, Status Risiko.

3. **Halaman Detail Ibu Hamil (`/ibu-hamil/:id`)**
   - Panel Info dasar kehamilan (HPL, Usia Kandungan Terkini).
   - **Tabel Riwayat Kunjungan**: Menampilkan riwayat perkembangan tensi darah dan berat badan per jadwal kontrol Posyandu.
   - Tombol Add Hasil Pemeriksaan Baru.

## Verifikasi
Pekerjaan ini akan divalidasi dengan mengeksekusi `npm run dev` pada rute `/ibu-hamil` guna mengecek interaktivitas Dropdown/Search, Form Validasi, serta apakah route detail berfungsi di layout utama.
