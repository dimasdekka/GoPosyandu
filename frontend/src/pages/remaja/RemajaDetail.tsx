import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Activity, User, CheckCircle2 } from "lucide-react";
import axios from "axios";

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Normal": return "bg-green-100 text-green-700 border-green-200";
    case "Kurang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Lebih": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Anemia": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function RemajaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [tensiSistolik, setTensiSistolik] = useState("");
  const [tensiDiastolik, setTensiDiastolik] = useState("");
  const [lingkarPerut, setLingkarPerut] = useState("");
  const [kadarHb, setKadarHb] = useState("");
  const [statusGizi, setStatusGizi] = useState<"Normal" | "Kurang" | "Lebih" | "Anemia" | "">("");
  const [catatanEdukasi, setCatatanEdukasi] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/remaja/${id}`);
      setProfile(res.data.data);
    } catch (error) {
      console.error("Gagal memuat data remaja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchDetail(); }, [id]);

  const resetForm = () => {
    setBb(""); setTb(""); setTensiSistolik(""); setTensiDiastolik("");
    setLingkarPerut(""); setKadarHb(""); setStatusGizi(""); setCatatanEdukasi("");
    setSubmitError(""); setSubmitSuccess(false);
  };

  const onSubmitPemeriksaan = async () => {
    if (!statusGizi) {
      setSubmitError("Status Gizi wajib dipilih.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const payload: any = { statusGizi };
      if (parseFloat(bb) > 0) payload.bb = parseFloat(bb);
      if (parseFloat(tb) > 0) payload.tb = parseFloat(tb);
      if (parseInt(tensiSistolik) > 0) payload.tensiSistolik = parseInt(tensiSistolik);
      if (parseInt(tensiDiastolik) > 0) payload.tensiDiastolik = parseInt(tensiDiastolik);
      if (parseFloat(lingkarPerut) > 0) payload.lingkarPerut = parseFloat(lingkarPerut);
      if (parseFloat(kadarHb) > 0) payload.kadarHb = parseFloat(kadarHb);
      if (catatanEdukasi.trim()) payload.catatanEdukasi = catatanEdukasi.trim();

      await axios.post(`/api/v1/remaja/${id}/pemeriksaan`, payload);
      setSubmitSuccess(true);
      setTimeout(() => { setIsModalOpen(false); resetForm(); fetchDetail(); }, 1000);
    } catch (error: any) {
      const msg = error?.response?.data?.errors?.[0]?.message || "Gagal menyimpan. Coba lagi.";
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

  if (!profile) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/remaja")}><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
        <div className="flex items-center justify-center min-h-[50vh]"><p className="text-destructive">Data Remaja tidak ditemukan.</p></div>
      </div>
    );
  }

  const latestP = profile.pemeriksaan?.length > 0 ? profile.pemeriksaan[0] : null;
  const currentStatus = latestP?.statusGizi ?? "Belum Dievaluasi";

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/remaja")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.nama}</h1>
              <Badge variant="outline" className={`border ${getStatusBadge(currentStatus)}`}>{currentStatus}</Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <User className="w-3 h-3" /> {profile.umur} Tahun
            </p>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Pemeriksaan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Input Pemeriksaan Kesehatan Remaja</DialogTitle>
              <DialogDescription>
                Catat hasil pemeriksaan gizi dan kesehatan. <span className="text-destructive">*</span> wajib diisi.
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-semibold text-lg">Data berhasil disimpan!</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Antropometri</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Berat Badan (kg)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 52.0" value={bb} onChange={e => setBb(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Tinggi Badan (cm)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 158.0" value={tb} onChange={e => setTb(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Lingkar Perut (cm)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 72.0" value={lingkarPerut} onChange={e => setLingkarPerut(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Kadar Hb (g/dL) <span className="text-xs text-muted-foreground">Anemia deteksi</span></Label>
                    <Input type="number" step="0.1" placeholder="Normal: ≥12 (P) / ≥13 (L)" value={kadarHb} onChange={e => setKadarHb(e.target.value)} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Tekanan Darah</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Sistolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: ~120" value={tensiSistolik} onChange={e => setTensiSistolik(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Diastolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: ~80" value={tensiDiastolik} onChange={e => setTensiDiastolik(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Status Gizi <span className="text-destructive">*</span></Label>
                  <Select value={statusGizi} onValueChange={(v) => setStatusGizi(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status gizi..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">✅ Normal</SelectItem>
                      <SelectItem value="Kurang">⚠️ Gizi Kurang</SelectItem>
                      <SelectItem value="Lebih">🔵 Gizi Lebih / Obesitas</SelectItem>
                      <SelectItem value="Anemia">🔴 Anemia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Catatan Edukasi</Label>
                  <Textarea
                    placeholder="Contoh: Edukasi gizi seimbang, dianjurkan konsumsi tablet tambah darah, perbanyak sayuran hijau."
                    value={catatanEdukasi}
                    onChange={e => setCatatanEdukasi(e.target.value)}
                    rows={3}
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{submitError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Batal</Button>
                  <Button onClick={onSubmitPemeriksaan} disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan Pemeriksaan"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/60 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Info Remaja
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sekolah</span>
              <span className="font-medium">{profile.sekolah || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usia</span>
              <span className="font-medium">{profile.umur} Tahun</span>
            </div>
            {latestP && (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Pemeriksaan Terakhir</p>
                <div className="flex justify-between"><span className="text-muted-foreground">BB / TB</span><span>{latestP.bb != null ? `${Number(latestP.bb).toFixed(1)} kg` : '-'} / {latestP.tb != null ? `${Number(latestP.tb).toFixed(1)} cm` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tensi</span><span>{latestP.tensiSistolik ? `${latestP.tensiSistolik}/${latestP.tensiDiastolik}` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Kadar Hb</span><span>{latestP.kadarHb != null ? `${Number(latestP.kadarHb).toFixed(1)} g/dL` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lingkar Perut</span><span>{latestP.lingkarPerut != null ? `${Number(latestP.lingkarPerut).toFixed(1)} cm` : '-'}</span></div>
              </div>
            )}
            <div className="pt-2 border-t border-border/50">
              <p className="text-muted-foreground text-xs mb-1">Alamat</p>
              <p className="font-medium">{profile.alamat || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">Riwayat Pemeriksaan</CardTitle>
            <CardDescription>Pengecekan gizi, tensi, Hb, dan edukasi kesehatan remaja.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>BB / TB</TableHead>
                  <TableHead>Tensi</TableHead>
                  <TableHead>Hb / L.Perut</TableHead>
                  <TableHead>Status Gizi</TableHead>
                  <TableHead>Edukasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.pemeriksaan?.length > 0 ? (
                  profile.pemeriksaan.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(r.tglPeriksa || r.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{r.bb != null ? `${Number(r.bb).toFixed(1)} kg` : '-'}</div>
                        <div className="text-muted-foreground">{r.tb != null ? `${Number(r.tb).toFixed(1)} cm` : ''}</div>
                      </TableCell>
                      <TableCell>
                        {r.tensiSistolik ? `${r.tensiSistolik}/${r.tensiDiastolik}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{r.kadarHb != null ? `Hb: ${Number(r.kadarHb).toFixed(1)} g/dL` : '-'}</div>
                        <div className="text-muted-foreground">{r.lingkarPerut != null ? `LP: ${Number(r.lingkarPerut).toFixed(1)} cm` : ''}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border ${getStatusBadge(r.statusGizi)}`}>
                          {r.statusGizi}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                        {r.catatanEdukasi || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Belum ada riwayat pemeriksaan. Klik "Pemeriksaan Baru" untuk memulai.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
