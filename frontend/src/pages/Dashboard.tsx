import { Activity, Baby, Calendar, Syringe, Users, Menu, LogOut, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody
} from "@/components/ui/table";

const mockGrafikData = [
  { name: "Jul", kunjungan: 45 },
  { name: "Ags", kunjungan: 52 },
  { name: "Sep", kunjungan: 48 },
  { name: "Okt", kunjungan: 60 },
  { name: "Nov", kunjungan: 55 },
  { name: "Des", kunjungan: 65 },
];

const mockBalitaTerbaru = [
  { id: 1, nama: "Budi Santoso", usia: "14 Bulan", bb: 9.2, status: "Baik" },
  { id: 2, nama: "Siti Aminah", usia: "8 Bulan", bb: 7.5, status: "Baik" },
  { id: 3, nama: "Rizky Firmansyah", usia: "24 Bulan", bb: 10.1, status: "Kurang" },
  { id: 4, nama: "Aisyah Putri", usia: "18 Bulan", bb: 11.0, status: "Baik" },
  { id: 5, nama: "Dimas Anggara", usia: "30 Bulan", bb: 12.5, status: "Baik" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <span className="font-Fraunces font-bold text-xl text-foreground">SIPosyandu</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <Baby className="w-5 h-5" />
            Data Balita
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            Ibu Hamil
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Jadwal
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" />
            Laporan
          </Link>
        </nav>
        <div className="p-4 border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 space-y-6 pb-24 md:pb-8">
        
        {/* Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-Fraunces font-bold text-lg">SIPosyandu</span>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Kader</h1>
          <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan bulan ini.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Balita Terdaftar</CardTitle>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Baby className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground mt-1">+4 bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kunjungan</CardTitle>
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65</div>
              <p className="text-xs text-muted-foreground mt-1">Bulan November</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Imunisasi</CardTitle>
              <div className="p-2 bg-warning/10 text-warning rounded-lg">
                <Syringe className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-warning mt-1 font-medium">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kegiatan</CardTitle>
              <div className="p-2 bg-muted rounded-lg text-foreground">
                <Calendar className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">Mendatang</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tren Kunjungan</CardTitle>
              <CardDescription>6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockGrafikData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="kunjungan" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Table Recent */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Balita Terupdate</CardTitle>
              <CardDescription>Data yang terakhir dimasukkan</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>BB (kg)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBalitaTerbaru.map((balita) => (
                    <TableRow key={balita.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{balita.nama}</span>
                          <span className="text-xs text-muted-foreground">{balita.usia}</span>
                        </div>
                      </TableCell>
                      <TableCell>{balita.bb}</TableCell>
                      <TableCell>
                        <Badge variant={balita.status === 'Baik' ? 'default' : 'destructive'} 
                          className={balita.status === 'Baik' ? 'bg-primary/20 text-primary hover:bg-primary/30 shadow-none' : 'shadow-none'}>
                          {balita.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-3 z-50">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Baby className="w-6 h-6" />
          <span className="text-[10px] font-medium">Balita</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Jadwal</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-destructive">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </div>

    </div>
  );
}
