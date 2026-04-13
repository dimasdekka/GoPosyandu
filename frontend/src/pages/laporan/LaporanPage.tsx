import { useEffect, useState } from "react";
import { Download, FileText, FileSpreadsheet, Users, ChevronRight, BarChart as BarChartIcon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

interface LaporanStats {
  summary: {
    balita: number;
    ibuHamil: number;
    remaja: number;
    lansia: number;
  };
  distributions: {
    balita: { label: string; value: number }[];
    ibuHamil: { label: string; value: number }[];
    lansia: { label: string; value: number }[];
    remaja: { label: string; value: number }[];
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function LaporanPage() {
  const [stats, setStats] = useState<LaporanStats>({
    summary: { balita: 0, ibuHamil: 0, remaja: 0, lansia: 0 },
    distributions: { balita: [], ibuHamil: [], lansia: [], remaja: [] }
  });
  const [activePrintCategory, setActivePrintCategory] = useState<string>("semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/laporan/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (category: string, format: string) => {
    if (format === 'PDF') {
      const cat = category.toLowerCase().replace(" ", "-");
      setActivePrintCategory(cat);
      
      // Delay to allow UI update before print
      setTimeout(() => {
        window.print();
        // Return to default after dialog closes
        setTimeout(() => setActivePrintCategory("semua"), 500);
      }, 150);
      return;
    }

    try {
      const endpointMap: Record<string, string> = {
        "Balita": "balita",
        "Ibu Hamil": "ibu-hamil",
        "Lansia": "lansia",
        "Remaja": "remaja"
      };

      const res = await axios.get(`/api/v1/laporan/export/${endpointMap[category]}`);
      const rawData = res.data.data;
      
      if (!rawData || rawData.length === 0) {
        alert("Tidak ada data untuk diunduh");
        return;
      }

      // Simple CSV Generation
      const headers = Object.keys(rawData[0]).filter(k => typeof rawData[0][k] !== 'object').join(",");
      const rows = rawData.map((obj: any) => {
        return Object.keys(obj)
          .filter(k => typeof obj[k] !== 'object')
          .map(k => {
             const val = obj[k];
             return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
          })
          .join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Laporan_${category}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Export failed:", error);
      alert("Gagal mengunduh laporan");
    }
  };

  const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#10b981'];

  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Print-Only Header (KOP SURAT) */}
      <div className="hidden print:flex flex-col items-center text-center space-y-2 border-b-2 border-double border-black pb-4 mb-8">
          <div className="flex items-center gap-4">
              <Activity className="w-12 h-12 text-blue-600" />
              <div>
                  <h1 className="text-xl font-bold uppercase">Sistem Informasi Posyandu (SIPosyandu)</h1>
                  <p className="text-sm font-medium italic">Kelurahan Nambo, Kecamatan Gajah Mada, Kota Administrasi</p>
              </div>
          </div>
          <div className="w-full h-0.5 bg-black mt-1" />
          <h2 className="text-lg font-bold underline mt-4">
            LAPORAN REKAPITULASI {activePrintCategory !== "semua" ? activePrintCategory.toUpperCase().replace("-", " ") : "KESEHATAN"} BULANAN
          </h2>
          <p className="text-sm uppercase font-semibold">Periode: {currentMonth}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Laporan & Analitik</h1>
          <p className="text-muted-foreground text-sm">Unduh rekapitulasi data kohort dan statistik kesehatan Posyandu bulan {currentMonth}.</p>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadReport("semua", "PDF")} className="hidden md:flex">
                <FileText className="w-4 h-4 mr-2" /> Rekap Semua (PDF)
            </Button>
            <Button variant="default" size="sm" onClick={() => downloadReport("semua", "EXCEL")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Download Semua (.xlsx)
            </Button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        {[
          { label: "Balita", count: stats.summary.balita, color: "text-blue-600", border: "border-blue-100", icon: Activity },
          { label: "Ibu Hamil", count: stats.summary.ibuHamil, color: "text-pink-600", border: "border-pink-100", icon: Users },
          { label: "Remaja", count: stats.summary.remaja, color: "text-purple-600", border: "border-purple-100", icon: Users },
          { label: "Lansia", count: stats.summary.lansia, color: "text-amber-600", border: "border-amber-100", icon: Activity },
        ].map((item, idx) => (
          <Card key={idx} className={`border ${item.border} shadow-none bg-card/50`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <h3 className={`text-2xl font-bold ${item.color}`}>{loading ? "..." : item.count}</h3>
              </div>
              <item.icon className={`w-8 h-8 ${item.color.replace('text-', 'text-')}/20 opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formal Data Tables (Only Visible on Print) */}
      <div className="hidden print:block space-y-10">
          <section>
              <h3 className="text-md font-bold uppercase mb-4 border-b border-black">I. Ringkasan Data Sasaran</h3>
              <table className="w-full border-collapse border border-black text-sm">
                  <thead>
                      <tr className="bg-gray-100 text-black">
                          <th className="border border-black p-2 text-left">Kategori Sasaran</th>
                          <th className="border border-black p-2 text-center">Jumlah Terdaftar</th>
                          <th className="border border-black p-2 text-left">Keterangan Wilayah</th>
                      </tr>
                  </thead>
                  <tbody>
                      {(activePrintCategory === "semua" || activePrintCategory === "balita") && <tr><td className="border border-black p-2">Anak & Balita</td><td className="border border-black p-2 text-center">{stats.summary.balita}</td><td className="border border-black p-2">RW 01 - RW 05</td></tr>}
                      {(activePrintCategory === "semua" || activePrintCategory === "ibu-hamil") && <tr><td className="border border-black p-2">Ibu Hamil / Menyusui</td><td className="border border-black p-2 text-center">{stats.summary.ibuHamil}</td><td className="border border-black p-2">Terintegrasi Bidan Desa</td></tr>}
                      {(activePrintCategory === "semua" || activePrintCategory === "remaja") && <tr><td className="border border-black p-2">Remaja (L/P)</td><td className="border border-black p-2 text-center">{stats.summary.remaja}</td><td className="border border-black p-2">Sasaran Posyandu Remaja</td></tr>}
                      {(activePrintCategory === "semua" || activePrintCategory === "lansia") && <tr><td className="border border-black p-2">Lansia</td><td className="border border-black p-2 text-center">{stats.summary.lansia}</td><td className="border border-black p-2">Program PJ PTM</td></tr>}
                  </tbody>
              </table>
          </section>

          <section>
              <h3 className="text-md font-bold uppercase mb-4 border-b border-black">II. Detail Distribusi Kesehatan</h3>
              <div className="space-y-6">
                  {/* Balita Table */}
                  {(activePrintCategory === "semua" || activePrintCategory === "balita") && (
                  <div>
                      <h4 className="text-sm font-bold mb-2">2.1 Sebaran Gizi Balita</h4>
                      <table className="w-full border-collapse border border-black text-[12px]">
                          <thead><tr><th className="border border-black p-1">Status Gizi</th><th className="border border-black p-1">Jumlah Balita</th><th className="border border-black p-1">Persentase</th><th className="border border-black p-1">Tindak Lanjut</th></tr></thead>
                          <tbody>
                              {stats.distributions.balita.map((d, i) => (
                                  <tr key={i}>
                                      <td className="border border-black p-1">{d.label}</td>
                                      <td className="border border-black p-1 text-center">{d.value}</td>
                                      <td className="border border-black p-1 text-center">{((d.value/stats.summary.balita)*100).toFixed(1)}%</td>
                                      <td className="border border-black p-1">{d.label.includes('Kurang') || d.label.includes('Buruk') ? 'Rujukan Puskesmas & PMT' : 'Edukasi Gizi Rutin'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  )}

                  {/* Bumil Table */}
                  {(activePrintCategory === "semua" || activePrintCategory === "ibu-hamil") && (
                  <div>
                      <h4 className="text-sm font-bold mb-2">2.2 Analisis Risiko Ibu Hamil</h4>
                      <table className="w-full border-collapse border border-black text-[12px]">
                          <thead><tr><th className="border border-black p-1">Kategori Risiko</th><th className="border border-black p-1">Jumlah Pasien</th><th className="border border-black p-1">Tindak Lanjut</th></tr></thead>
                          <tbody>
                              {stats.distributions.ibuHamil.map((d, i) => (
                                  <tr key={i}>
                                      <td className="border border-black p-1">{d.label}</td>
                                      <td className="border border-black p-1 text-center">{d.value}</td>
                                      <td className="border border-black p-1">{d.label.includes('Tinggi') ? 'Rujukan Puskesmas' : 'Pemantauan Kader'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  )}

                  {/* Remaja Table */}
                  {(activePrintCategory === "semua" || activePrintCategory === "remaja") && (
                  <div>
                      <h4 className="text-sm font-bold mb-2">2.3 Sebaran Gizi & Risiko Remaja</h4>
                      <table className="w-full border-collapse border border-black text-[12px]">
                          <thead><tr><th className="border border-black p-1">Status / Kondisi</th><th className="border border-black p-1">Jumlah Remaja</th><th className="border border-black p-1">Persentase</th><th className="border border-black p-1">Tindak Lanjut</th></tr></thead>
                          <tbody>
                              {stats.distributions.remaja.map((d, i) => (
                                  <tr key={i}>
                                      <td className="border border-black p-1">{d.label}</td>
                                      <td className="border border-black p-1 text-center">{d.value}</td>
                                      <td className="border border-black p-1 text-center">{((d.value/stats.summary.remaja)*100).toFixed(1)}%</td>
                                      <td className="border border-black p-1">{d.label.includes('Anemia') || d.label.includes('KEK') ? 'Pemberian TTD / Konsultasi' : 'Edukasi Kesehatan Remaja'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  )}

                  {/* Lansia Table */}
                  {(activePrintCategory === "semua" || activePrintCategory === "lansia") && (
                  <div>
                      <h4 className="text-sm font-bold mb-2">2.4 Skrining Risiko PTM Lansia</h4>
                      <table className="w-full border-collapse border border-black text-[12px]">
                          <thead><tr><th className="border border-black p-1">Kategori Risiko PTM</th><th className="border border-black p-1">Jumlah Lansia</th><th className="border border-black p-1">Tindak Lanjut</th></tr></thead>
                          <tbody>
                              {stats.distributions.lansia.map((d, i) => (
                                  <tr key={i}>
                                      <td className="border border-black p-1">{d.label}</td>
                                      <td className="border border-black p-1 text-center">{d.value}</td>
                                      <td className="border border-black p-1">{d.label.includes('Tinggi') ? 'Rujukan dr. Puskesmas' : 'Edukasi Pola Hidup'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  )}
              </div>
          </section>

          <section className="page-break-before">
              <h3 className="text-md font-bold uppercase mb-4 border-b border-black">III. Kesimpulan & Rekomendasi</h3>
              <div className="border border-black p-4 min-h-[150px] space-y-2 italic text-sm">
                  <p>Berdasarkan data di atas, dapat disimpulkan bahwa:</p>
                  <ul className="list-disc ml-6 space-y-1">
                      <li>Total data sasaran bulan ini adalah {stats.summary.balita + stats.summary.ibuHamil + stats.summary.remaja + stats.summary.lansia} orang.</li>
                      <li>Perlu perhatian khusus pada kategori {stats.distributions.balita.find(b => b.label.includes('Kurang') || b.label.includes('Buruk')) ? 'Gizi Kurang/Buruk Balita' : 'Pemantauan Risiko Ibu Hamil'}.</li>
                      <li>Program edukasi remaja dan lansia berjalan sesuai jadwal bulanan.</li>
                  </ul>
              </div>
          </section>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        
        {/* Balita Card */}
        {(activePrintCategory === "semua" || activePrintCategory === "balita") && (
        <Card className="shadow-sm border-border/60 flex flex-col print:border-none print:shadow-none print:mb-12">
            <CardHeader className="pb-2 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between space-y-0 print:bg-white print:px-0">
                <div>
                    <CardTitle className="text-md flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" /> Balita & Bayi
                    </CardTitle>
                    <CardDescription className="text-[11px]">Sebaran status gizi pengukuran terakhir</CardDescription>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Balita", "PDF")}>
                        <FileText className="w-3 h-3 mr-1 text-red-500" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Balita", "EXCEL")}>
                        <FileSpreadsheet className="w-3 h-3 mr-1 text-emerald-500" /> EXCEL
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 print:px-0">
                <div className="h-[200px] w-full">
                    {!loading && stats.distributions.balita.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.distributions.balita}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {stats.distributions.balita.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">Data belum tersedia</div>
                    )}
                </div>
            </CardContent>
        </Card>
        )}

        {/* Remaja Card */}
        {(activePrintCategory === "semua" || activePrintCategory === "remaja") && (
        <Card className="shadow-sm border-border/60 flex flex-col print:border-none print:shadow-none print:mb-12">
            <CardHeader className="pb-2 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between space-y-0 print:bg-white print:px-0">
                <div>
                    <CardTitle className="text-md flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" /> Remaja
                    </CardTitle>
                    <CardDescription className="text-[11px]">Risiko kesehatan & status gizi remaja</CardDescription>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Remaja", "PDF")}>
                        <FileText className="w-3 h-3 mr-1 text-red-500" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Remaja", "EXCEL")}>
                        <FileSpreadsheet className="w-3 h-3 mr-1 text-emerald-500" /> EXCEL
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 print:px-0">
                <div className="h-[200px] w-full">
                    {!loading && stats.distributions.remaja.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.distributions.remaja}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">Data belum tersedia</div>
                    )}
                </div>
            </CardContent>
        </Card>
        )}

        {/* Ibu Hamil Card */}
        {(activePrintCategory === "semua" || activePrintCategory === "ibu-hamil") && (
        <Card className="shadow-sm border-border/60 flex flex-col print:border-none print:shadow-none print:mb-12">
            <CardHeader className="pb-2 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between space-y-0 print:bg-white print:px-0">
                <div>
                    <CardTitle className="text-md flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" /> Ibu Hamil
                    </CardTitle>
                    <CardDescription className="text-[11px]">Deteksi risiko tinggi kehamilan</CardDescription>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Ibu Hamil", "PDF")}>
                        <FileText className="w-3 h-3 mr-1 text-red-500" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Ibu Hamil", "EXCEL")}>
                        <FileSpreadsheet className="w-3 h-3 mr-1 text-emerald-500" /> EXCEL
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 print:px-0">
                <div className="h-[200px] w-full">
                    {!loading && stats.distributions.ibuHamil.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.distributions.ibuHamil}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="label"
                                >
                                    {stats.distributions.ibuHamil.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">Data belum tersedia</div>
                    )}
                </div>
            </CardContent>
        </Card>
        )}

        {/* Lansia Card */}
        {(activePrintCategory === "semua" || activePrintCategory === "lansia") && (
        <Card className="shadow-sm border-border/60 flex flex-col print:border-none print:shadow-none print:mb-12">
            <CardHeader className="pb-2 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between space-y-0 print:bg-white print:px-0">
                <div>
                    <CardTitle className="text-md flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-600" /> Lansia
                    </CardTitle>
                    <CardDescription className="text-[11px]">Skrining Risiko Penyakit Tidak Menular (PTM)</CardDescription>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Lansia", "PDF")}>
                        <FileText className="w-3 h-3 mr-1 text-red-500" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold" onClick={() => downloadReport("Lansia", "EXCEL")}>
                        <FileSpreadsheet className="w-3 h-3 mr-1 text-emerald-500" /> EXCEL
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 print:px-0">
                <div className="h-[200px] w-full">
                    {!loading && stats.distributions.lansia.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.distributions.lansia} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="label" type="category" fontSize={9} width={80} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {stats.distributions.lansia.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">Data belum tersedia</div>
                    )}
                </div>
            </CardContent>
        </Card>
        )}

      </div>



      {/* Print-Only Professional Footer */}
      <div className="hidden print:block mt-12 pt-8 border-t">
          <div className="flex justify-between">
              <div className="text-sm">
                  <p>Mengetahui,</p>
                  <p className="mt-16 font-semibold underline underline-offset-4">( ..................................... )</p>
                  <p className="text-xs">Ketua Kader Posyandu</p>
              </div>
              <div className="text-sm text-right">
                  <p>Bogor, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="mt-16 font-semibold underline underline-offset-4">( ..................................... )</p>
                  <p className="text-xs">Penanggung Jawab Data SIP</p>
              </div>
          </div>
          <div className="mt-8 text-[10px] text-center text-gray-400 italic">
              Dokumen ini dihasilkan secara otomatis oleh SIPosyandu pada {new Date().toLocaleString('id-ID')}
          </div>
      </div>
    </div>
  );
}
