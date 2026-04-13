import { Activity, Baby, Calendar, Users, TrendingUp, HeartPulse } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const getStatusGiziBadge = (status: string) => {
  switch (status) {
    case "Baik": return "bg-green-100 text-green-700 border-green-200";
    case "Kurang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Buruk": return "bg-red-100 text-red-700 border-red-200";
    case "Lebih": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function Dashboard() {
  const [balitaTerbaru, setBalitaTerbaru] = useState<any[]>([]);
  const [totalBalita, setTotalBalita] = useState(0);
  const [totalIbuHamil, setTotalIbuHamil] = useState(0);
  const [totalRemaja, setTotalRemaja] = useState(0);
  const [totalLansia, setTotalLansia] = useState(0);
  const [kegiatanMendatang, setKegiatanMendatang] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Grafik per-kategori peserta aktif
  const [grafikData, setGrafikData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingStats(true);
        const [resBalita, resIbuHamil, resRemaja, resLansia, resJadwal] = await Promise.allSettled([
          axios.get('/api/v1/balita'),
          axios.get('/api/v1/ibu-hamil'),
          axios.get('/api/v1/remaja'),
          axios.get('/api/v1/lansia'),
          axios.get('/api/v1/jadwal'),
        ]);

        const balitaList = resBalita.status === 'fulfilled' ? resBalita.value.data.data || [] : [];
        const ibuHamilList = resIbuHamil.status === 'fulfilled' ? resIbuHamil.value.data.data || [] : [];
        const remajaList = resRemaja.status === 'fulfilled' ? resRemaja.value.data.data || [] : [];
        const lansiaList = resLansia.status === 'fulfilled' ? resLansia.value.data.data || [] : [];
        const jadwalList = resJadwal.status === 'fulfilled' ? resJadwal.value.data.data || [] : [];

        setTotalBalita(balitaList.length);
        setTotalIbuHamil(ibuHamilList.length);
        setTotalRemaja(remajaList.length);
        setTotalLansia(lansiaList.length);
        setKegiatanMendatang(jadwalList.length);

        setGrafikData([
          { name: "Balita", total: balitaList.length, fill: "hsl(var(--primary))" },
          { name: "Ibu Hamil", total: ibuHamilList.length, fill: "hsl(var(--destructive))" },
          { name: "Remaja", total: remajaList.length, fill: "#f59e0b" },
          { name: "Lansia", total: lansiaList.length, fill: "#8b5cf6" },
        ]);

        // Balita terbaru dengan status gizi real dari pemeriksaan terakhir
        const mapped = balitaList.slice(0, 6).map((b: any) => {
          const tglLahir = new Date(b.tglLahir);
          const now = new Date();
          const bulan = (now.getFullYear() - tglLahir.getFullYear()) * 12 + (now.getMonth() - tglLahir.getMonth());
          const latestP = b.pemeriksaan?.[0] ?? null;
          return {
            id: b.id,
            nama: b.nama,
            usiaBulan: bulan >= 0 ? bulan : 0,
            bb: latestP?.bb ?? null,
            statusGizi: latestP?.statusGizi ?? "Belum Diukur",
          };
        });
        setBalitaTerbaru(mapped);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Kader</h1>
        <p className="text-muted-foreground">Selamat datang! Berikut ringkasan data Posyandu Anda.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balita</CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Baby className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loadingStats ? "…" : totalBalita}</div>
            <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ibu Hamil</CardTitle>
            <div className="p-2 bg-destructive/10 text-destructive rounded-lg"><HeartPulse className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loadingStats ? "…" : totalIbuHamil}</div>
            <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaja</CardTitle>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loadingStats ? "…" : totalRemaja}</div>
            <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lansia</CardTitle>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><Activity className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loadingStats ? "…" : totalLansia}</div>
            <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Distribusi Peserta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Distribusi Peserta Posyandu
            </CardTitle>
            <CardDescription>Jumlah peserta aktif berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {loadingStats ? (
              <div className="h-full bg-muted animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grafikData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [val, "Peserta"]}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={80}>
                    {grafikData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Ringkasan Kegiatan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Ringkasan
            </CardTitle>
            <CardDescription>Status kegiatan Posyandu</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Kegiatan Mendatang</span>
              <span className="font-bold text-lg">{kegiatanMendatang}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="text-sm text-muted-foreground">Total Peserta</span>
              <span className="font-bold text-lg text-primary">
                {loadingStats ? "…" : totalBalita + totalIbuHamil + totalRemaja + totalLansia}
              </span>
            </div>
            <div className="pt-2 border-t border-border/50 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Akses Cepat</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/balita" className="text-xs p-2 rounded-md bg-primary/10 text-primary font-medium text-center hover:bg-primary/20 transition-colors">Balita</Link>
                <Link to="/ibu-hamil" className="text-xs p-2 rounded-md bg-destructive/10 text-destructive font-medium text-center hover:bg-destructive/20 transition-colors">Bumil</Link>
                <Link to="/remaja" className="text-xs p-2 rounded-md bg-amber-50 text-amber-600 font-medium text-center hover:bg-amber-100 transition-colors">Remaja</Link>
                <Link to="/lansia" className="text-xs p-2 rounded-md bg-violet-50 text-violet-600 font-medium text-center hover:bg-violet-100 transition-colors">Lansia</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balita Terbaru */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Baby className="w-5 h-5 text-primary" />
            Balita Terdaftar Terbaru
          </CardTitle>
          <CardDescription>Status gizi berdasarkan pengukuran terakhir</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>BB Terakhir</TableHead>
                <TableHead>Status Gizi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingStats ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Memuat data...</TableCell>
                </TableRow>
              ) : balitaTerbaru.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Belum ada data balita. <Link to="/balita" className="text-primary underline">Tambah sekarang</Link></TableCell>
                </TableRow>
              ) : balitaTerbaru.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Link to={`/balita/${b.id}`} className="font-semibold hover:text-primary transition-colors">
                      {b.nama}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.usiaBulan} bln</TableCell>
                  <TableCell className="font-medium">{b.bb != null ? `${b.bb} kg` : "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`shadow-none text-xs border ${getStatusGiziBadge(b.statusGizi)}`}>
                      {b.statusGizi}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
