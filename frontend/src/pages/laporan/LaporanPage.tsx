import { useEffect, useState } from "react";
import { Download, FileText, FileSpreadsheet, Users, ChevronRight, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

export default function LaporanPage() {
  const [stats, setStats] = useState({
    balita: 0,
    ibuHamil: 0,
    remaja: 0,
    lansia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [blt, bml, rmj, lns] = await Promise.all([
          axios.get('/api/v1/balita'),
          axios.get('/api/v1/ibu-hamil'),
          axios.get('/api/v1/remaja'),
          axios.get('/api/v1/lansia'),
        ]);

        setStats({
          balita: blt.data.data?.length || 0,
          ibuHamil: bml.data.data?.length || 0,
          remaja: rmj.data.data?.length || 0,
          lansia: lns.data.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const downloadReport = (type: string, format: string) => {
    // In a real app, this would trigger a window.location or a specific blob download
    alert(`Mempersiapkan Laporan ${type} dalam format ${format}...\n(Fitur Export sedang dalam pengembangan backend)`);
  };

  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Pusat Laporan & Rekapitulasi</h1>
          <p className="text-muted-foreground text-sm">Unduh data kohort dan statistik kesehatan Posyandu bulan {currentMonth}.</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="secondary" className="px-3 py-1">Mode: Admin Puskesmas</Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Balita", count: stats.balita, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Ibu Hamil", count: stats.ibuHamil, color: "text-pink-600", bg: "bg-pink-50" },
          { label: "Remaja", count: stats.remaja, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Lansia", count: stats.lansia, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-4 pt-4 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{item.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${item.color}`}>{loading ? "..." : item.count}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Cards */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Register Kohort Balita</CardTitle>
                <CardDescription>Format standar buku SIP (Sistem Informasi Posyandu)</CardDescription>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-20" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileText className="w-5 h-5" /></div>
                    <div>
                        <p className="font-semibold text-sm">Dokumen Laporan PDF</p>
                        <p className="text-xs text-muted-foreground">Siap cetak untuk arsip fisik</p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => downloadReport("Balita", "PDF")} className="group-hover:translate-x-1 transition-transform">
                  <Download className="w-4 h-4 mr-2" /> Unduh
                </Button>
              </div>
              
              <div className="flex items-center justify-between group pt-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileSpreadsheet className="w-5 h-5" /></div>
                    <div>
                        <p className="font-semibold text-sm">Rekapitulasi Excel (XLSX)</p>
                        <p className="text-xs text-muted-foreground">Untuk pengolahan data lanjutan</p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => downloadReport("Balita", "EXCEL")} className="group-hover:translate-x-1 transition-transform">
                  <Download className="w-4 h-4 mr-2" /> Unduh
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Rekap Ibu Hamil & Lansia</CardTitle>
                <CardDescription>Laporan cakupan pelayanan dan deteksi dini</CardDescription>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <span className="text-sm font-medium underline underline-offset-4 decoration-pink-300">Kohort Ibu Hamil (PDF)</span>
                <Button size="sm" variant="outline" onClick={() => downloadReport("Ibu Hamil", "PDF")}>
                   Unduh Laporan
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium underline underline-offset-4 decoration-amber-300">Screening PTM Lansia (Excel)</span>
                <Button size="sm" variant="outline" onClick={() => downloadReport("Lansia", "EXCEL")}>
                   Unduh Laporan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Sneak Peek */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center p-8">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            <PieChartIcon className="w-16 h-16 text-primary mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Visualisasi Statistik</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              Analisis tren status gizi dan risiko penyakit akan muncul di sini secara otomatis. 
            </p>
            
            <Badge variant="outline" className="mt-6 font-mono text-[10px] tracking-tighter bg-background/50">
                MODULE_ANALYTICS: READY_TO_INTEGRATE
            </Badge>

            <div className="mt-auto w-full pt-10">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                    <span>Kelengkapan Data</span>
                    <span>75%</span>
                </div>
            </div>
        </Card>
      </div>

      <Card className="bg-muted/10 border-dashed border-2">
          <CardContent className="p-8 text-center space-y-3">
              <Users className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
              <h4 className="font-bold text-lg">Butuh format laporan khusus?</h4>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Anda dapat menghubungi administrator sistem untuk penyesuaian template laporan sesuai standar terbaru dari Kementerian Kesehatan atau Puskesmas setempat.
              </p>
              <Button variant="link" className="text-primary gap-2">
                Pelajari struktur data SIP <ChevronRight className="w-4 h-4" />
              </Button>
          </CardContent>
      </Card>
    </div>
  );
}
