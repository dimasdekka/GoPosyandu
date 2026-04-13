import { Activity, Baby, Calendar, Syringe } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";

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
  return (
    <>
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
    </>
  );
}
