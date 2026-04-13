# SIPosyandu Frontend Implementation Plan

Berdasarkan PRD yang diberikan dalam `docs.md` dan permintaan untuk menyelesaikan sisi frontend terlebih dahulu menggunakan React, berikut adalah rencana implementasinya yang sesuai dengan **Clean Code** dan **Programming Principles**.

## User Review Required

> [!IMPORTANT]
> **Tech Stack Discrepancy Alert**
> Global rule Anda mensyaratkan penggunaan **Next.js 14 App Router EXCLUSIVELY**. Namun, instruksi prompt dan PRD Anda secara eksplisit meminta penggunaan **React dan Express** (yang mengarah ke arsitektur SPA dengan React + Vite).
> 
> *Rencana ini dibuat menggunakan **React + Vite** sesuai dengan instruksi spesifik terakhir Anda (PRD). Mohon persetujuannya untuk memastikan Anda memang memvalidasi penggunaan React + Vite alih-alih Next.js.*

## Proposed Architecture (Frontend)

Struktur direktori akan mengikuti Clean Architecture yang difokuskan pada modularitas dan reusability:

```text
/frontend
  /src
    /components   -- komponen reusable (Button, Card, Modal, UI System)
    /pages        -- halaman domain (Login, Dashboard, Balita, Laporan)
    /hooks        -- custom hooks untuk reusability logic
    /services     -- lapisan data (axios instance, endpoint routers)
    /utils        -- helper functions
    /types        -- TypeScript types & interfaces
    /store        -- Zustand untuk state global
```

## Tahapan Implementasi (Phase 1 Frontend)

1. **Setup Project Dasar**
   - Menjalankan `npx create-vite@latest frontend --template react-ts`
   - Setup Tailwind CSS
   - Konfigurasi module resolution (alias `@/`)

2. **Integrasi Design System & UI Library**
   - Inisialisasi **shadcn/ui** untuk mempercepat development komponen dasar.
   - Konfigurasi warna primer (`#0d8a4f`), sekunder, danger, warning sesuai dokumentasi PRD.
   - Setup font "Plus Jakarta Sans".

3. **Manajemen Navigasi dan State**
   - Instalasi `react-router-dom` untuk routing (Login, Dashboard, Data Balita, dll).
   - Setup `zustand` untuk authentication / session state.
   - Setup `react-query` untuk menangani API caching.

4. **Pembuatan Skeleton Halaman & Mocking UI**
   - Mocking halaman-halaman awal tanpa API nyata (menggunakan hardcoded dummy data dari PRD).
   - Pembuatan UI Halaman Login dan Dashboard Kader/Admin yang mobile-responsive pertama.

## Konfirmasi / Open Questions

> [!WARNING]
> Sebelum eksekusi, adakah requirement di mana frontend harus langsung dihubungkan ke backend Express (dan butuh saya buat Express saat ini juga), atau kita buat mock UI lengkap murni frontend untuk prototype terlebih dahulu?

Silakan setujui proposal ini, dan jika setuju, saya akan memberikan instruksi untuk melakukan otomatisasi pembuatan Pull Request / GH Issue sesuai standar sistem.
