# GoPosyandu 🏥

**GoPosyandu** adalah Sistem Informasi Posyandu modern yang dirancang untuk mempermudah pencatatan klinis, pemantauan kesehatan, dan pelaporan data posyandu secara real-time. Dibangun dengan fokus pada kemudahan penggunaan, keakuratan data, dan estetika premium.

---

## 🚀 Fitur Utama

- **Dashboard Integrasi**: Visualisasi data kesehatan balita, ibu hamil, remaja, dan lansia menggunakan grafik interaktif.
- **Modul Balita**: Pencatatan tumbuh kembang (BB/TB/LK) dengan perhitungan usia otomatis dalam bulan dan minggu.
- **Modul Ibu Hamil**: Pemantauan kehamilan, HPHT, usia kandungan, dan metrik klinis (TFU, DJJ).
- **Modul Lansia & Remaja**: Skrining Penyakit Tidak Menular (PTM), tensi, gula darah, dan kolesterol.
- **Standardisasi Klinis**: Layout hasil pemeriksaan yang seragam (BB/TB di bawah, metrik klinis di atas) di seluruh modul.
- **Data Seeding**: Database telah dilengkapi dengan 200+ data pasien "Rakyat Random" untuk keperluan simulasi dan demo.

---

## 🛠️ Tech Stack

### Backend
- **Core**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Token) & Bcrypt
- **Architecture**: Clean Architecture (Controller -> Service -> Repository)

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **UI Components**: Shadcn/UI (Radix UI)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: React Hook Form & Zod Validation

---

## 📦 Struktur Folder

```text
GoPosyandu/
├── backend/                # Server-side logic & API
│   ├── src/                # Source code (Clean Architecture)
│   ├── prisma/             # Schema & Database Migrations
│   └── scratch/            # Script testing & utilities
└── frontend/               # Client-side (Vite + React)
    ├── src/
    │   ├── components/     # UI & Reusable Components
    │   ├── pages/          # Page Views (Dashboard, List, Detail)
    │   └── store/          # Zustand State Management
    └── public/             # Static Assets
```

---

## ⚙️ Cara Menjalankan Project

### Prerequisites
- Node.js (v16+)
- MySQL / MariaDB

### 1. Setup Backend
```bash
cd backend
npm install
# Konfigurasi .env (DATABASE_URL)
npx prisma migrate dev
npx prisma db seed          # Untuk mengisi data dummy rakyat random
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

---

## 🤝 Kontribusi

Aplikasi ini dikembangkan dengan standar kode yang ketat:
- **Strict TypeScript**: Tidak ada `any` tanpa alasan jelas.
- **Error Handling**: Setiap error API dibungkus dengan context yang jelas.
- **UI/UX**: Mengutamakan estetika premium dan responsivitas.

---

Designed & Developed with ❤️ for Posyandu Indonesia.
