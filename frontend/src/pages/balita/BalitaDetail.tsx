import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Activity, Baby, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock Data
const BALITA_DETAIL = {
  id: 1, 
  nama: "Budi Santoso", 
  tglLahir: "2023-01-15",
  usiaBulan: 14, 
  bbSaatIni: 9.2, 
  tbSaatIni: 75.5,
  statusGizi: "Gizi Baik", 
  jk: "Laki-laki", 
  ibu: "Ratna", 
  ayah: "Santoso",
  alamat: "Jl. Merdeka No. 45, Desa Suka Maju"
};

// Mock Line Chart Data (Weight per month)
// Including WHO Reference lines for Boys (Simplified mock data)
const GROWTH_DATA = [
  { bulan: 0, berat: 3.2, whoMin: 2.5, whoMax: 4.4 },
  { bulan: 2, berat: 5.1, whoMin: 4.3, whoMax: 7.1 },
  { bulan: 4, berat: 6.5, whoMin: 5.6, whoMax: 8.7 },
  { bulan: 6, berat: 7.4, whoMin: 6.4, whoMax: 9.8 },
  { bulan: 8, berat: 8.2, whoMin: 6.9, whoMax: 10.5 },
  { bulan: 10, berat: 8.8, whoMin: 7.4, whoMax: 11.2 },
  { bulan: 12, berat: 9.0, whoMin: 7.7, whoMax: 11.8 },
  { bulan: 14, berat: 9.2, whoMin: 8.0, whoMax: 12.3 },
];

const RIWAYAT_PENGUKURAN = [
  { id: 1, tgl: "2024-03-15", bulan: 14, bb: 9.2, tb: 75.5, keterangan: "Normal", kader: "Ibu Ani" },
  { id: 2, tgl: "2024-01-15", bulan: 12, bb: 9.0, tb: 73.0, keterangan: "Normal", kader: "Ibu Siti" },
  { id: 3, tgl: "2023-11-15", bulan: 10, bb: 8.8, tb: 70.0, keterangan: "Normal", kader: "Ibu Ani" },
];

export default function BalitaDetail() {
  const navigate = useNavigate();
  const [isAddPengukuranOpen, setIsAddPengukuranOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/balita")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{BALITA_DETAIL.nama}</h1>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 shadow-none font-medium">
                {BALITA_DETAIL.statusGizi}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <Baby className="w-3.5 h-3.5" />
              {BALITA_DETAIL.jk} • {BALITA_DETAIL.usiaBulan} Bulan
            </p>
          </div>
        </div>

        <Dialog open={isAddPengukuranOpen} onOpenChange={setIsAddPengukuranOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Input Pengukuran
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Input Data Pengukuran</DialogTitle>
              <DialogDescription>
                Masukkan data hasil pengukuran posyandu bulan ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tglb" className="text-right text-sm">Tgl</Label>
                <Input id="tglb" type="date" className="col-span-3" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bb" className="text-right text-sm">Berat (kg)</Label>
                <Input id="bb" type="number" step="0.1" className="col-span-3" placeholder="Contoh: 9.5" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tb" className="text-right text-sm">Tinggi (cm)</Label>
                <Input id="tb" type="number" step="0.1" className="col-span-3" placeholder="Contoh: 76.5" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" onClick={() => setIsAddPengukuranOpen(false)}>Batal</Button>
              <Button onClick={() => setIsAddPengukuranOpen(false)}>Simpan Data</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="md:col-span-1 border-border/60 shadow-sm">
          <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y divide-border/50 text-sm">
              <div className="flex justify-between p-4">
                <dt className="text-muted-foreground">Orang Tua</dt>
                <dd className="font-medium text-right">{BALITA_DETAIL.ayah} & {BALITA_DETAIL.ibu}</dd>
              </div>
              <div className="flex justify-between p-4">
                <dt className="text-muted-foreground">Tgl Lahir</dt>
                <dd className="font-medium flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  {BALITA_DETAIL.tglLahir}
                </dd>
              </div>
              <div className="flex justify-between p-4 bg-primary/5">
                <dt className="text-primary font-medium">B. Badan Terakhir</dt>
                <dd className="font-bold text-primary">{BALITA_DETAIL.bbSaatIni} kg</dd>
              </div>
              <div className="flex justify-between p-4 bg-primary/5 border-t-0">
                <dt className="text-primary font-medium">T. Badan Terakhir</dt>
                <dd className="font-bold text-primary">{BALITA_DETAIL.tbSaatIni} cm</dd>
              </div>
              <div className="p-4 space-y-2">
                <dt className="text-muted-foreground">Alamat</dt>
                <dd className="font-medium leading-relaxed">{BALITA_DETAIL.alamat}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Grafik CMS */}
        <Card className="md:col-span-2 border-border/60 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Grafik Tumbuh Kembang (Bayi {BALITA_DETAIL.jk})</CardTitle>
                <CardDescription>Berat Badan (kg) terhadap Usia (bulan) disandingkan dgn Pita Standar WHO</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="bulan" 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Bln ${val}`}
                  fontSize={12}
                  stroke="#888888"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#888888"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                {/* Pita WHO */}
                <Line type="monotone" dataKey="whoMax" name="Batas Atas WHO" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="whoMin" name="Batas Bawah WHO" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                
                {/* Pertumbuhan Aktual */}
                <Line type="monotone" dataKey="berat" name="Berat Anak (Aktual)" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 8, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            Riwayat Pengukuran & Tindakan
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Usia (Bulan)</TableHead>
                <TableHead>BB (kg)</TableHead>
                <TableHead>TB (cm)</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Kader Pencatat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RIWAYAT_PENGUKURAN.map((riwayat) => (
                <TableRow key={riwayat.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{riwayat.tgl}</TableCell>
                  <TableCell>{riwayat.bulan} Bulan</TableCell>
                  <TableCell className="font-bold text-primary">{riwayat.bb}</TableCell>
                  <TableCell>{riwayat.tb}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 shadow-none font-medium">
                      {riwayat.keterangan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">{riwayat.kader}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
