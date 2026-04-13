# SIPosyandu — Sistem Informasi Posyandu Kelurahan Nambo Ilir Kibin

> **Dokumen:** PRD · System Design · Task List · AI Agent Prompt  
> **Author:** Tasya Pirgina Imelda (221091700127)  
> **Program:** S1 Sistem Informasi — Universitas Pamulang Kampus Serang  
> **Metode:** Design Thinking  
> **Periode KKP:** 27 Oktober – 27 November 2025

---

## DAFTAR ISI

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [System Design](#2-system-design)
3. [Task List](#3-task-list)
4. [AI Agent Prompt](#4-ai-agent-prompt)

---

# 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1.1 Ringkasan Eksekutif

SIPosyandu adalah sistem informasi berbasis web yang dirancang untuk mendigitalisasi proses pencatatan dan pelaporan kesehatan Posyandu Kelurahan Nambo Ilir Kibin, Kecamatan Kibin, Kabupaten Serang, Banten.

Sistem ini dikembangkan menggunakan pendekatan **Design Thinking** (Empathize → Define → Ideate → Prototype → Test) dengan fokus pada kader posyandu yang mayoritas bukan pengguna teknologi aktif.

**Core Problem:** Sistem pencatatan manual (buku register, KMS kertas) menyebabkan kesalahan data, keterlambatan pelaporan ke Puskesmas, dan sulitnya monitoring pertumbuhan balita secara berkelanjutan.

**Core Solution:** Antarmuka UI/UX yang intuitif dan responsif, menghasilkan prototype yang diuji langsung oleh pengguna dengan metode SUS (System Usability Scale).

---

## 1.2 Latar Belakang & Problem Statement

### Kondisi Eksisting (As-Is)

- Pencatatan balita, ibu hamil, dan imunisasi dilakukan manual di buku register dan KMS kertas
- Data rentan hilang, rusak, atau tidak terbaca
- Rekap laporan bulanan ke Puskesmas harus dilakukan manual — memakan waktu berhari-hari
- Kader tidak dapat memantau tren pertumbuhan balita lintas kunjungan secara cepat
- Tidak ada sistem pengingat jadwal imunisasi
- Masyarakat harus hadir fisik ke Posyandu hanya untuk tahu jadwal kegiatan

### Identifikasi Masalah

| No   | Masalah                              | Dampak                             | Prioritas |
| ---- | ------------------------------------ | ---------------------------------- | --------- |
| M-01 | Pencatatan manual tidak efisien      | Kesalahan data, proses lambat      | Tinggi    |
| M-02 | Antarmuka sistem lama tidak intuitif | Kader kebingungan, tidak dipakai   | Tinggi    |
| M-03 | Tidak ada dashboard monitoring       | Sulit evaluasi kinerja Posyandu    | Sedang    |
| M-04 | Pelaporan ke Puskesmas lambat        | Keterlambatan tindak lanjut medis  | Tinggi    |
| M-05 | Tidak ada notifikasi imunisasi       | Balita melewatkan jadwal imunisasi | Sedang    |
| M-06 | Tidak ada visualisasi tumbuh kembang | Deteksi gizi buruk terlambat       | Sedang    |

### Rumusan Masalah

1. Bagaimana merancang sistem informasi Posyandu yang membantu pencatatan data secara digital dan efisien?
2. Bagaimana penerapan metode Design Thinking dalam pengembangan UI/UX sistem informasi Posyandu?

---

## 1.3 Target Pengguna (User Personas)

### Persona 1 — Kader Posyandu (Primary User)

- **Profil:** Perempuan, 30–55 tahun, kemampuan teknologi rendah hingga sedang
- **Kebutuhan:** Input data cepat, form sederhana, tombol besar, navigasi jelas
- **Pain Points:** Layar kecil di HP, banyak kolom membingungkan, takut salah input
- **Goal:** Catat data balita dan ibu hamil tanpa kesalahan, tanpa pelatihan panjang

### Persona 2 — Admin Posyandu

- **Profil:** Pengurus Posyandu (Ketua/Sekretaris), 35–55 tahun
- **Kebutuhan:** Kelola akun kader, jadwal kegiatan, generate laporan bulanan
- **Pain Points:** Rekap data dari buku register menyita waktu berjam-jam
- **Goal:** Generate dan kirim laporan ke Puskesmas dalam hitungan menit

### Persona 3 — Petugas Puskesmas

- **Profil:** Bidan desa atau tenaga medis Puskesmas Kibin
- **Kebutuhan:** Akses laporan rekapitulasi, data imunisasi, status gizi wilayah
- **Pain Points:** Laporan dari Posyandu sering terlambat dan tidak terstandar
- **Goal:** Monitor data kesehatan wilayah secara real-time tanpa menunggu laporan fisik

### Persona 4 — Masyarakat (Ibu Balita)

- **Profil:** Ibu dengan anak balita, usia 20–40 tahun, literasi teknologi bervariasi
- **Kebutuhan:** Lihat jadwal Posyandu, riwayat imunisasi dan tumbuh kembang anak
- **Pain Points:** Harus datang fisik hanya untuk tahu jadwal, sering lupa imunisasi
- **Goal:** Pantau tumbuh kembang anak secara mandiri dari HP

---

## 1.4 Kebutuhan Fungsional

| ID   | Fitur                    | Deskripsi                                                           | Role              |
| ---- | ------------------------ | ------------------------------------------------------------------- | ----------------- |
| F-01 | Login & Autentikasi      | Login multi-role dengan session berbasis JWT                        | Semua             |
| F-02 | Registrasi Akun          | Daftar akun baru, diverifikasi oleh Admin                           | Semua             |
| F-03 | Input Data Balita & Anak Kecil| Catat nama, tgl lahir, BB, TB, status gizi, imunisasi per kunjungan | Kader             |
| F-04 | Input Ibu Hamil & Menyusui| Catat usia kehamilan, tekanan darah, BB, risiko, nifas, catatan bidan | Kader             |
| F-05a| Input Data Remaja        | Catat berat badan, tensi darah, status gizi, edukasi, kesehatan       | Kader             |
| F-05b| Input Dewasa & Lansia    | Catat riwayat kesehatan dasar, tensi darah, gula darah, PTM           | Kader             |
| F-06 | Jadwal Kegiatan          | Buat, edit, dan lihat jadwal kegiatan Posyandu bulanan              | Admin, Kader      |
| F-07 | Rekapitulasi & Laporan   | Generate laporan per periode dalam format PDF dan Excel             | Admin             |
| F-08 | Grafik Tumbuh Kembang    | Visualisasi pertumbuhan BB dan TB balita vs standar WHO             | Kader, Masyarakat |
| F-09 | Notifikasi Imunisasi     | Pengingat otomatis jadwal imunisasi kepada kader dan orang tua      | Sistem            |
| F-10 | Manajemen Pengguna       | CRUD akun kader dan petugas                                         | Admin             |
| F-11 | Dashboard Monitoring     | Ringkasan statistik: peserta hadir, status gizi, kegiatan terbaru   | Admin, Kader      |
| F-12 | Download & Cetak Laporan | Unduh PDF/Excel, cetak langsung dari browser                        | Admin             |
| F-13 | Riwayat Kunjungan        | Peserta lihat histori kunjungan, imunisasi, dan perkembangan anak   | Masyarakat        |

---

## 1.5 Kebutuhan Non-Fungsional

| ID    | Kategori          | Deskripsi                                          | Target Terukur                  |
| ----- | ----------------- | -------------------------------------------------- | ------------------------------- |
| NF-01 | Usability         | Mudah digunakan tanpa pelatihan teknis             | SUS Score ≥ 68                  |
| NF-02 | Responsiveness    | Tampil baik di HP, tablet, dan laptop              | Lulus uji 320px–1440px          |
| NF-03 | Security          | Data kesehatan aman, akses berbasis role           | HTTPS + JWT + RBAC              |
| NF-04 | Reliability       | Stabil saat digunakan banyak user bersamaan        | Uptime ≥ 99%                    |
| NF-05 | Accessibility     | Dapat diakses kapan saja tanpa batasan waktu       | 24/7 online                     |
| NF-06 | Performance       | Halaman load tanpa lag                             | Page load < 3 detik             |
| NF-07 | Maintainability   | Kode mudah dikembangkan dan diperbarui             | Modular, terdokumentasi         |
| NF-08 | Interface Quality | Antarmuka bersih, tidak membingungkan              | Lulus usability test            |
| NF-09 | Storage           | Mampu menyimpan data dalam jumlah besar            | Database relasional terstruktur |
| NF-10 | Language          | Seluruh antarmuka dalam Bahasa Indonesia sederhana | 100% Bahasa Indonesia           |

---

## 1.6 Batasan Scope

**Dalam Scope:**

- Perancangan antarmuka UI/UX (wireframe, mockup, prototype interaktif)
- Pengujian prototype dengan metode SUS dan Black Box Testing
- Dokumentasi sistem informasi Posyandu

**Luar Scope:**

- Pengembangan backend/server dan database production
- Deployment ke hosting/cloud
- Integrasi dengan sistem eksternal (BPJS, Kemenkes, dll.)

---

## 1.7 Success Metrics

| Metrik               | Target                      | Cara Ukur                        |
| -------------------- | --------------------------- | -------------------------------- |
| SUS Score            | ≥ 68 (Acceptable)           | Kuesioner SUS 10 poin Likert 1–5 |
| Task Completion Rate | ≥ 80%                       | Usability Testing skenario tugas |
| Error Rate           | < 10%                       | Black Box Testing                |
| User Satisfaction    | ≥ 4 dari 5                  | Rating feedback kader            |
| Kecepatan Pelaporan  | 70% lebih cepat dari manual | Benchmarking stopwatch           |

---

# 2. SYSTEM DESIGN

## 2.1 Arsitektur Sistem (3-Tier Architecture)

```
┌──────────────────────────────────────────────────────┐
│                  PRESENTATION TIER                    │
│         Web Browser / Mobile Browser                  │
│    React.js + Vite + Tailwind CSS (SPA / Responsive)  │
│  Halaman: Login, Dashboard, Form Input, Laporan, dll  │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS / REST API
┌─────────────────────────▼────────────────────────────┐
│                  APPLICATION TIER                     │
│             Node.js + Express.js                      │
│  - REST API (JSON)                                    │
│  - Autentikasi JWT + RBAC                             │
│  - Business Logic (kalkulasi status gizi, dll.)       │
│  - Report Generator (PDF: PDFKit, Excel: ExcelJS)     │
│  - Notification Service (jadwal imunisasi)            │
└─────────────────────────┬────────────────────────────┘
                          │ SQL via Prisma ORM
┌─────────────────────────▼────────────────────────────┐
│                    DATA TIER                          │
│               MySQL / PostgreSQL                      │
│  Tabel: users, balita, pengukuran, imunisasi,         │
│         ibu_hamil, lansia, kegiatan, laporan          │
└──────────────────────────────────────────────────────┘
```

---

## 2.2 Struktur Role & Hak Akses (RBAC)

| Fitur                       | Masyarakat | Kader | Admin | Puskesmas |
| --------------------------- | :--------: | :---: | :---: | :-------: |
| Login / Register            |     ✅     |  ✅   |  ✅   |    ✅     |
| Lihat jadwal Posyandu       |     ✅     |  ✅   |  ✅   |    ✅     |
| Lihat riwayat anak sendiri  |     ✅     |   —   |   —   |     —     |
| Input data balita           |     —      |  ✅   |  ✅   |     —     |
| Input data ibu hamil        |     —      |  ✅   |  ✅   |     —     |
| Input data lansia           |     —      |  ✅   |  ✅   |     —     |
| Lihat dashboard monitoring  |     —      |  ✅   |  ✅   |    ✅     |
| Kelola jadwal kegiatan      |     —      |  ✅   |  ✅   |     —     |
| Generate & download laporan |     —      |   —   |  ✅   |    ✅     |
| Manajemen pengguna (CRUD)   |     —      |   —   |  ✅   |     —     |

---

## 2.3 Desain Database (ERD)

### Tabel: `users`

```
users
├── id            INT PK AUTO_INCREMENT
├── nama          VARCHAR(100)
├── username      VARCHAR(50) UNIQUE
├── password      VARCHAR(255)  -- bcrypt hash
├── role          ENUM('admin','kader','puskesmas','masyarakat')
├── no_telepon    VARCHAR(20)
├── created_at    TIMESTAMP
└── updated_at    TIMESTAMP
```

### Tabel: `balita`

```
balita
├── id            INT PK AUTO_INCREMENT
├── user_id       INT FK → users.id  -- orang tua
├── nama          VARCHAR(100)
├── tgl_lahir     DATE
├── jenis_kelamin ENUM('L','P')
├── nama_ayah     VARCHAR(100)
├── nama_ibu      VARCHAR(100)
├── alamat        TEXT
└── created_at    TIMESTAMP
```

### Tabel: `pengukuran`

```
pengukuran
├── id             INT PK AUTO_INCREMENT
├── balita_id      INT FK → balita.id
├── kader_id       INT FK → users.id
├── tgl_ukur       DATE
├── berat_badan    DECIMAL(5,2)  -- kg
├── tinggi_badan   DECIMAL(5,2)  -- cm
├── lingkar_kepala DECIMAL(5,2)  -- cm
├── status_gizi    ENUM('Baik','Kurang','Buruk','Lebih')
├── catatan        TEXT
└── created_at     TIMESTAMP
```

### Tabel: `imunisasi`

```
imunisasi
├── id              INT PK AUTO_INCREMENT
├── balita_id       INT FK → balita.id
├── kader_id        INT FK → users.id
├── jenis_vaksin    VARCHAR(50)  -- HB0, BCG, DPT, Polio, Campak, dll.
├── tgl_imunisasi   DATE
├── tgl_berikutnya  DATE
├── petugas         VARCHAR(100)
├── catatan         TEXT
└── created_at      TIMESTAMP
```

### Tabel: `ibu_hamil`

```
ibu_hamil
├── id             INT PK AUTO_INCREMENT
├── user_id        INT FK → users.id
├── kader_id       INT FK → users.id
├── tgl_kunjungan  DATE
├── usia_kehamilan INT  -- minggu
├── tgl_tafsiran   DATE
├── tekanan_darah  VARCHAR(20)
├── berat_badan    DECIMAL(5,2)
├── status_risiko  ENUM('Normal','Risiko Rendah','Risiko Tinggi')
├── catatan        TEXT
└── created_at     TIMESTAMP
```

### Tabel: `kegiatan`

```
kegiatan
├── id           INT PK AUTO_INCREMENT
├── admin_id     INT FK → users.id
├── tanggal      DATE
├── tema         VARCHAR(200)
├── lokasi       VARCHAR(200)
├── jumlah_hadir INT DEFAULT 0
├── status       ENUM('Terjadwal','Selesai','Dibatalkan')
└── created_at   TIMESTAMP
```

### Tabel: `laporan`

```
laporan
├── id               INT PK AUTO_INCREMENT
├── kegiatan_id      INT FK → kegiatan.id
├── admin_id         INT FK → users.id
├── periode          VARCHAR(7)  -- format: YYYY-MM
├── total_balita     INT
├── gizi_baik        INT
├── gizi_kurang      INT
├── gizi_buruk       INT
├── total_ibu_hamil  INT
├── file_url         VARCHAR(255)
└── generated_at     TIMESTAMP
```

### Relasi Antar Tabel

```
users (1) ──< (N) balita           -- orang tua memiliki banyak balita
users (1) ──< (N) ibu_hamil        -- kader mencatat banyak ibu hamil
balita (1) ──< (N) pengukuran      -- balita punya banyak riwayat ukur
balita (1) ──< (N) imunisasi       -- balita punya banyak riwayat imun
users (1) ──< (N) kegiatan         -- admin buat banyak kegiatan
kegiatan (1) ──< (N) laporan       -- kegiatan punya laporan
```

---

## 2.4 REST API Endpoints

### Auth

```
POST   /api/auth/login           -- Login, return JWT token
POST   /api/auth/register        -- Registrasi akun baru
POST   /api/auth/logout          -- Logout, invalidate token
```

### Balita

```
GET    /api/balita               -- List semua balita (Kader/Admin)
POST   /api/balita               -- Tambah balita baru
GET    /api/balita/:id           -- Detail balita
PUT    /api/balita/:id           -- Update data balita
GET    /api/balita/:id/pengukuran -- Riwayat pengukuran
POST   /api/balita/:id/pengukuran -- Tambah pengukuran baru
GET    /api/balita/:id/imunisasi  -- Riwayat imunisasi
POST   /api/balita/:id/imunisasi  -- Tambah imunisasi baru
```

### Ibu Hamil

```
GET    /api/ibu-hamil            -- List ibu hamil
POST   /api/ibu-hamil            -- Tambah data ibu hamil
GET    /api/ibu-hamil/:id        -- Detail ibu hamil
PUT    /api/ibu-hamil/:id        -- Update data
```

### Kegiatan

```
GET    /api/kegiatan             -- List jadwal (publik)
POST   /api/kegiatan             -- Buat jadwal baru (Admin/Kader)
PUT    /api/kegiatan/:id         -- Update jadwal
DELETE /api/kegiatan/:id         -- Hapus jadwal
```

### Laporan

```
GET    /api/laporan              -- List laporan tersimpan
POST   /api/laporan/generate     -- Generate laporan per periode
GET    /api/laporan/:id/pdf      -- Download PDF
GET    /api/laporan/:id/excel    -- Download Excel
```

### Dashboard

```
GET    /api/dashboard/stats           -- Ringkasan statistik
GET    /api/dashboard/grafik/:id      -- Data grafik tumbuh kembang balita
```

### Users (Admin only)

```
GET    /api/users                -- List semua user
POST   /api/users                -- Tambah user
PUT    /api/users/:id            -- Update user
DELETE /api/users/:id            -- Hapus user
```

---

## 2.5 Alur Sistem Utama

### Alur: Input Data Balita

```
Kader Login
     │
     ▼
Dashboard → Menu "Data Balita"
     │
     ▼
Cari balita berdasarkan nama
     │
     ├── [Ditemukan] → Buka form update pengukuran
     │
     └── [Tidak Ditemukan] → Form tambah balita baru
               │
               ▼
     Input: BB, TB, Status Gizi, Imunisasi, Catatan
               │
               ▼
     Validasi data (semua field wajib terisi)
               │
     ├── [Valid] → Simpan ke database
     │                   │
     │                   ▼
     │           Update grafik tumbuh kembang
     │                   │
     │                   ▼
     │           Tampilkan notifikasi sukses
     │
     └── [Tidak Valid] → Tampilkan pesan error spesifik
```

### Alur: Generate Laporan Bulanan

```
Admin Login → Dashboard
     │
     ▼
Menu "Laporan" → Pilih periode (bulan/tahun)
     │
     ▼
Sistem kalkulasi otomatis:
  - Total balita hadir
  - Distribusi status gizi (Baik / Kurang / Buruk)
  - Total ibu hamil
  - Jumlah imunisasi per jenis vaksin
     │
     ▼
Preview ringkasan di halaman
     │
     ├── Download PDF  → File terunduh
     └── Download Excel → File terunduh
```

---

## 2.6 UI Design Specification

### Design System

| Elemen               | Nilai                           |
| -------------------- | ------------------------------- |
| Font Utama           | Plus Jakarta Sans               |
| Font Display         | Fraunces (judul besar)          |
| Warna Primer         | `#0d8a4f` — Hijau Posyandu      |
| Warna Sekunder       | `#2ec4b6` — Teal aksen          |
| Warna Warning        | `#f4a435` — Amber               |
| Warna Danger         | `#ef5350` — Merah               |
| Background           | `#f8faf8` — Off-white kehijauan |
| Card Background      | `#ffffff`                       |
| Border Radius Card   | `16px`                          |
| Border Radius Button | `10px`                          |
| Shadow Card          | `0 2px 12px rgba(0,0,0,0.06)`   |

### Struktur Halaman Aplikasi

```
1. Halaman Login
   └── Form: username, password, tombol masuk

2. Dashboard (berbeda per role)
   ├── Sidebar navigasi (desktop) / Bottom nav (mobile)
   ├── Stat cards: balita hadir, imunisasi pekan ini, dll.
   ├── Mini grafik tren kunjungan 6 bulan
   └── Tabel kegiatan mendatang + alert imunisasi

3. Data Balita & Anak Kecil
   ├── List balita + search + filter status gizi
   ├── Form tambah / edit balita
   ├── Detail balita: riwayat pengukuran + grafik BB/TB vs WHO
   └── Form pengukuran baru

4. Data Ibu Hamil & Menyusui
   ├── List + search
   ├── Form tambah / edit
   └── Detail: riwayat kunjungan

5. Data Remaja
   ├── List + search
   ├── Form tambah / edit
   └── Detail: riwayat pemeriksaan gizi dan kesehatan

6. Data Usia Dewasa & Lansia
   ├── List + search
   ├── Form tambah / edit
   └── Detail: riwayat pemeriksaan Penyakit Tidak Menular (PTM)

7. Jadwal Posyandu
   ├── Kalender bulanan
   ├── Form buat kegiatan
   └── Detail kegiatan

8. Laporan
   ├── Pilih periode
   ├── Preview tabel rekapitulasi
   ├── Tombol Download PDF
   └── Tombol Download Excel

9. Manajemen Pengguna (Admin)
   ├── List user + filter role
   └── Form tambah / edit / nonaktifkan user

10. Profil & Pengaturan
   └── Edit data diri, ubah password
```

---

## 2.7 Pengujian Sistem

### Black Box Testing

| ID    | Modul        | Skenario            | Input                               | Expected Output                            |
| ----- | ------------ | ------------------- | ----------------------------------- | ------------------------------------------ |
| TC-01 | Login        | Kredensial valid    | username: kader1, pass: posyandu123 | Masuk ke dashboard kader                   |
| TC-02 | Login        | Kredensial salah    | pass: salah                         | Pesan error "Username atau password salah" |
| TC-03 | Input Balita | Data lengkap valid  | Nama: Rizky, BB: 11 kg, TB: 65 cm   | Data tersimpan, grafik diperbarui          |
| TC-04 | Input Balita | Field BB kosong     | BB: (kosong)                        | Error "Berat badan wajib diisi"            |
| TC-05 | Role Access  | Kader akses laporan | Login kader, buka /laporan/generate | Redirect + pesan "Akses ditolak"           |
| TC-06 | Laporan      | Generate PDF        | Pilih periode Jan 2025              | File PDF terunduh, data sesuai             |
| TC-07 | Responsif    | Buka di HP 375px    | Semua halaman                       | Layout tidak rusak, tombol terjangkau      |
| TC-08 | Notifikasi   | Imunisasi besok     | Tgl berikutnya = besok              | Alert muncul di dashboard                  |

### SUS Testing — 10 Pernyataan

| No  | Pernyataan                                                            | Tipe    |
| --- | --------------------------------------------------------------------- | ------- |
| 1   | Saya merasa sistem ini mudah untuk digunakan                          | Positif |
| 2   | Saya merasa fitur pada sistem ini dirancang dengan baik               | Positif |
| 3   | Saya membutuhkan bantuan teknis untuk menggunakan sistem ini          | Negatif |
| 4   | Sistem ini terlihat rumit dan membingungkan                           | Negatif |
| 5   | Saya merasa nyaman menggunakan sistem ini                             | Positif |
| 6   | Saya merasa menu dan tombol sangat mudah dipahami                     | Positif |
| 7   | Saya merasa sistem ini tidak konsisten tampilannya                    | Negatif |
| 8   | Saya yakin bisa menggunakan sistem ini tanpa bantuan                  | Positif |
| 9   | Saya perlu mempelajari banyak hal sebelum bisa menggunakan sistem ini | Negatif |
| 10  | Saya ingin menggunakan sistem ini untuk kegiatan Posyandu selanjutnya | Positif |

**Skala Penilaian SUS:**

| Skor      | Grade | Kategori                           |
| --------- | ----- | ---------------------------------- |
| ≥ 80.3    | A     | Excellent                          |
| 68 – 80.2 | B     | Good / Acceptable ← target minimum |
| 51 – 67.9 | C     | OK                                 |
| < 51      | D/F   | Poor                               |

---

# 3. TASK LIST

## Sprint 0 — Setup & Persiapan

- [ ] `TASK-001` Koordinasi dengan Ketua Posyandu Nambo Ilir Kibin
- [ ] `TASK-002` Siapkan surat pengantar KKP dari kampus
- [ ] `TASK-003` Setup Figma: buat project, install plugin Iconify & Lorem Ipsum
- [ ] `TASK-004` Pelajari literatur: Design Thinking, UI/UX Posyandu, metode SUS

---

## Fase 1 — Empathize (Minggu 1: 27 Okt – 2 Nov 2025)

**Observasi Lapangan**

- [ ] `TASK-101` Observasi langsung alur kerja 5 meja Posyandu
- [ ] `TASK-102` Dokumentasi sistem pencatatan manual (foto buku register, KMS)
- [ ] `TASK-103` Catat seluruh kendala yang terlihat di lapangan

**Wawancara Pengguna**

- [ ] `TASK-104` Wawancara Ketua Posyandu — pain point sistem lama
- [ ] `TASK-105` Wawancara minimal 3 kader — kesulitan pencatatan harian
- [ ] `TASK-106` Wawancara Petugas Puskesmas — kebutuhan laporan
- [ ] `TASK-107` Survey singkat ibu balita — kebutuhan akses informasi mandiri

**Analisis & Dokumentasi**

- [ ] `TASK-108` Buat Empathy Map untuk setiap persona
- [ ] `TASK-109` Rangkum temuan observasi dan wawancara dalam dokumen
- [ ] `TASK-110` Validasi temuan ke pembimbing lapangan

---

## Fase 2 — Define & Ideate (Minggu 2: 3 – 9 Nov 2025)

**Define**

- [ ] `TASK-201` Tulis Problem Statement (format: "How Might We...")
- [ ] `TASK-202` Prioritaskan masalah dengan matriks Impact vs Feasibility
- [ ] `TASK-203` Tentukan fitur MoSCoW (Must / Should / Could / Won't)

**Ideate**

- [ ] `TASK-204` Brainstorming fitur — mind mapping digital
- [ ] `TASK-205` Buat User Flow untuk setiap role (4 role × 3 skenario utama)
- [ ] `TASK-206` Susun Information Architecture (sitemap seluruh halaman)
- [ ] `TASK-207` Buat flowchart alur: login, input balita, generate laporan
- [ ] `TASK-208` Review dan finalisasi konsep desain bersama kader

---

## Fase 3 — Prototype (Minggu 3: 10 – 16 Nov 2025)

**Wireframe (Low-Fidelity)**

- [ ] `TASK-301` Wireframe halaman Login
- [ ] `TASK-302` Wireframe Dashboard Kader
- [ ] `TASK-303` Wireframe Dashboard Admin
- [ ] `TASK-304` Wireframe List & Form Input Data Balita
- [ ] `TASK-305` Wireframe Detail Balita + Grafik Tumbuh Kembang
- [ ] `TASK-306` Wireframe Form Input Ibu Hamil
- [ ] `TASK-307` Wireframe Halaman Jadwal Kegiatan
- [ ] `TASK-308` Wireframe Halaman Laporan & Download
- [ ] `TASK-309` Wireframe Manajemen Pengguna (Admin)
- [ ] `TASK-310` Review wireframe dengan dosen pembimbing

**Mockup & Design System (High-Fidelity)**

- [ ] `TASK-311` Buat Design System di Figma (warna, tipografi, komponen reusable)
- [ ] `TASK-312` Mockup Splash Screen & Login
- [ ] `TASK-313` Mockup Dashboard Kader (mobile-first)
- [ ] `TASK-314` Mockup Dashboard Admin
- [ ] `TASK-315` Mockup Form Input Balita
- [ ] `TASK-316` Mockup Detail Balita + Grafik WHO
- [ ] `TASK-317` Mockup Halaman Laporan Dokumen
- [ ] `TASK-318` Mockup Notifikasi & Alert imunisasi

**Prototype Interaktif**

- [ ] `TASK-319` Hubungkan seluruh frame dengan Figma Prototype
- [ ] `TASK-320` Setup flow utama: login → dashboard → input balita → simpan
- [ ] `TASK-321` Export link prototype untuk sesi testing

---

## Fase 4 — Testing & Evaluasi (Minggu 4: 17 – 23 Nov 2025)

**Persiapan**

- [ ] `TASK-401` Siapkan kuesioner SUS (cetak 10 eksemplar)
- [ ] `TASK-402` Rekrut peserta: 5 kader + 3 ibu balita + 1 admin
- [ ] `TASK-403` Siapkan 5 skenario tugas (task scenario) untuk usability test

**Pelaksanaan**

- [ ] `TASK-404` Jalankan Black Box Testing seluruh fitur (TC-01 s/d TC-08)
- [ ] `TASK-405` Usability Testing Sesi 1 bersama kader Posyandu
- [ ] `TASK-406` Distribusi dan pengisian kuesioner SUS
- [ ] `TASK-407` Rekap dan hitung skor SUS (rumus SUS standar)
- [ ] `TASK-408` Kumpulkan catatan feedback kualitatif pengguna

**Iterasi**

- [ ] `TASK-409` Identifikasi usability issues dari sesi testing
- [ ] `TASK-410` Revisi desain di Figma berdasarkan temuan
- [ ] `TASK-411` Usability Testing Sesi 2 — validasi hasil perbaikan
- [ ] `TASK-412` Finalisasi prototype dan dokumentasikan versi akhir

---

## Fase 5 — Dokumentasi (Minggu 5: 24 – 27 Nov 2025)

**Penulisan Laporan**

- [ ] `TASK-501` Tulis BAB I — Pendahuluan
- [ ] `TASK-502` Tulis BAB II — Profil Tempat, Landasan Teori, Metode
- [ ] `TASK-503` Tulis BAB III — Perancangan & Hasil
- [ ] `TASK-504` Tulis BAB IV — Penutup (Kesimpulan & Saran)
- [ ] `TASK-505` Susun Daftar Pustaka (format APA)
- [ ] `TASK-506` Lampiran: dokumentasi foto kegiatan
- [ ] `TASK-507` Lampiran: hasil SUS Testing (tabel + analisis)
- [ ] `TASK-508` Lampiran: screenshot wireframe, mockup, prototype

**Finalisasi**

- [ ] `TASK-509` Submit draft laporan ke dosen pembimbing
- [ ] `TASK-510` Revisi sesuai masukan pembimbing
- [ ] `TASK-511` Cetak dan jilid laporan akhir KKP
- [ ] `TASK-512` Presentasi hasil KKP ke penguji

---

## Ringkasan Task

| Fase                     | Jumlah Task |
| ------------------------ | ----------- |
| Sprint 0 — Setup         | 4           |
| Fase 1 — Empathize       | 10          |
| Fase 2 — Define & Ideate | 8           |
| Fase 3 — Prototype       | 21          |
| Fase 4 — Testing         | 12          |
| Fase 5 — Dokumentasi     | 12          |
| **Total**                | **67 task** |

---

# 4. AI AGENT PROMPT

Prompt ini digunakan untuk memberikan konteks kepada AI agent (Cursor, Claude Code, v0, Bolt, dll.) saat membangun website SIPosyandu berdasarkan PRD dan System Design di atas.

---

## 4.1 Project Context Prompt

Tempel prompt ini di awal setiap sesi baru dengan AI agent:

```
Kamu adalah senior full-stack developer yang bertugas membangun
SIPosyandu — Sistem Informasi Posyandu Kelurahan Nambo Ilir Kibin.

## Konteks Proyek
SIPosyandu adalah web app untuk mendigitalisasi pencatatan dan pelaporan
kesehatan Posyandu. Pengguna utama adalah kader Posyandu (perempuan
30-55 tahun, kemampuan teknologi rendah-sedang), sehingga UI harus sangat
intuitif: tombol besar, label jelas, form sederhana, feedback langsung
saat ada error.

## Tech Stack
- Frontend  : React.js + Vite + TypeScript + Tailwind CSS + shadcn/ui
- Backend   : Node.js + Express.js
- Database  : MySQL dengan Prisma ORM
- Auth      : JWT + bcrypt (role-based: admin, kader, puskesmas, masyarakat)
- PDF       : PDFKit
- Excel     : ExcelJS
- Charts    : Recharts (grafik tumbuh kembang + standar WHO)
- State     : Zustand (global) + React Query (server state)
- Forms     : react-hook-form + zod validation

## Design System
- Warna primer  : #0d8a4f (hijau Posyandu)
- Warna sekunder: #2ec4b6 (teal)
- Warning       : #f4a435 (amber)
- Danger        : #ef5350 (merah)
- Font          : Plus Jakarta Sans
- Border radius : card 16px, button 10px
- Mobile-first, responsive 320px – 1440px
- Seluruh teks UI dalam Bahasa Indonesia sederhana

## Struktur Folder
/frontend
  /src
    /components   -- komponen reusable (Button, Card, Modal, Table, dll.)
    /pages        -- halaman utama (Login, Dashboard, Balita, Laporan, dll.)
    /hooks        -- custom hooks (useAuth, useBalita, useDashboard, dll.)
    /services     -- API call functions (axios instance + endpoints)
    /utils        -- helper (formatDate, hitungStatusGizi, hitungSUS, dll.)
    /types        -- TypeScript interfaces & types
    /store        -- Zustand stores (authStore, notifStore)

/backend
  /src
    /routes       -- Express routers per domain (auth, balita, laporan, dll.)
    /controllers  -- Business logic per domain
    /middleware   -- authMiddleware, roleMiddleware, errorHandler
    /services     -- reportGenerator, notificationService
    /utils        -- helpers (kalkulasiGizi, paginasi, dll.)
  /prisma
    schema.prisma -- Database schema lengkap

## Aturan Penting
1. Semua protected routes wajib ada middleware auth + role check
2. Semua form wajib validasi di frontend (zod) DAN backend
3. Setiap API call wajib ada loading state dan error state di UI
4. Gunakan skeleton loading, bukan spinner polos
5. Empty state wajib ada di setiap halaman list
6. Komentar kode dalam Bahasa Indonesia
7. Ikuti struktur folder di atas secara konsisten
```

---

## 4.2 Prompt per Fase Development

### Fase A — Setup & Database

```
Tugas pertama: Setup project dari nol.

1. Inisialisasi project:
   - Frontend: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
   - Backend: Node.js + Express + TypeScript
   - Prisma + koneksi ke MySQL

2. Buat schema Prisma berdasarkan ERD berikut:
   - Tabel: users, balita, pengukuran, imunisasi, ibu_hamil, kegiatan, laporan
   - Relasi: sesuai yang sudah didefinisikan di dokumen system design

3. Buat seed data:
   - 1 admin, 2 kader, 1 petugas puskesmas, 3 akun masyarakat
   - 5 data balita dengan riwayat pengukuran 3 bulan terakhir
   - Jadwal imunisasi: 1 balita dengan jadwal besok (untuk test notifikasi)

4. Test koneksi dan jalankan migration

Output yang diharapkan:
- Semua service berjalan tanpa error
- Seed data berhasil masuk ke database
- GET /api/health mengembalikan { status: "ok", timestamp: "..." }
```

### Fase B — Autentikasi

```
Tugas: Bangun sistem autentikasi lengkap.

Backend:
- POST /api/auth/login
  Input: { username, password }
  Output: { token, user: { id, nama, role } }
  Error: 401 jika kredensial salah

- POST /api/auth/register
  Input: { nama, username, password, role, no_telepon }
  Hash password dengan bcrypt (salt rounds: 12)

- Middleware authMiddleware:
  Ambil token dari header Authorization: Bearer <token>
  Verify JWT, attach user ke req.user
  Return 401 jika token tidak valid atau expired

- Middleware roleMiddleware(roles: string[]):
  Cek req.user.role ada di array roles
  Return 403 jika tidak sesuai

Frontend:
- Halaman Login yang menarik, warna hijau primer, bukan abu-abu
- Form: username, password (dengan toggle show/hide), tombol Login
- Tampil pesan error yang jelas jika gagal
- Setelah login berhasil, redirect ke dashboard sesuai role
- Simpan token di localStorage, attach di setiap request axios
- Tombol logout dengan konfirmasi dialog
- Route guard: halaman yang butuh auth redirect ke /login jika tidak ada token
```

### Fase C — Dashboard

```
Tugas: Bangun halaman Dashboard yang berbeda per role.

Backend:
- GET /api/dashboard/stats
  Response (disesuaikan per role dari token):
  {
    balita_terdaftar: number,
    kunjungan_bulan_ini: number,
    imunisasi_mendatang_7_hari: number,
    ibu_hamil_aktif: number,
    kegiatan_mendatang: array,
    alert_imunisasi: array  -- balita dengan jadwal imunisasi ≤ 7 hari
  }

Frontend — Dashboard Kader:
- 4 stat cards: Balita Terdaftar, Kunjungan Bulan Ini,
  Imunisasi Pekan Ini, Kegiatan Mendatang
- Bar chart: tren kunjungan 6 bulan terakhir (Recharts)
- Tabel: 5 balita terakhir diinput (nama, usia, status gizi)
- Alert banner merah/kuning jika ada balita dengan imunisasi mendatang

Frontend — Dashboard Admin:
- Semua dari kader +
- Stat tambahan: Total kader aktif, Laporan bulan ini sudah/belum dibuat
- Quick action buttons: Buat Laporan, Tambah Kader, Jadwal Kegiatan

Layout:
- Desktop: sidebar kiri tetap + konten kanan
- Mobile: bottom navigation bar (5 icon)
- Semua icon dari lucide-react
- Skeleton loading saat data masih di-fetch
```

### Fase D — Fitur Data Balita

```
Tugas: Bangun fitur data balita — ini fitur PALING PENTING.

Backend:
- GET  /api/balita?search=&page=1&limit=10
- POST /api/balita  (body: data balita baru)
- GET  /api/balita/:id  (dengan relasi pengukuran + imunisasi terbaru)
- PUT  /api/balita/:id
- GET  /api/balita/:id/pengukuran  (semua riwayat, sorted by date desc)
- POST /api/balita/:id/pengukuran  (tambah pengukuran baru)
  -- Auto-kalkulasi status_gizi berdasarkan BB/TB vs tabel WHO
- GET  /api/balita/:id/imunisasi
- POST /api/balita/:id/imunisasi

Frontend:
1. Halaman List Balita
   - Search by nama (debounce 300ms)
   - Filter dropdown: semua / gizi baik / gizi kurang / gizi buruk
   - Pagination (10 per halaman)
   - Setiap baris: nama, usia, BB terakhir, status gizi (badge warna)
   - Klik baris → halaman detail balita
   - Tombol "+ Tambah Balita" di kanan atas

2. Form Tambah Balita (modal atau halaman tersendiri)
   - Field: Nama Lengkap*, Tanggal Lahir*, Jenis Kelamin*,
     Nama Ayah*, Nama Ibu*, Alamat
   - Validasi: field * wajib, tgl lahir tidak boleh masa depan
   - Tombol Simpan: disable + spinner saat submit
   - Setelah sukses: toast hijau "Data balita berhasil disimpan"

3. Halaman Detail Balita
   - Info dasar: nama, usia (auto-hitung dari tgl lahir), JK, orang tua
   - Tombol "Catat Pengukuran Baru"
   - Grafik tumbuh kembang:
     * Line chart BB per waktu (garis biru)
     * Overlay garis standar WHO (merah putus-putus)
     * X-axis: tanggal kunjungan, Y-axis: BB dalam kg
   - Tabel riwayat pengukuran: tanggal, BB, TB, status gizi, kader, catatan
   - Section Imunisasi: tabel vaksin sudah diberikan + yang belum/mendatang

4. Form Pengukuran Baru
   - Field: Tanggal Ukur*, BB (kg)*, TB (cm)*, Lingkar Kepala (cm), Catatan
   - Real-time preview status gizi saat BB & TB diisi
   - Validasi: BB dan TB harus angka positif, masuk akal
```

### Fase E — Laporan & Export

```
Tugas: Bangun fitur generate laporan bulanan.

Backend:
- POST /api/laporan/generate
  Body: { periode: "2025-01" }
  Proses:
    1. Query semua pengukuran di bulan tersebut
    2. Kalkulasi: total balita, distribusi status gizi, total ibu hamil,
       jumlah imunisasi per jenis vaksin
    3. Simpan hasil ke tabel laporan
    4. Return: { id_laporan, ringkasan_data }

- GET /api/laporan/:id/pdf
  Generate PDF dengan layout:
  - Header: Logo SIPosyandu + Nama Posyandu + Periode Laporan
  - Tabel 1: Rekapitulasi Balita (nama, tgl lahir, BB, TB, status gizi)
  - Tabel 2: Distribusi Status Gizi + persentase
  - Tabel 3: Rekapitulasi Imunisasi per jenis vaksin
  - Footer: kolom tanda tangan Ketua Posyandu & Petugas Puskesmas
  Response: stream file PDF

- GET /api/laporan/:id/excel
  Sheet 1: "Rekap Balita"
  Sheet 2: "Rekap Ibu Hamil"
  Sheet 3: "Rekap Imunisasi"
  Response: stream file .xlsx

Frontend:
- Halaman Laporan:
  - Pilih bulan dan tahun (month picker)
  - Tombol "Generate Laporan"
  - Loading state saat generate (bisa 2-3 detik)
  - Preview ringkasan: card angka gizi baik/kurang/buruk + total balita
  - Tombol Download PDF (disabled sebelum generate)
  - Tombol Download Excel (disabled sebelum generate)
  - History laporan: list laporan bulan sebelumnya dengan tombol re-download
```

### Fase F — Polish & Testing

```
Tugas akhir: Polish UI, error handling, dan optimasi.

1. Cek responsif di semua breakpoint:
   - 375px (HP kecil)
   - 768px (tablet/iPad)
   - 1280px (laptop)
   Pastikan tidak ada overflow, tombol terjangkau jempol di HP

2. Lengkapi semua state:
   - Empty state: setiap halaman list kosong tampil ilustrasi + teks panduan
   - Error state: jika fetch gagal, tampil pesan + tombol "Coba Lagi"
   - Loading state: skeleton di semua komponen yang fetch data

3. Validasi keamanan:
   - Semua endpoint protected wajib ada authMiddleware
   - Validasi input di backend (express-validator atau zod)
   - Sanitasi input sebelum query database
   - Rate limiting di endpoint /api/auth/login (max 5x per menit per IP)

4. Accessibility dasar:
   - Semua input punya <label> yang terhubung dengan htmlFor
   - Semua tombol punya teks yang deskriptif (bukan hanya ikon)
   - Focus visible di semua elemen interaktif

5. Performance:
   - Lazy load setiap halaman dengan React.lazy + Suspense
   - Debounce semua input search (300ms)
   - Pagination di semua halaman list (jangan load semua data sekaligus)

Laporan akhir: list semua perubahan yang dilakukan dan hasil pengujian.
```

---

## 4.3 Prompt untuk Debugging

Template saat ada bug:

```
Ada bug di SIPosyandu. Tolong analisis dan perbaiki.

Deskripsi bug:
[jelaskan apa yang terjadi]

Langkah reproduksi:
1. Login sebagai [role]
2. Buka halaman [nama halaman]
3. [aksi yang dilakukan]
4. Hasil aktual: [apa yang terjadi]
5. Hasil expected: [apa yang seharusnya terjadi]

Error message:
[paste error dari browser console atau terminal]

File yang kemungkinan terkait:
[nama file / komponen]

Konteks tambahan:
[info lain yang relevan]
```

---

## 4.4 Prompt untuk Code Review

```
Review kode berikut dari project SIPosyandu:

[paste kode di sini]

Konteks: Kode ini adalah [komponen/endpoint/fungsi] untuk [tujuan].
Pengguna akhirnya adalah kader Posyandu dengan kemampuan teknologi rendah.

Tolong review berdasarkan:
1. Kebenaran logika bisnis
2. Potensi security vulnerability
3. Kelengkapan error handling
4. Kemungkinan optimasi performa
5. Konsistensi dengan konvensi project
6. Edge case yang belum ditangani
7. Apakah UX sudah sesuai untuk pengguna non-teknis?

Berikan feedback spesifik dengan contoh perbaikan.
```

---

_Dokumen ini disusun berdasarkan:_  
_Laporan Kerja Praktek "Perancangan Antarmuka UI/UX Sistem Informasi Posyandu_  
_dengan Pendekatan Design Thinking di Kelurahan Nambo Ilir Kibin"_  
_Tasya Pirgina Imelda — Universitas Pamulang Kampus Serang, 2025_
