import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/components/layout/AppLayout";
import BalitaList from "@/pages/balita/BalitaList";
import BalitaDetail from "@/pages/balita/BalitaDetail";
import IbuHamilList from "@/pages/ibu-hamil/IbuHamilList";
import IbuHamilDetail from "@/pages/ibu-hamil/IbuHamilDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/balita" element={<BalitaList />} />
        <Route path="/balita/:id" element={<BalitaDetail />} />
        <Route path="/ibu-hamil" element={<IbuHamilList />} />
        <Route path="/ibu-hamil/:id" element={<IbuHamilDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
