import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/components/layout/AppLayout";
import BalitaList from "@/pages/balita/BalitaList";
import BalitaDetail from "@/pages/balita/BalitaDetail";
import IbuHamilList from "@/pages/ibu-hamil/IbuHamilList";
import IbuHamilDetail from "@/pages/ibu-hamil/IbuHamilDetail";
import RemajaList from "@/pages/remaja/RemajaList";
import RemajaDetail from "@/pages/remaja/RemajaDetail";
import LansiaList from "@/pages/lansia/LansiaList";
import LansiaDetail from "@/pages/lansia/LansiaDetail";
import JadwalList from "@/pages/jadwal/JadwalList";
import LaporanPage from "@/pages/laporan/LaporanPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function LoginWrapper() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginWrapper />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/balita" element={<BalitaList />} />
          <Route path="/balita/:id" element={<BalitaDetail />} />
          <Route path="/ibu-hamil" element={<IbuHamilList />} />
          <Route path="/ibu-hamil/:id" element={<IbuHamilDetail />} />
          <Route path="/remaja" element={<RemajaList />} />
          <Route path="/remaja/:id" element={<RemajaDetail />} />
          <Route path="/lansia" element={<LansiaList />} />
          <Route path="/lansia/:id" element={<LansiaDetail />} />
          <Route path="/jadwal" element={<JadwalList />} />
          <Route path="/laporan" element={<LaporanPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
