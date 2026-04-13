
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, HeartPulse, Activity } from "lucide-react";

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

const MOCK_PROFILE = {
  id: 1,
  nama: "Siti Nurhaliza",
  tglLahir: "1998-04-12",
  suami: "Budi Santoso",
  hpht: "2025-11-08",
  hpl: "2026-08-15",
  usiaKandungan: 12, // minggu
  alamat: "Jl. Mawar No 12, RT 01/RW 02",
  statusRisiko: "Normal",
};

const MOCK_HISTORI = [
  {
    id: 1,
    tglKunjungan: "2026-01-10",
    usiaKandungan: 8,
    bb: 54,
    tensi: "110/70",
    keluhan: "Mual pagi hari",
    catatan: "Minum vitamin teratur",
    petugas: "Bidan Fitri",
  },
  {
    id: 2,
    tglKunjungan: "2026-02-14",
    usiaKandungan: 12,
    bb: 55,
    tensi: "110/80",
    keluhan: "Pusing kadang",
    catatan: "Istirahat cukup",
    petugas: "Kader Siti",
  },
];

export default function IbuHamilDetail() {
  const navigate = useNavigate();
  // Using MOCK data directly for now
  const profile = MOCK_PROFILE;
  const history = MOCK_HISTORI;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-primary/20 text-primary border-primary/20";
      case "Risiko Rendah":
        return "bg-warning/20 text-warning border-warning/20";
      case "Risiko Tinggi":
        return "bg-destructive/20 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/ibu-hamil")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.nama}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" /> HPL: <span className="font-semibold text-foreground">{profile.hpl}</span>
            </p>
          </div>
        </div>
        <Button className="hidden sm:flex">
          <Plus className="w-4 h-4 mr-2" />
          Kunjungan Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Box */}
        <Card className="md:col-span-1 border-border/60 shadow-sm flex flex-col">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Status Kehamilan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 relative flex-grow space-y-4">
            <div className="absolute top-6 right-6">
              <Badge variant="outline" className={getStatusBadge(profile.statusRisiko)}>
                {profile.statusRisiko}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Usia Kandungan</p>
              <p className="font-semibold text-lg text-primary">{profile.usiaKandungan} Minggu</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">HPHT</p>
                <p className="font-medium text-sm">{profile.hpht}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nama Suami</p>
                <p className="font-medium text-sm">{profile.suami}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Alamat</p>
              <p className="font-medium text-sm">{profile.alamat}</p>
            </div>
            
            <Button className="w-full mt-4 sm:hidden">
              <Plus className="w-4 h-4 mr-2" />
              Kunjungan Baru
            </Button>
          </CardContent>
        </Card>

        {/* Tabel Kunjungan */}
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartPulse className="w-5 h-5 mr-2 text-destructive" />
              Riwayat Kunjungan
            </CardTitle>
            <CardDescription>Catatan pemeriksaan ibu hamil pada setiap jadwal Posyandu.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">Tanggal</TableHead>
                    <TableHead>Usia/Minggu</TableHead>
                    <TableHead>Vitals</TableHead>
                    <TableHead className="min-w-[150px]">Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{record.tglKunjungan}</TableCell>
                      <TableCell>{record.usiaKandungan} Mgg</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-destructive">T: {record.tensi}</span>
                          <span className="text-muted-foreground">BB: {record.bb} kg</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-foreground">{record.keluhan || '-'}</span>
                          <span className="text-muted-foreground text-xs">{record.catatan}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        Belum ada riwayat kunjungan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
