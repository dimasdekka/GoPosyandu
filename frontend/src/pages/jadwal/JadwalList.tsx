import { Calendar as CalendarIcon, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JADWAL_MOCK = [
  { id: 1, tanggal: "Senin, 15 April 2026", waktu: "08:00 - 11:00 WIB", tema: "Posyandu Balita & Imunisasi Dasar", lokasi: "Balai Warga Nambo Ilir", status: "Akan Datang" },
  { id: 2, tanggal: "Rabu, 17 April 2026", waktu: "09:00 - 12:00 WIB", tema: "Posyandu Lansia & Pemeriksaan PTM", lokasi: "Balai Desa Kibin", status: "Akan Datang" },
];

export default function JadwalList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Kegiatan</h1>
          <p className="text-muted-foreground text-sm">Kelola agenda rutin Posyandu di wilayah Anda.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Buat Jadwal Baru</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {JADWAL_MOCK.map((jadwal) => (
          <Card key={jadwal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{jadwal.status}</Badge>
              </div>
              <CardTitle className="text-lg mt-2">{jadwal.tema}</CardTitle>
              <CardDescription className="flex items-center mt-2 text-foreground font-medium">
                <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                {jadwal.tanggal}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Waktu: {jadwal.waktu}</p>
                <p className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  {jadwal.lokasi}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
