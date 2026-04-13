import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Rekapitulasi</h1>
        <p className="text-muted-foreground text-sm">Unduh laporan otomatis format PDF atau Excel ke Dinkes/Puskesmas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Register Kohort Balita</CardTitle>
            <CardDescription>Bulan April 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex bg-muted/30 p-3 rounded-lg justify-between items-center">
              <span className="text-sm font-medium">Format PDF</span>
              <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" />Unduh</Button>
            </div>
            <div className="flex bg-muted/30 p-3 rounded-lg justify-between items-center">
              <span className="text-sm font-medium text-emerald-600">Format Excel (XLSX)</span>
              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"><Download className="w-4 h-4 mr-2" />Unduh</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kohort Ibu Hamil</CardTitle>
            <CardDescription>Bulan April 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex bg-muted/30 p-3 rounded-lg justify-between items-center">
              <span className="text-sm font-medium">Format PDF</span>
              <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" />Unduh</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Statistik Cepat</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground leading-relaxed">Sistem dapat melakukan custom filter berdasar umur, area RW/RT, atau paramater lainnya saat backend siap.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
