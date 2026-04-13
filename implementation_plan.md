# Full Web Integration Plan — Final Phase

This implementation plan details the steps required to complete the remaining frontend application by connecting all "Detail" views to the existing NodeWave backend API. Replacing the static mock interfaces and graphs with real dynamic data.

## User Review Required

> [!IMPORTANT]  
> All detail interfaces currently use mock constant data arrays. The plan proposes replacing all of them with direct API calls (e.g. `axios.get('/api/v1/balita/:id')` and subsequent measurement submissions via `POST /api/v1/balita/:id/pemeriksaan`). 
> Are we proceeding forward with standard state variables (`useState`/`useEffect`), or would you prefer a global state tool for these complex details view? I will continue with standard `useState`/`useEffect` pattern matching our previous setup.

## Proposed Changes

We will refactor the four remaining pages sequentially:

### 1. Integration of Detail Balita
#### [MODIFY] [BalitaDetail.tsx](file:///c:/Users/Unicodes/Documents/Developments/GoPosyandu/frontend/src/pages/balita/BalitaDetail.tsx)
- Fetch `/api/v1/balita/:id` to retrieve details and history.
- Dynamic data replacement for basic info (Orang tua, Tgl Lahir, BB/TB Terakhir).
- Map "Riwayat Pengukuran" and format "GROWTH_DATA" for the Recharts graph.
- Setup `onSubmit` logic for the Input Pengukuran modal via `/api/v1/balita/:id/pemeriksaan`.

### 2. Integration of Detail Ibu Hamil
#### [MODIFY] [IbuHamilDetail.tsx](file:///c:/Users/Unicodes/Documents/Developments/GoPosyandu/frontend/src/pages/ibu-hamil/IbuHamilDetail.tsx)
- Setup robust `useEffect` for fetching details data `/api/v1/ibu-hamil/:id`.
- Connect mapping array for historical visits.
- Ensure the "Tambah Kunjungan" feature accurately triggers `/api/v1/ibu-hamil/:id/pemeriksaan`.

### 3. Integration of Detail Remaja
#### [MODIFY] [RemajaDetail.tsx](file:///c:/Users/Unicodes/Documents/Developments/GoPosyandu/frontend/src/pages/remaja/RemajaDetail.tsx)
- Replicate logic to fetch by ID using `/api/v1/remaja/:id`.
- Provide data visualization and history checks.
- Add POST form to submit measurements via `/api/v1/remaja/:id/pemeriksaan`.

### 4. Integration of Detail Lansia
#### [MODIFY] [LansiaDetail.tsx](file:///c:/Users/Unicodes/Documents/Developments/GoPosyandu/frontend/src/pages/lansia/LansiaDetail.tsx)
- Replicate logic to fetch by ID using `/api/v1/lansia/:id`.
- Tie in health statuses logic for Non-communicable diseases (PTM).
- Enable submissions of adult screenings using `/api/v1/lansia/:id/pemeriksaan`.

## Verification Plan

### Automated Tests
- Running `npm run build` after changes to check for generic TypeScript validation and component consistency.
- Validate JSON structures from endpoint maps.

### Manual Verification
- Testing user interaction flow: visiting lists -> entering details panel -> registering a new "Pengukuran" payload -> confirming that the UI/chart refreshes successfully with zero console/networking errors.
