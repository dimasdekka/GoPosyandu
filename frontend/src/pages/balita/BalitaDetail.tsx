import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Activity, Baby, Info, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { calculateAgePosyandu } from "@/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// WHO standard pseudo-lines for chart
const getWhoMin = (bulan: number) => 2.5 + (bulan * 0.4);
const getWhoMax = (bulan: number) => 4.4 + (bulan * 0.6);

const getStatusGiziBadge = (status: string) => {
  switch (status) {
    case "Baik": return "bg-green-100 text-green-700 border-green-200";
    case "Kurang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Buruk": return "bg-red-100 text-red-700 border-red-200";
    case "Lebih": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function BalitaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balita, setBalita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [lingkarKepala, setLingkarKepala] = useState("");
  const [statusGizi, setStatusGizi] = useState<"Baik" | "Kurang" | "Buruk" | "Lebih" | "">("");
  const [catatanTindakan, setCatatanTindakan] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/balita/${id}`);
      setBalita(res.data.data);
    } catch (error) {
      console.error("Gagal memuat data balita:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const resetForm = () => {
    setBb(""); setTb(""); setLingkarKepala("");
    setStatusGizi(""); setCatatanTindakan("");
    setSubmitError(""); setSubmitSuccess(false);
  };

  const onSubmitPengukuran = async () => {
    if (!bb || !statusGizi) {
      setSubmitError("Berat Badan dan Status Gizi wajib diisi.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const payload: any = {
        bb: parseFloat(bb),
        statusGizi,
      };
      if (parseFloat(tb) > 0) payload.tb = parseFloat(tb);
      if (parseFloat(lingkarKepala) > 0) payload.lingkarKepala = parseFloat(lingkarKepala);
      if (catatanTindakan.trim()) payload.catatanTindakan = catatanTindakan.trim();

      await axios.post(`/api/v1/balita/${id}/pemeriksaan`, payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
        fetchDetail();
      }, 1000);
    } catch (error: any) {
      const msg = error?.response?.data?.errors?.[0]?.message || "Gagal menyimpan data. Coba lagi.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="md:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!balita) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/balita")}><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
        <div className="flex items-center justify-center min-h-[50vh]"><p className="text-destructive">Data balita tidak ditemukan.</p></div>
      </div>
    );
  }

  const latestPemeriksaan = balita.pemeriksaan?.length > 0 ? balita.pemeriksaan[0] : null;
  const statusGiziTerakhir = latestPemeriksaan?.statusGizi ?? "Belum Diukur";

  const riwayatReversed = [...(balita.pemeriksaan || [])].reverse();
  const growthData = riwayatReversed.map((rekam: any, idx: number) => ({
    bulan: idx,
    berat: rekam.bb,
    whoMin: getWhoMin(idx).toFixed(1),
    whoMax: getWhoMax(idx).toFixed(1),
  }));

  // Hitung usia menggunakan utility khusus Posyandu
  const usiaTampil = calculateAgePosyandu(balita.tglLahir);

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
              <h1 className="text-3xl font-bold tracking-tight">{balita.nama}</h1>
              <Badge className={`shadow-none font-medium border ${getStatusGiziBadge(statusGiziTerakhir)}`}>
                {statusGiziTerakhir}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <Baby className="w-3.5 h-3.5" />
              {balita.jk === 'L' ? 'Laki-laki' : 'Perempuan'} • {usiaTampil}
            </p>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Catat Pengukuran Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Input Data Pengukuran Balita</DialogTitle>
              <DialogDescription>
                Masukkan hasil pengukuran posyandu. <span className="text-destructive">*</span> wajib diisi.
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-semibold text-lg">Data berhasil disimpan!</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {/* Berat Badan - wajib */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right text-sm font-medium">
                    Berat Badan (kg) <span className="text-destructive">*</span>
                  </Label>
                  <div className="col-span-2">
                    <Input type="number" step="0.1" placeholder="Contoh: 9.5" value={bb} onChange={e => setBb(e.target.value)} />
                  </div>
                </div>

                {/* Tinggi Badan - opsional */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right text-sm font-medium">Tinggi Badan (cm)</Label>
                  <div className="col-span-2">
                    <Input type="number" step="0.1" placeholder="Contoh: 76.5" value={tb} onChange={e => setTb(e.target.value)} />
                  </div>
                </div>

                {/* Lingkar Kepala - opsional */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right text-sm font-medium">Lingkar Kepala (cm)</Label>
                  <div className="col-span-2">
                    <Input type="number" step="0.1" placeholder="Contoh: 44.0" value={lingkarKepala} onChange={e => setLingkarKepala(e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">Untuk deteksi stunting/masalah perkembangan</p>
                  </div>
                </div>

                {/* Status Gizi - wajib, dropdown */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right text-sm font-medium">
                    Status Gizi <span className="text-destructive">*</span>
                  </Label>
                  <div className="col-span-2">
                    <Select value={statusGizi} onValueChange={(v) => setStatusGizi(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status gizi..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baik">✅ Baik</SelectItem>
                        <SelectItem value="Kurang">⚠️ Kurang</SelectItem>
                        <SelectItem value="Buruk">🔴 Buruk</SelectItem>
                        <SelectItem value="Lebih">🔵 Lebih (Obesitas)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Ditentukan berdasarkan plot KMS / Buku KIA</p>
                  </div>
                </div>

                {/* Catatan Tindakan - opsional */}
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label className="text-right text-sm font-medium pt-2">Catatan Tindakan</Label>
                  <div className="col-span-2">
                    <Textarea
                      placeholder="Contoh: Diberikan Vitamin A dosis tinggi, Obat cacing Albendazol 400mg, Imunisasi DPT-HB"
                      value={catatanTindakan}
                      onChange={e => setCatatanTindakan(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{submitError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Batal</Button>
                  <Button onClick={onSubmitPengukuran} disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan Data"}
                  </Button>
                </div>
              </div>
            )}
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
                <dt className="text-muted-foreground">Nama Ibu</dt>
                <dd className="font-medium text-right">{balita.ibu || "-"}</dd>
              </div>
              <div className="flex justify-between p-4">
                <dt className="text-muted-foreground">Nama Ayah</dt>
                <dd className="font-medium text-right">{balita.ayah || "-"}</dd>
              </div>
              <div className="flex justify-between p-4">
                <dt className="text-muted-foreground">Tgl Lahir</dt>
                <dd className="font-medium flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  {new Date(balita.tglLahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              <div className="flex justify-between p-4 bg-primary/5">
                <dt className="text-primary font-medium">BB Terakhir</dt>
                <dd className="font-bold text-primary">{latestPemeriksaan?.bb?.toFixed(1) ?? "-"} kg</dd>
              </div>
              <div className="flex justify-between p-4 bg-primary/5">
                <dt className="text-primary font-medium">TB Terakhir</dt>
                <dd className="font-bold text-primary">{latestPemeriksaan?.tb?.toFixed(1) ?? "-"} cm</dd>
              </div>
              <div className="flex justify-between p-4 bg-primary/5">
                <dt className="text-primary font-medium">Lingkar Kepala</dt>
                <dd className="font-bold text-primary">{latestPemeriksaan?.lingkarKepala?.toFixed(1) ?? "-"} cm</dd>
              </div>
              <div className="p-4 space-y-1">
                <dt className="text-muted-foreground">Alamat</dt>
                <dd className="font-medium leading-relaxed">{balita.alamat || "-"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Grafik Tumbuh Kembang */}
        <Card className="md:col-span-2 border-border/60 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Grafik Tumbuh Kembang</CardTitle>
            <CardDescription>Berat Badan (kg) vs. Standar WHO</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pt-4">
            {growthData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Belum ada data pengukuran untuk ditampilkan.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickFormatter={(val) => `K${val + 1}`} fontSize={12} stroke="#888888" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#888888" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="whoMax" name="Batas Atas WHO" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="whoMin" name="Batas Bawah WHO" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="berat" name="Berat Anak" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Pengukuran */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            Riwayat Pengukuran & Tindakan
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>BB (kg)</TableHead>
                <TableHead>TB (cm)</TableHead>
                <TableHead>Lingkar Kepala</TableHead>
                <TableHead>Status Gizi</TableHead>
                <TableHead>Catatan Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balita.pemeriksaan?.length > 0 ? (
                balita.pemeriksaan.map((r: any) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {new Date(r.tglUkur || r.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-medium">{r.bb != null ? `${Number(r.bb).toFixed(1)} kg` : "-"}</TableCell>
                    <TableCell>{r.tb?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell>{r.lingkarKepala ? `${r.lingkarKepala.toFixed(1)} cm` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`shadow-none font-medium border ${getStatusGiziBadge(r.statusGizi)}`}>
                        {r.statusGizi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {r.catatanTindakan || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Belum ada riwayat pengukuran. Klik "Catat Pengukuran Baru" untuk memulai.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
